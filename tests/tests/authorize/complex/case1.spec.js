import { authorize } from "../../../../src";

const policiesPath = `${__dirname}/../../../helpers/samplePolicies`;

describe("authorize.js - complex - case 1", () => {
  it("should check for authorization correctly - success", () => {
    const successCombinations = [
      ["bar.a", "bar.m", "bar.n"],
      ["bar.j"],
      ["bar.a", "bar.m", "bar.n", "bar.j"]
    ];

    successCombinations.forEach(permissions => {
      expect(authorize("bar", "create", permissions, policiesPath)).toEqual(
        true
      );
    });
  });

  it("should check for authorization correctly - failure", () => {
    const failureCombinations = [[], ["bar.n"]];

    failureCombinations.forEach(permissions => {
      expect(authorize("bar", "create", permissions, policiesPath)).toEqual(
        false
      );
    });
  });
});
