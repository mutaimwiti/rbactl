const { authenticate, can, articleExists } = require("./middleware");
const controller = require("./controllers");

/**
 * A helper function to create an authorization middleware specific
 * to articles. This removes repetition of the entity argument.
 *
 * @param action
 * @returns {*}
 */
const authorizeArticle = action => {
  return can(action, "article");
};

module.exports = app => {
  app.get("/", controller.dashboard);
  app.get(
    "/article",
    authenticate,
    authorizeArticle("view"),
    controller.article.list
  );
  app.get(
    "/article/:id",
    authenticate,
    articleExists,
    authorizeArticle("view"),
    controller.article.get
  );
  app.post(
    "/article",
    authenticate,
    authorizeArticle("create"),
    controller.article.create
  );
  app.put(
    "/article/:id",
    authenticate,
    articleExists,
    authorizeArticle("update"),
    controller.article.update
  );
  app.delete(
    "/article/:id",
    authenticate,
    articleExists,
    authorizeArticle("delete"),
    controller.article.delete
  );
};
