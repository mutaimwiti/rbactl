import expect from "expect";
import { parsePermissions } from "../../../src/permissions";
import { samplePermissionsObject } from "../../utils/permissions/helpers";

describe("permissions.js", () => {
  describe("parsePermissions()", () => {
    const parsed = parsePermissions(samplePermissionsObject);

    it("should parse all permissions", () => {
      expect(Object.keys(parsed).length).toEqual(3);
      expect(parsed).toMatchObject({ article: {}, item: {}, $all: {} });
    });

    it("should prefix the permissions with the entity - [entity.action]", () => {
      expect(parsed).toMatchObject({
        article: {
          "article.list": "List articles",
          "article.get": "Get single article",
          "article.create": "Create articles",
          "article.update": "Update articles",
          "article.remove": "Delete articles",
          "article.*": "Full articles access"
        },
        item: {
          "item.list": "List items",
          "item.get": "Get single item",
          "item.create": "Create items",
          "item.update": "Update items",
          "item.remove": "Delete items",
          "item.*": "Full items access"
        }
      });
    });

    it("should include an object ($all) with all the permissions", () => {
      expect(parsed.$all).toEqual({
        "article.list": "List articles",
        "article.get": "Get single article",
        "article.create": "Create articles",
        "article.update": "Update articles",
        "article.remove": "Delete articles",
        "article.*": "Full articles access",
        "item.list": "List items",
        "item.get": "Get single item",
        "item.create": "Create items",
        "item.update": "Update items",
        "item.remove": "Delete items",
        "item.*": "Full items access"
      });
    });
  });
});
