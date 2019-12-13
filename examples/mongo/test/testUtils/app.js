const supertest = require('supertest');
const { createRole, createUser } = require('./modelFactories');

const appDef = require('../../src');
const { generateAuthToken } = require('../../src/utils');

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
    return this.token ? request.set('authorization', `${this.token}`) : request;
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
  },
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
};
