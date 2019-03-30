import expect from "expect";
import { getPermissionsMapArray } from "../../../src/permissions";
import { systemPermissions } from "../../utils/permissions/helpers";

describe("permissions.js", () => {
  describe("getPermissionsMapArray()", () => {
    it("should map permissions correctly", () => {
      expect(
        getPermissionsMapArray(systemPermissions.$all, [
          "article.list",
          "item.remove"
        ])
      ).toEqual([
        { "article.list": "List articles" },
        { "item.remove": "Delete items" }
      ]);
    });

    it("should give an empty list when passed list is empty ", () => {
      expect(getPermissionsMapArray(systemPermissions.$all, [])).toEqual([]);
    });
  });
});
