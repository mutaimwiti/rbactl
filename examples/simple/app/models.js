const { users, articles } = require("./__mock__");

const usersData = users;
let articlesData = articles;

// User model
const User = {
  find: userId => {
    return usersData.find(({ id }) => id === userId);
  }
};

// Article model
const Article = {
  all: () => articlesData,
  find: articleId => {
    return articlesData.find(article => article.id === articleId);
  },
  create: (ownerId, data) => {
    const latestId = articlesData[articlesData.length - 1].id;
    const article = {
      id: latestId + 1,
      ...data,
      ownerId
    };
    articlesData.push(article);
    return article;
  },
  update: (articleId, data) => {
    let updatedArticle = null;
    articlesData = articlesData.map(article => {
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
    articlesData = articlesData.filter(article => article.id !== articleId);
  }
};

module.exports = {
  User,
  Article
};
