const {
  app,
  eachPermission,
  createUser,
  createArticle
} = require("../../utils");

const apiDelete = articleId => {
  return app.delete(`/article/${articleId}`).send();
};

describe("delete", () => {
  let owner;
  let articleId;

  beforeAll(async () => {
    owner = await createUser();
    articleId = (await createArticle(owner)).id;
  });

  it("should not allow unauthenticated users", async () => {
    const res = await apiDelete(articleId);

    expect(res.status).toEqual(401);
  });

  it("should not allow unauthorized users", async () => {
    await eachPermission(["article.*", "article.something"], async () => {
      const res = await apiDelete(articleId);

      expect(res.status).toEqual(403);
    });
  });

  it("should only allow authorized users", async () => {
    await app.login(owner);

    const res = await apiDelete(articleId);

    expect(res.status).toEqual(200);
  });
});
