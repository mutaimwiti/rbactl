const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

module.exports = {
  /**
   * Generate a jwt token based on the details of the user object
   * that is passed.
   *
   * @param user
   * @returns {Promise<*>}
   * @throws Error
   */
  generateAuthToken: async user => {
    const { name, username } = user;
    return jwt.sign(
      {
        name,
        username,
        permissions: await user.getPermissions()
      },
      process.env.SECRET_KEY
    );
  },

  /**
   * Decode the jwt token passed via the authorization header to ascertain
   * that it is valid and return the payload.
   *
   * @returns {*}
   * @param req
   * @throws Error
   */
  decodeAuthToken: req => {
    const { authorization } = req.headers;

    if (!authorization || authorization.trim().length === 0) {
      throw Error("The authentication token is required.");
    }

    const token = authorization.replace("Bearer ", "");

    return jwt.verify(token, process.env.SECRET_KEY);
  },

  /**
   * Compare the password supplied by user to login against
   * the hashed one on the user model.
   *
   * @param password
   * @param user
   * @returns {*}
   */
  checkPassword: (password, user) => {
    return bcrypt.compareSync(password, user.password);
  }
};
