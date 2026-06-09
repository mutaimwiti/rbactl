const { faker } = require('@faker-js/faker');
const { User, Role, Article } = require('../../src/models');

const createRole = async (permissions = []) => {
  return Role.create({
    name: faker.person.jobTitle(),
    permissions,
  });
};

const createUser = async (overrides = {}, permissions = []) => {
  const user = await User.create({
    name: faker.person.fullName(),
    username: faker.internet.username(),
    password: faker.internet.password(),
    email: faker.internet.email(),
    ...overrides,
  });
  if (permissions.length) {
    const role = await createRole(permissions);
    await user.setRoles([role.id]);
  }
  return user;
};

const createArticle = async (owner, overrides = {}) => {
  const articleOwner = owner || (await createUser());
  return Article.create({
    ownerId: articleOwner.id,
    title: faker.lorem.sentence(1),
    body: faker.lorem.sentence(1),
    ...overrides,
  });
};

module.exports = {
  createRole,
  createUser,
  createArticle,
};
