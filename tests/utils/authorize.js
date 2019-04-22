import { loadPolicies } from "../../src/policies";
import { authorize } from "../../src";

export const systemPolicies = loadPolicies(
  `${__dirname}/policies/samplePolicies`
);

/**
 * This is a wrapper that allows us to test authorize() without having to supply
 * policies on each and every call to it on our tests.
 *
 * @param entity
 * @param action
 * @param userPermissions
 * @param req
 * @returns {*}
 */
export default (entity, action, userPermissions, req) => {
  return authorize(action, entity, userPermissions, systemPolicies, req);
};
