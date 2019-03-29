const { app, eachUser } = require("../../utils");

const apiList = (user = null) => {
  return app
    .get("/article")
    .set("Authorization", user)
    .send();
};

describe("list", () => {
  it("should not allow unauthenticated users", async () => {
    const res = await apiList();

    expect(res.status).toBe(401);
  });

  it("should not allow unauthorized users", async () => {
    const res = await apiList(4); // doesn't have view permission

    expect(res.status).toBe(403);
  });

  it("should only allow authorized users", async () => {
    const authorizedUsers = [1, 3]; // have view permission

    eachUser(authorizedUsers, async user => {
      const res = await apiList(user);

      expect(res.status).toBe(200);
    });
  });
});
