import requireAll from 'require-all';
import { Policies, Policy } from './types';

/**
 * Loads the policies defined on the specified path. When loading, the policy
 * objects are added to an object keyed by entity.
 */
export const loadPolicies = (pathName: string): Policies => {
  const policies: Policies = {};
  const policiesObj = requireAll(pathName);
  Object.keys(policiesObj).forEach((policy) => {
    policies[policy] = (
      policiesObj[policy].default
        ? policiesObj[policy].default
        : policiesObj[policy]
    ) as Policy;
  });
  return policies;
};
