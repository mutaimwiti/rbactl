import authorize from "../../../../utils/authorize";
import { createException } from "../../../../../src/utils";

describe("authorize.js - core", () => {
  it("should fail if policy is not defined", () => {
    expect(() => authorize("baz", "deactivate", [])).toThrow(
      createException("The [baz] policy is not defined.")
    );
  });

  it("should fail if policy does not define action", () => {
    expect(() => authorize("foo", "lock", [])).toThrow(
      createException("The [foo] policy does not define action [lock].")
    );
  });
});
