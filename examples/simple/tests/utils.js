const supertest = require("supertest");
const app = require("../app");

const request = supertest(app);

/**
 * Run a supertest test block separately for
 * each of the users.
 *
 * @param users
 * @param testBlock
 */
const eachUser = (users, testBlock) => {
  for (let i = 0; i < users.length; i += 1) {
    // eslint-disable-next-line
    testBlock(users[i]);
  }
};

module.exports = {
  app: request,
  eachUser
};
