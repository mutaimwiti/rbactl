import { loadPolicies } from "../../src/policies";
import blog from "../helpers/samplePolicies/blog";
import foo from "../helpers/samplePolicies/foo";
import bar from "../helpers/samplePolicies/bar";

const policiesPath = `${__dirname}/../helpers/samplePolicies`;

describe("policies.js", () => {
  describe("loadPolicies", () => {
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
