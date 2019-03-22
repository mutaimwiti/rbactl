import { authorize } from "../../../src";

const policiesPath = `${__dirname}/../../helpers/samplePolicies`;

describe("authorize.js - core", () => {
  it("should fail if policy is not defined", () => {
    expect(() => authorize("baz", "deactivate", [], policiesPath)).toThrow(
      Error("The [baz] policy is not defined.")
    );
  });

  it("should fail if policy does not define action", () => {
    expect(() => authorize("foo", "lock", [], policiesPath)).toThrow(
      Error("The [foo] policy does not define action [lock].")
    );
  });
});
