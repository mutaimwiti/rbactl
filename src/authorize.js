import { hasAllPermissions, hasAnyPermission } from "./permissions";
import { createException } from "./utils";

/**
 * Credit - https://stackoverflow.com/questions/55240828
 *
 * @param userPermissions
 * @param actionPolicy
 * @param req
 * @returns {*|*|*}
 */
export const authorizeActionAgainstPolicy = (
  userPermissions,
  actionPolicy,
  req
) => {
  let callCount = 0;

  const authorize = policy => {
    callCount += 1;
    const operators = { $or: "some", $and: "every" };
    const fns = {
      any: permissions => hasAnyPermission(userPermissions, permissions),
      all: permissions => hasAllPermissions(userPermissions, permissions)
    };

    if (typeof policy === "string")
      return hasAllPermissions(userPermissions, [policy]);

    if (typeof policy === "function") {
      const result = policy(req);
      if (result instanceof Promise && callCount > 1) {
        throw createException("Unexpected nested promise callback.");
      }
      return result;
    }

    if (!policy || typeof policy !== "object") return false;

    const [key, value] = Object.entries(policy)[0];

    if (key in operators) return value[operators[key]](authorize);
    if (key in fns) return fns[key](value);
    return false;
  };

  return authorize(actionPolicy);
};

/**
 * Authorize a user action on an entity based on the user permissions and
 * system policies. All occurrences of the callback rule are called with
 * the req object. This allows the user to authorize based on req
 * paramet`ers.
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
  req = {}
) => {
  const policy = policies[entity];

  if (policy) {
    const actionPolicy = policy[action];
    if (actionPolicy) {
      try {
        return authorizeActionAgainstPolicy(userPermissions, actionPolicy, req);
      } catch (e) {
        // an exception occurs if a promise callback is encountered
        throw e;
      }
    }
    throw createException(
      `The [${entity}] policy does not define action [${action}].`
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
  authorizationExceptionHandler
) => {
  return (action, entity) => {
    return async (req, res, next) => {
      try {
        if (
          !(await authorize(
            action,
            entity,
            await userPermissionsResolver(req),
            policies,
            req
          ))
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
