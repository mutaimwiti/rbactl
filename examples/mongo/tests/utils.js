const supertest = require("supertest");
const faker = require("faker");
const appDef = require("../app");
const { Role, User, Article } = require("../app/models");
const { generateAuthToken } = require("../app/utils");

const createRole = async (permissions = []) => {
  return Role.create({
    name: faker.name.jobTitle(),
    permissions
  });
};

const createUser = async (overrides = {}, permissions = []) => {
  const roles = [];

  if (permissions.length) {
    const role = await createRole(permissions);
    roles.push(role._id);
  }

  return User.create({
    name: faker.fake("{{name.firstName}} {{name.lastName}}"),
    username: faker.internet.userName(),
    password: faker.internet.password(),
    roles,
    ...overrides
  });
};

const createArticle = async (owner, overrides = {}) => {
  const articleOwner = owner || (await createUser());
  return Article.create({
    title: faker.lorem.sentence(1),
    body: faker.lorem.paragraph(1),
    ownerId: articleOwner._id,
    ...overrides
  });
};

const app = {
  token: null,

  /**
   * Login a user by passing an existing user object. Also, specify the user
   * permissions.
   *
   * @param user
   * @param permissions
   * @returns {Promise<void>}
   */
  async login(user, permissions = []) {
    const roles = [];

    if (permissions.length) {
      const role = await createRole(permissions);
      roles.push(role._id);
    }

    // eslint-disable-next-line
    user.roles = roles;
    await user.save();

    this.token = await generateAuthToken(user);
  },

  /**
   * Login a randomly generated user that has the permissions provided. Behind
   * the scenes it creates a group with the permissions and attaches the
   * user to it.
   *
   * @param permissions
   * @returns {Promise<void>}
   */
  async loginRandom(permissions = []) {
    const roles = [];

    if (permissions.length) {
      const role = await createRole(permissions);
      roles.push(role._id);
    }

    const user = await createUser({ roles });
    this.token = await generateAuthToken(user);
    return user;
  },

  /**
   * Call this method to logout the currently logged in user.
   */
  logout() {
    this.token = null;
  },

  req: supertest(appDef),

  /**
   * Add authorization header to the specified supertest request object.
   * @param request
   * @returns {*}
   */
  addAuthorization(request) {
    return this.token ? request.set("authorization", `${this.token}`) : request;
  },

  /**
   * Make a get request with the authorization header (token) set if a user is
   * logged in.
   *
   * @param url
   * @returns {*}
   */
  get(url) {
    const request = this.req.get(url);

    return this.addAuthorization(request);
  },

  /**
   * Make a post request with the authorization header (token) set if a user is
   * logged in.
   *
   * @param url
   * @returns {*}
   */
  post(url) {
    const request = this.req.post(url);

    return this.addAuthorization(request);
  },

  /**
   * Make a put request with the authorization header (token) set if a user is
   * logged in.
   *
   * @param url
   * @returns {*}
   */
  put(url) {
    const request = this.req.put(url);

    return this.addAuthorization(request);
  },

  /**
   * Make a delete request with the authorization header (token) set if a user is
   * logged in.
   *
   * @param url
   * @returns {*}
   */
  delete(url) {
    const request = this.req.delete(url);

    return this.addAuthorization(request);
  }
};

/**
 * Run a supertest test block separately for
 * each of the users.
 *
 * @param permissions
 * @param testBlock
 */
const eachPermission = async (permissions, testBlock) => {
  app.logout();

  for (let i = 0; i < permissions.length; i += 1) {
    /* eslint-disable*/
    await app.loginRandom(permissions[i]);
    await testBlock();
  }
};

module.exports = {
  app,
  eachPermission,
  createRole,
  createUser,
  createArticle
};
