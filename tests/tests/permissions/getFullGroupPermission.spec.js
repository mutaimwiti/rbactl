import expect from "expect";
import { getFullGroupPermission } from "../../../src/permissions";

describe("permissions.js", () => {
  describe("getFullGroupPermission()", () => {
    it("should return full group permission", () => {
      expect(getFullGroupPermission("user.create")).toEqual("user.*");
    });

    it("should return the same permission if it is a full group permission", () => {
      expect(getFullGroupPermission("blog.*")).toEqual("blog.*");
    });
  });
});
