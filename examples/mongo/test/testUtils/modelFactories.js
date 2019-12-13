const faker = require('faker');
const { Role, User, Article } = require('../../app/models');

const createRole = async (permissions = []) => {
  return Role.create({
    name: faker.name.jobTitle(),
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
    name: faker.fake('{{name.firstName}} {{name.lastName}}'),
    username: faker.internet.userName(),
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
