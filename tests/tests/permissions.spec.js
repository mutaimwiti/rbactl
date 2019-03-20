import expect from "expect";
import {
  hasAnyPermission,
  hasAllPermissions,
  getFullGroupPermission
} from "../../src/permissions";

describe("utils.js", () => {
  describe("getFullGroupPermission", () => {
    it("should return full group permission", () => {
      expect(getFullGroupPermission("user.create")).toEqual("user.*");
    });

    it("should return the same permission if it is a full group permission", () => {
      expect(getFullGroupPermission("blog.*")).toEqual("blog.*");
    });
  });

  describe("hasAnyPermission()", () => {
    const validPermissions = ["user.edit", "user.view", "user.update"];
    const withValidPermissions = ["user.view", "user.update"];
    const withoutValidPermissions = ["blog.edit"];

    it("should return true when user has any valid permission", () => {
      expect(hasAnyPermission(withValidPermissions, validPermissions)).toEqual(
        true
      );
    });

    it("should return false when user has no valid permission", () => {
      expect(
        hasAnyPermission(withoutValidPermissions, validPermissions)
      ).toEqual(false);
    });

    it("should return false when user has no permissions", () => {
      expect(hasAnyPermission([], validPermissions)).toEqual(false);
    });

    it("should return true when no valid permissions are provided", () => {
      expect(hasAnyPermission(withoutValidPermissions, [])).toEqual(true);
    });

    it("should return true when full group permission is provided", () => {
      expect(hasAnyPermission(["user.*"], ["user.create"])).toEqual(true);
    });

    it("should return false when an invalid full group permission is provided", () => {
      expect(hasAnyPermission(["blog.*"], ["user.create"])).toEqual(false);
    });
  });

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
