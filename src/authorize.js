import compile from 'logical-compiler';
import { hasAllPermissions, hasAnyPermission } from './permissions';
import { createException } from './utils';

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
 *
 * @param policy
 * @param userPermissions
 * @param req
 * @returns {*}
 */
const toExpression = (policy, userPermissions, req) => {
  if (typeof policy === 'string') {
    return () => hasAllPermissions(userPermissions, [policy]);
  }

  if (typeof policy === 'function') {
    return () => policy(req);
  }

  if (Array.isArray(policy)) {
    return policy.map((sub) => toExpression(sub, userPermissions, req));
  }

  if (policy && typeof policy === 'object') {
    return Object.fromEntries(
      Object.entries(policy).map(([key, value]) => {
        if (LIST_OPERATORS.includes(key)) {
          return [
            key,
            value.map((sub) => toExpression(sub, userPermissions, req)),
          ];
        }
        if (key === '$not') {
          return [key, toExpression(value, userPermissions, req)];
        }
        // any / all (and any unrecognized key) are left for logical-compiler
        // to route to `fns` or to reject with a descriptive error.
        return [key, value];
      }),
    );
  }

  return policy;
};

/**
 * Authorize an action policy against the user permissions. The boolean rule
 * evaluation is delegated to logical-compiler; the any and all rules are
 * supplied as compiler functions bound to the user's permissions.
 *
 * @param userPermissions
 * @param actionPolicy
 * @param req
 * @returns {boolean|Promise<boolean>}
 */
export const authorizeActionAgainstPolicy = (
  userPermissions,
  actionPolicy,
  req,
) => {
  const fns = {
    any: (...permissions) => hasAnyPermission(userPermissions, permissions),
    all: (...permissions) => hasAllPermissions(userPermissions, permissions),
  };

  return compile(toExpression(actionPolicy, userPermissions, req), { fns });
};

/**
 * Authorize a user action on an entity based on the user permissions and
 * system policies. All occurrences of the callback rule are called with
 * the req object. This allows the user to authorize based on req
 * parameters.
 *
 * An entity policy may define a `$grant` rule. It is evaluated before the
 * action policy and, if it passes, authorizes the action regardless of the
 * action policy - useful for granting a privileged user (e.g. an admin) access
 * to every action on the entity. The action must still be defined.
 *
 * @param action
 * @param entity
 * @param userPermissions
 * @param policies
 * @param req
 * @returns {*}
 */
export const authorize = (
  action,
  entity,
  userPermissions,
  policies,
  req = {},
) => {
  const policy = policies[entity];

  if (policy) {
    const actionPolicy = policy[action];
    if (actionPolicy) {
      // `$grant` short-circuits to authorized when it passes; otherwise the
      // action policy decides. Expressed as `$grant OR action` so the compiler
      // handles the short-circuit and any async rules.
      const effectivePolicy =
        policy.$grant !== undefined
          ? { $or: [policy.$grant, actionPolicy] }
          : actionPolicy;
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

/**
 * Create a 'can' function for your app based on system policies. The can function
 * is used to create authorization middleware for a specific action on a specific
 * entity. createCan expects the following arguments:
 *
 * - policies - the system policies definition.
 * - userPermissionsResolver - an handler that is triggered to get user permissions.
 * - unauthorizedRequestHandler - an handler that is triggered if the user is not
 *   authorized to make the request.
 * - authorizationExceptionHandler - an handler that is triggered if an exception
 *   occurs when trying to get user permissions, check authorization or when
 *   triggering unauthorizedRequestHandler.
 *
 * @param policies
 * @param userPermissionsResolver
 * @param unauthorizedRequestHandler
 * @param authorizationExceptionHandler
 * @returns {function(*=, *=): Function}
 */
export const createCan = (
  policies,
  userPermissionsResolver,
  unauthorizedRequestHandler,
  authorizationExceptionHandler,
) => {
  return (action, entity) => {
    return async (req, res, next) => {
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
