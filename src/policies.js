import requireAll from "require-all";

/**
 * Loads the policies defined on the specified path. When loading, the policy
 * objects are added to an object.
 *
 * @param pathName
 */
export const loadPolicies = pathName => {
  const policies = {};
  const policiesObj = requireAll(pathName);
  Object.keys(policiesObj).forEach(policy => {
    policies[policy] = policiesObj[policy].default;
  });
  return policies;
};
