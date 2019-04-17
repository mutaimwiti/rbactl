import authorize from "../../../utils/authorize";

describe("authorize.js - core", () => {
  it("should fail if policy is not defined", () => {
    expect(() => authorize("baz", "deactivate", [])).toThrow(
      Error("The [baz] policy is not defined.")
    );
  });

  it("should fail if policy does not define action", () => {
    expect(() => authorize("foo", "lock", [])).toThrow(
      Error("The [foo] policy does not define action [lock].")
    );
  });
});
