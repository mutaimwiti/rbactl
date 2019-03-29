import { hasAllPermissions, hasAnyPermission } from "./permissions";

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
  const authorize = policy => {
    const operators = { $or: "some", $and: "every" };
    const fns = {
      any: permissions => hasAnyPermission(userPermissions, permissions),
      all: permissions => hasAllPermissions(userPermissions, permissions)
    };

    if (typeof policy === "string")
      return hasAllPermissions(userPermissions, [policy]);

    if (typeof policy === "function") return policy(req);

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
 * parameters.
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
      return authorizeActionAgainstPolicy(userPermissions, actionPolicy, req);
    }
    throw Error(`The [${entity}] policy does not define action [${action}].`);
  }
  throw Error(`The [${entity}] policy is not defined.`);
};
