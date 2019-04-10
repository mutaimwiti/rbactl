const Role = require("./role");
const User = require("./user");
const Article = require("./article");

const models = {
  Role,
  User,
  Article
};

Object.keys(models).forEach(modelName => {
  const { addRelationships } = models[modelName];
  if (addRelationships) {
    models[modelName] = { ...models[modelName], ...addRelationships(models) };
  }
});

module.exports = models;
