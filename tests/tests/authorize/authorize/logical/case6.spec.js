import authorize from "../../../../utils/authorize";
import { createException } from "../../../../../src/utils";

describe("authorize.js - complex - case 6", () => {
  it("should throw exception when nested promise callback id found", async () => {
    expect(() => authorize("bar", "share", ["bar.g"])).toThrow(
      createException("Unexpected nested promise callback.")
    );
  });
});
