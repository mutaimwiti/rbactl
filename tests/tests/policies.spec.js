import { loadPolicies } from "../../src/policies";
import blog from "../helpers/samplePolicies/blog";
import foo from "../helpers/samplePolicies/foo";

const policiesPath = `${__dirname}/../helpers/samplePolicies`;

describe("policies.js", () => {
  describe("loadPolicies", () => {
    it("should load all policies", () => {
      const loaded = loadPolicies(policiesPath);
      expect(Object.keys(loaded).length).toEqual(2);
      expect(loaded).toMatchObject({ blog: {}, foo: {} });
    });

    it("should load the exact definition of policies", () => {
      expect(loadPolicies(policiesPath)).toMatchObject({ blog, foo });
    });
  });
});
