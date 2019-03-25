import expect from "expect";
import { validatePermissions } from "../../../src/permissions";
import { systemPermissions } from "../../utils/permissions";

describe("permissions.js", () => {
  describe("validatePermissions()", () => {
    it("should fail when there are invalid permissions", () => {
      const withInvalids = ["article.update", "user.create", "user.remove"];

      expect(validatePermissions(systemPermissions.$all, withInvalids)).toEqual(
        {
          isValid: false,
          invalids: ["user.create", "user.remove"]
        }
      );
    });

    it("should pass with valid permissions", () => {
      const onlyValid = ["article.list", "article.get"];

      expect(validatePermissions(systemPermissions.$all, onlyValid)).toEqual({
        isValid: true,
        invalids: []
      });
    });

    it("should fail when all system permissions array is empty", () => {
      expect(validatePermissions({}, ["article.create"])).toEqual({
        isValid: false,
        invalids: ["article.create"]
      });
    });
  });
});
