import { authorize } from "../../../src";

const policiesPath = `${__dirname}/../../helpers/samplePolicies`;

describe("authorize.js - basic", () => {
  it("should check for authorization correctly - success", () => {
    // foo.load expects user to have "foo.q" permission
    const successCombinations = [["foo.q"], ["foo.q", "foo.r"]];

    successCombinations.forEach(permissions => {
      expect(authorize("foo", "dive", permissions, policiesPath)).toEqual(true);
    });
  });

  it("should check for authorization correctly - failure", () => {
    // foo.load expects user to have "foo.q" permission
    const failureCombinations = [[], ["foo.r"]];

    failureCombinations.forEach(permissions => {
      expect(authorize("foo", "dive", permissions, policiesPath)).toEqual(
        false
      );
    });
  });
});
