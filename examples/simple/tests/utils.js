const supertest = require("supertest");
const server = require("../server");

const app = supertest(server);

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
  app,
  eachUser
};
