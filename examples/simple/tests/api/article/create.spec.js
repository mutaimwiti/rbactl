const { app, eachUser } = require("../../utils");

const apiCreate = (user = null, data = {}) => {
  return app
    .post("/article")
    .set("Authorization", user)
    .send(data);
};

describe("create", () => {
  it("should not allow unauthenticated users", async () => {
    const res = await apiCreate();

    expect(res.status).toBe(401);
  });

  it("should not allow unauthorized users", async () => {
    const unAuthorizedUsers = [2, 4]; // don't have permission to create

    eachUser(unAuthorizedUsers, async user => {
      const res = await apiCreate(user);

      expect(res.status).toBe(403);
    });
  });

  it("should only allow authorized users", async () => {
    const authorizedUsers = [1, 3]; // have permission to create

    eachUser(authorizedUsers, async user => {
      const res = await apiCreate(user, {
        title: "My updated article",
        body: "It's updated. Right?"
      });

      expect(res.status).toBe(200);
    });
  });
});
