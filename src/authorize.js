import { loadPolicies } from "./policies";
import { hasAllPermissions, hasAnyPermission } from "./permissions";

/**
 * Credit - https://stackoverflow.com/questions/55240828
 *
 * @param userPermissions
 * @param actionPolicy
 * @returns {*|*|*}
 */
export const authorizeActionAgainstPolicy = (userPermissions, actionPolicy) => {
  const authorize = policy => {
    const operators = { $or: "some", $and: "every" };
    const fns = {
      any: permissions => hasAnyPermission(userPermissions, permissions),
      all: permissions => hasAllPermissions(userPermissions, permissions)
    };

    if (typeof policy === "string")
      return hasAllPermissions(userPermissions, [policy]);

    if (typeof policy === "function") return policy();

    if (!policy || typeof policy !== "object") return false;

    const [key, value] = Object.entries(policy)[0];

    if (key in operators) return value[operators[key]](authorize);
    if (key in fns) return fns[key](value);
    return false;
  };

  return authorize(actionPolicy);
};

export default (entity, action, userPermissions, policiesPath) => {
  const policies = loadPolicies(policiesPath);

  const policy = policies[entity];

  if (policy) {
    const actionPolicy = policy[action];
    if (actionPolicy) {
      return authorizeActionAgainstPolicy(userPermissions, actionPolicy);
    }
    throw Error(`The [${entity}] policy does not define action [${action}].`);
  }
  throw Error(`The [${entity}] policy is not defined.`);
};
