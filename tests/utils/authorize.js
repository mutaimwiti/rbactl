import { loadPolicies } from "../../src/policies";
import { authorize } from "../../src";

const policies = loadPolicies(`${__dirname}/samplePolicies`);

/**
 * This is a wrapper that allows us to test authorize() without having to supply
 * policies on each and every call to it on our tests.
 *
 * @param entity
 * @param action
 * @param userPermissions
 * @returns {*}
 */
export default (entity, action, userPermissions) => {
  return authorize(entity, action, userPermissions, policies);
};
