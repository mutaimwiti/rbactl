const { getArticles } = require("../__mock__");

let nextId = 3;

let articleData = getArticles();

module.exports = {
  all: () => articleData,

  find: articleId => {
    articleData.find(article => article.id === articleId);
    return articleData.find(article => article.id === articleId);
  },

  create: (ownerId, data) => {
    const article = {
      id: nextId,
      ...data,
      ownerId
    };
    articleData.push(article);
    nextId += 1;
    return article;
  },

  update: (articleId, data) => {
    let updatedArticle = null;
    articleData = articleData.map(article => {
      if (article.id === articleId) {
        updatedArticle = { ...article };
        Object.keys(data).forEach(key => {
          updatedArticle[key] = data[key];
        });
        return updatedArticle;
      }
      return article;
    });
    return updatedArticle;
  },

  delete: articleId => {
    articleData = articleData.filter(article => article.id !== articleId);
  }
};
