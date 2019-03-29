const { app, eachUser } = require("../../utils");

const apiUpdate = (user = null) => {
  return app
    .put("/article/1")
    .set("Authorization", user)
    .send();
};

describe("update", () => {
  it("should not allow unauthenticated users", async () => {
    const res = await apiUpdate();

    expect(res.status).toEqual(401);
  });

  it("should not allow unauthorized users", async () => {
    const unAuthorizedUsers = [2, 3, 4]; // don't own the article

    eachUser(unAuthorizedUsers, async user => {
      const res = await apiUpdate(user);

      expect(res.status).toEqual(403);
    });
  });

  it("should only allow authorized users", async () => {
    const res = await apiUpdate(1);

    expect(res.status).toEqual(200);
  });
});
