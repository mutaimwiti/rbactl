const supertest = require("supertest");
const faker = require("faker");
const appDef = require("../app");
const { Role, User, Article } = require("../app/models");
const { generateAuthToken } = require("../app/utils");

const createRole = (permissions = []) => {
  return Role.create({
    name: faker.name.jobTitle(),
    permissions
  });
};

const createUser = (overrides = {}, permissions = []) => {
  const roles = [];

  if (permissions.length) {
    roles.push(createRole(permissions).id);
  }

  return User.create({
    name: faker.fake("{{name.firstName}} {{name.lastName}}"),
    username: faker.internet.userName(),
    password: faker.internet.password(),
    roles,
    ...overrides
  });
};

const createArticle = (owner, overrides = {}) => {
  const articleOwner = owner || createUser();
  return Article.create(articleOwner.id, {
    title: faker.lorem.sentence(1),
    body: faker.lorem.paragraph(1),
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
  login(user, permissions = []) {
    const roles = [];

    if (permissions.length) {
      roles.push(createRole(permissions).id);
    }

    User.update(user.id, { ...user, roles });
    this.token = generateAuthToken(user);
  },

  /**
   * Login a randomly generated user that has the permissions provided. Behind
   * the scenes it creates a group with the permissions and attaches the
   * user to it.
   *
   * @param permissions
   * @returns {Promise<void>}
   */
  loginRandom(permissions = []) {
    const roles = [];

    if (permissions.length) {
      roles.push(createRole(permissions).id);
    }

    const user = createUser({ roles });
    this.token = generateAuthToken(user);
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
const eachPermission = (permissions, testBlock) => {
  app.logout();

  for (let i = 0; i < permissions.length; i += 1) {
    app.login(createUser({}), [permissions[i]]);
    testBlock();
  }
};

module.exports = {
  app,
  eachPermission,
  createRole,
  createUser,
  createArticle
};
