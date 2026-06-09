const { faker } = require('@faker-js/faker');
const { Role, User, Article } = require('../../src/models');

const createRole = async (permissions = []) => {
  return Role.create({
    name: faker.person.jobTitle(),
    permissions,
  });
};

const createUser = async (overrides = {}, permissions = []) => {
  const roles = [];

  if (permissions.length) {
    const role = await createRole(permissions);
    roles.push(role._id);
  }

  return User.create({
    name: faker.person.fullName(),
    username: faker.internet.username(),
    email: faker.internet.email(),
    password: faker.internet.password(),
    roles,
    ...overrides,
  });
};

const createArticle = async (owner, overrides = {}) => {
  const articleOwner = owner || (await createUser());
  return Article.create({
    title: faker.lorem.sentence(1),
    body: faker.lorem.paragraph(1),
    owner: articleOwner._id,
    ...overrides,
  });
};

module.exports = {
  createRole,
  createUser,
  createArticle,
};
