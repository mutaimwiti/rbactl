const { Article } = require("../models");

module.exports = {
  list: async (req, res) => {
    const articles = await Article.find({}).populate("owner", "-password");
    return res.json({ articles });
  },

  get: async (req, res) => {
    return res.json({ article: req.context.article });
  },

  create: async (req, res) => {
    const article = await Article.create({ ...req.body, owner: req.user.id });
    return res.json({ article, message: "Article created successfully." });
  },

  update: async (req, res) => {
    const { article } = req.context;
    const { title, body } = req.body;

    article.title = title;
    article.body = body;
    await article.save();

    return res.json({ article, message: "Article updated successfully." });
  },

  delete: async (req, res) => {
    await Article.findOneAndDelete({ _id: req.context.article.id });
    return res.json({ message: "Article deleted successfully." });
  }
};
