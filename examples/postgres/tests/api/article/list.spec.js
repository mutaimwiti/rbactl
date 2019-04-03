const { app, eachPermission } = require("../../utils");

const apiList = () => {
  return app.get("/article").send();
};

describe("list", () => {
  it("should not allow unauthenticated users", async () => {
    const res = await apiList();

    expect(res.status).toBe(401);
  });

  it("should not allow unauthorized users", async () => {
    await app.loginRandom(); // doesn't have view permission

    const res = await apiList();

    expect(res.status).toBe(403);
  });

  it("should only allow authorized users", async () => {
    const allowedPermissions = [
      "article.view",
      "article.create",
      "article.update",
      "article.delete"
    ];

    await eachPermission(allowedPermissions, async user => {
      const res = await apiList(user);

      expect(res.status).toBe(200);
    });
  });
});
