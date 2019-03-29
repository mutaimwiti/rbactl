const { app, eachUser } = require("../../utils");

const apiDelete = (user = null) => {
  return app
    .delete("/article/2")
    .set("Authorization", user)
    .send();
};

describe("delete", () => {
  it("should not allow unauthenticated users", async () => {
    const res = await apiDelete();

    expect(res.status).toEqual(401);
  });

  it("should not allow unauthorized users", async () => {
    const unAuthorizedUsers = [1, 3, 4]; // don't own the article

    eachUser(unAuthorizedUsers, async user => {
      const res = await apiDelete(user);

      expect(res.status).toEqual(403);
    });
  });

  it("should only allow authorized users", async () => {
    const res = await apiDelete(2);

    expect(res.status).toEqual(200);
  });
});
