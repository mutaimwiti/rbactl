import compile = require('logical-compiler');
import { hasAllPermissions, hasAnyPermission } from './permissions';
import { createException } from './utils';
import { Permission, Permissions, Policies, Rule } from './types';

type Expression = compile.Expression;
type Fn = compile.Fn;

// Operators whose value is a list of sub-policies.
const LIST_OPERATORS = ['$and', '$or', '$nor'];

/**
 * Adapt an rbactl policy into a logical-compiler expression.
 *
 * rbactl's policy DSL differs from logical-compiler's expression grammar in two
 * places that need wrapping into the compiler's zero-argument callbacks:
 *
 * - a bare string is a permission check (the user must hold that permission);
 * - a callback is invoked with the request object.
 *
 * Everything else - the boolean logic of $and/$or/$not/$nor, short-circuiting,
 * synchronous vs. promise-returning rules (at any nesting depth) and implicit
 * AND across the keys of an object - is handled by logical-compiler. The any
 * and all rules are passed through untouched and routed to the compiler's
 * `fns` (see authorizeActionAgainstPolicy).
 */
const toExpression = (
  policy: Rule,
  userPermissions: Permissions,
  req: any,
): Expression => {
  if (typeof policy === 'string') {
    return () => hasAllPermissions(userPermissions, [policy]);
  }

  if (typeof policy === 'function') {
    return () => policy(req);
  }

  return Object.fromEntries(
    Object.entries(policy).map(([key, value]) => {
      if (LIST_OPERATORS.includes(key)) {
        return [
          key,
          (value as Rule[]).map((sub) =>
            toExpression(sub, userPermissions, req),
          ),
        ];
      }

      if (key === '$not') {
        return [key, toExpression(value as Rule, userPermissions, req)];
      }

      // any / all (and any unrecognized key) are left for logical-compiler
      // to route to `fns` or to reject with a descriptive error.
      return [key, value];
    }),
  ) as Expression;
};

/**
 * Authorize an action policy against the user permissions. The boolean rule
 * evaluation is delegated to logical-compiler; the any and all rules are
 * supplied as compiler functions bound to the user's permissions.
 */
export const authorizeActionAgainstPolicy = (
  userPermissions: Permissions,
  actionPolicy: Rule,
  req: any,
): boolean | Promise<boolean> => {
  const fns: Record<string, Fn> = {
    any: (...permissions: Permission[]) =>
      hasAnyPermission(userPermissions, permissions),
    all: (...permissions: Permission[]) =>
      hasAllPermissions(userPermissions, permissions),
  };

  return compile(toExpression(actionPolicy, userPermissions, req), { fns });
};

/**
 * Authorize a user action on an entity based on the user permissions and
 * system policies. All occurrences of the callback rule are called with
 * the req object. This allows the user to authorize based on req
 * parameters.
 *
 * An entity policy may define two optional override rules that are evaluated
 * before the action policy:
 *
 * - `$grant` - if it passes, the action is authorized regardless of the action
 *   policy (e.g. an admin who may perform any action).
 * - `$deny` - if it passes, the action is denied regardless of `$grant` or the
 *   action policy (e.g. a suspended user who may perform none).
 *
 * `$deny` takes precedence over `$grant`, which takes precedence over the
 * action policy, i.e. authorization is `NOT $deny AND ($grant OR action)`. The
 * action must still be defined; the overrides do not apply to undeclared
 * actions.
 */
export const authorize = (
  action: string,
  entity: string,
  userPermissions: Permissions,
  policies: Policies,
  req: any = {},
): boolean | Promise<boolean> => {
  const policy = policies[entity];

  if (policy) {
    const actionPolicy = policy[action];
    if (actionPolicy) {
      // Compose the overrides around the action policy as
      // `NOT $deny AND ($grant OR action)`, omitting whichever hooks are not
      // defined. The compiler handles short-circuiting (so `$deny` is checked
      // first and can deny without evaluating the rest) and any async rules.
      let effectivePolicy: Rule = actionPolicy;

      if (policy.$grant !== undefined) {
        effectivePolicy = { $or: [policy.$grant, effectivePolicy] };
      }

      if (policy.$deny !== undefined) {
        effectivePolicy = { $and: [{ $not: policy.$deny }, effectivePolicy] };
      }

      return authorizeActionAgainstPolicy(
        userPermissions,
        effectivePolicy,
        req,
      );
    }

    throw createException(
      `The [${entity}] policy does not define action [${action}].`,
    );
  }

  throw createException(`The [${entity}] policy is not defined.`);
};

type UserPermissionsResolver = (req: any) => Permissions | Promise<Permissions>;
type RequestHandler = (req: any, res: any, next: any) => any;
type ExceptionHandler = (req: any, res: any, next: any, error: unknown) => any;

/**
 * Create a 'can' function for your app based on system policies. The can
 * function is used to create authorization middleware for a specific action on
 * a specific entity. createCan expects the following arguments:
 *
 * - policies - the system policies definition.
 * - userPermissionsResolver - a handler that is triggered to get user
 *   permissions.
 * - unauthorizedRequestHandler - a handler that is triggered if the user is not
 *   authorized to make the request.
 * - authorizationExceptionHandler - a handler that is triggered if an exception
 *   occurs when trying to get user permissions, check authorization or when
 *   triggering unauthorizedRequestHandler.
 */
export const createCan = (
  policies: Policies,
  userPermissionsResolver: UserPermissionsResolver,
  unauthorizedRequestHandler: RequestHandler,
  authorizationExceptionHandler: ExceptionHandler,
) => {
  return (action: string, entity: string) => {
    return async (req: any, res: any, next: any) => {
      try {
        if (
          (await authorize(
            action,
            entity,
            await userPermissionsResolver(req),
            policies,
            req,
          )) !== true
        ) {
          return unauthorizedRequestHandler(req, res, next);
        }
        return next();
      } catch (e) {
        return authorizationExceptionHandler(req, res, next, e);
      }
    };
  };
};
