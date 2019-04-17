import authorize from "../../../utils/authorize";

describe("authorize.js - complex - case 6", () => {
  it("should throw exception when nested promise callback id found", async () => {
    expect(() => authorize("bar", "share", ["bar.g"])).toThrow(
      Error("Unexpected nested promise callback.")
    );
  });
});
