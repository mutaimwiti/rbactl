import { authorize } from "../../../../src";

/*
A simple policies definition in an object. Can be very useful for small apps.
 */
const policies = {
  article: {
    create: "article.create",
    remove: "article.remove"
  },
  user: {
    update: "user.update"
  }
};

describe("authorize.js - simple policies", () => {
  it("should check for authorization correctly - success", () => {
    const permissions = ["article.create", "article.remove", "user.update"];
    expect(authorize("article", "create", permissions, policies)).toEqual(true);
    expect(authorize("article", "remove", permissions, policies)).toEqual(true);
    expect(authorize("user", "update", permissions, policies)).toEqual(true);
  });

  it("should check for authorization correctly - failure", () => {
    expect(authorize("article", "create", [], policies)).toEqual(false);
    expect(authorize("article", "remove", [], policies)).toEqual(false);
    expect(authorize("user", "update", [], policies)).toEqual(false);
  });
});
