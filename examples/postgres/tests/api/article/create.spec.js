const { app, eachPermission } = require("../../utils");

const apiCreate = (data = {}) => {
  return app.post("/article").send(data);
};

describe("create", () => {
  it("should not allow unauthenticated users", async () => {
    const res = await apiCreate();

    expect(res.status).toBe(401);
  });

  it("should not allow unauthorized users", async () => {
    await eachPermission(["article.view", "article.something"], async () => {
      const res = await apiCreate();

      expect(res.status).toBe(403);
    });
  });

  it("should only allow authorized users", async () => {
    await eachPermission(["article.*", "article.create"], async () => {
      const res = await apiCreate({
        title: "My updated article",
        body: "It's updated. Right?"
      });

      expect(res.status).toBe(200);
    });
  });
});
