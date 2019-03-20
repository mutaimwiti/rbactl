import requireAll from "require-all";

export const loadPolicies = pathName => {
  const policies = {};
  const policiesObj = requireAll(pathName);
  Object.keys(policiesObj).forEach(policy => {
    policies[policy] = policiesObj[policy].default;
  });
  return policies;
};
