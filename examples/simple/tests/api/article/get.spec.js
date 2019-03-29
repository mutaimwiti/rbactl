const { app, eachUser } = require("../../utils");

const apiGet = (user = null) => {
  return app
    .get("/article/1")
    .set("Authorization", user)
    .send();
};

describe("get", () => {
  it("should not allow unauthenticated users", async () => {
    const res = await apiGet();

    expect(res.status).toBe(401);
  });

  it("should not allow unauthorized users", async () => {
    const res = await apiGet(4); // doesn't have view permission

    expect(res.status).toBe(403);
  });

  it("should only allow authorized users", async () => {
    const authorizedUsers = [1, 3]; // have view permission

    eachUser(authorizedUsers, async user => {
      const res = await apiGet(user);

      expect(res.status).toBe(200);
    });
  });
});
