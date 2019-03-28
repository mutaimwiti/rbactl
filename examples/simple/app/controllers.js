const { Article } = require("./models");

module.exports = {
  // dashboard
  dashboard: (req, res) => {
    return res.json({ message: "Welcome" });
  },
  // article
  article: {
    list: (req, res) => {
      const articles = Article.all();
      return res.json({ articles });
    },
    get: (req, res) => {
      const article = Article.find(Number(req.params.id));
      return res.json({ article });
    },
    create: (req, res) => {
      const article = Article.create(req.user.id, req.body);
      return res.json({ article, message: "Article created successfully." });
    },
    update: (req, res) => {
      const article = Article.update(Number(req.params.id), req.body);
      return res.json({ article, message: "Article updated successfully." });
    },
    delete: (req, res) => {
      Article.delete(Number(req.params.id));
      return res.json({ message: "Article deleted successfully." });
    }
  }
};
