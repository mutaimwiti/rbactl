import { loadPolicies } from "../../src/policies";
import blog from "../utils/policies/samplePolicies/blog";
import foo from "../utils/policies/samplePolicies/foo";
import bar from "../utils/policies/samplePolicies/bar";

const policiesPath = `${__dirname}/../utils/policies/samplePolicies`;

describe("policies.js", () => {
  describe("loadPolicies()", () => {
    it("should load all policies", () => {
      const loaded = loadPolicies(policiesPath);
      expect(Object.keys(loaded).length).toEqual(3);
      expect(loaded).toMatchObject({ blog: {}, foo: {}, bar: {} });
    });

    it("should load the exact definition of policies", () => {
      expect(loadPolicies(policiesPath)).toMatchObject({ blog, foo, bar });
    });
  });
});
