import { authorize } from "../../../../src";

const policiesPath = `${__dirname}/../../../helpers/samplePolicies`;

describe("authorize.js - complex - case 4", () => {
  it("should check for authorization correctly - success", () => {
    const successCombinations = [
      ["bar.g", "bar.h", "bar.i", "bar.j"],
      ["bar.h", "bar.h", "bar.i", "bar.j"],

      ["bar.r"],
      ["bar.s"],
      ["bar.r", "bar.s"],

      ["bar.g", "bar.h", "bar.i", "bar.j", "bar.r"],
      ["bar.g", "bar.h", "bar.i", "bar.j", "bar.s"],
      ["bar.g", "bar.h", "bar.i", "bar.j", "bar.r", "bar.s"],

      ["bar.h", "bar.h", "bar.i", "bar.j", "bar.r"],
      ["bar.h", "bar.h", "bar.i", "bar.j", "bar.s"],
      ["bar.h", "bar.h", "bar.i", "bar.j", "bar.r", "bar.s"]
    ];

    successCombinations.forEach(permissions => {
      expect(authorize("bar", "remove", permissions, policiesPath)).toEqual(
        true
      );
    });
  });

  it("should check for authorization correctly - failure", () => {
    const failureCombinations = [[], ["bar.i"], ["bar.j"]];

    failureCombinations.forEach(permissions => {
      expect(authorize("bar", "remove", permissions, policiesPath)).toEqual(
        false
      );
    });
  });
});
