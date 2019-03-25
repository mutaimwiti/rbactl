import expect from "expect";
import { hasAllPermissions } from "../../../src/permissions";

describe("permissions.js", () => {
  describe("hasAllPermissions()", () => {
    const requiredPermissions = ["user.view", "user.edit"];
    const withRequiredPermissions = ["user.view", "user.edit", "group.update"];
    const withoutRequiredPermissions = ["group.edit"];

    it("should return true when user has all required permissions", () => {
      expect(
        hasAllPermissions(withRequiredPermissions, requiredPermissions)
      ).toEqual(true);
    });

    it("should return false when user is missing any of the required permissions", () => {
      expect(
        hasAllPermissions(withoutRequiredPermissions, requiredPermissions)
      ).toEqual(false);
    });

    it("should return false when user has no permissions", () => {
      expect(hasAllPermissions([], requiredPermissions)).toEqual(false);
    });

    it("should return true when required permissions are not provided", () => {
      expect(hasAllPermissions(withoutRequiredPermissions, [])).toEqual(true);
    });

    it("should return true when full group permission is provided", () => {
      expect(
        hasAllPermissions(["user.*", "blog.*"], ["user.create", "blog.delete"])
      ).toEqual(true);
    });

    it("should return false when an invalid full group permission is provided", () => {
      expect(
        hasAllPermissions(["user.*", "blog.*"], ["user.create", "comment.edit"])
      ).toEqual(false);
    });
  });
});
