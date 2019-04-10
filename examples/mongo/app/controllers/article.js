const { Article } = require("../models");

module.exports = {
  list: (req, res) => {
    const articles = Article.all();
    return res.json({ articles });
  },

  get: (req, res) => {
    return res.json({ article: req.context.article });
  },

  create: (req, res) => {
    const article = Article.create(req.user.id, req.body);
    return res.json({ article, message: "Article created successfully." });
  },

  update: (req, res) => {
    const article = Article.update(req.context.article.id, req.body);
    return res.json({ article, message: "Article updated successfully." });
  },

  delete: (req, res) => {
    Article.delete(req.context.article.id);
    return res.json({ message: "Article deleted successfully." });
  }
};
