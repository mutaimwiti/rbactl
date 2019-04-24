const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { ObjectId } = require('mongoose').Types;
const {
  parsePermissions,
  validatePermissions: permissionsValidator,
} = require('../../../lib');
const permissionsDef = require('./permissions');

/**
 * Generate a jwt token based on the details of the user object
 * that is passed.
 *
 * @param user
 * @returns {Promise<*>}
 * @throws Error
 */
const generateAuthToken = async (user) => {
  const { name, username } = user;
  return jwt.sign(
    {
      name,
      username,
      permissions: await user.permissions,
    },
    process.env.SECRET_KEY || '$3cr3T',
  );
};

/**
 * Decode the jwt token passed via the authorization header to ascertain
 * that it is valid and return the payload.
 *
 * @returns {*}
 * @param req
 * @throws Error
 */
const decodeAuthToken = (req) => {
  const { authorization } = req.headers;

  if (!authorization || authorization.trim().length === 0) {
    throw Error('The authentication token is required.');
  }

  const token = authorization.replace('Bearer ', '');

  return jwt.verify(token, process.env.SECRET_KEY || '$3cr3T');
};

/**
 * Compare the password supplied by user to login against
 * the hashed one on the user model.
 *
 * @param password
 * @param user
 * @returns {*}
 */
const checkPassword = (password, user) => {
  return bcrypt.compareSync(password, user.password);
};

/**
 * Get all application permissions i.e. those defined in the permissions directory.
 *
 * @returns {permissions.$all|{}|permissions.$all|$all|permissions.$all|*}
 */
const getAppPermissions = () => {
  return parsePermissions(permissionsDef).$all;
};

/**
 * Validate a list of permissions against system permissions.
 *
 * @param permissions
 * @returns {object}
 */
const validatePermissions = (permissions) => {
  return permissionsValidator(getAppPermissions(), permissions);
};

/**
 * Checks whether passed objectId is a valid mongoose objectId.
 *
 * @returns {*}
 * @param objectIds
 */
const objectIdsAreValid = (objectIds) => {
  let valid = true;

  objectIds.forEach((objectId) => {
    if (!ObjectId.isValid(`${objectId}`)) {
      valid = false;
    }
  });

  return valid;
};

module.exports = {
  generateAuthToken,
  decodeAuthToken,
  checkPassword,
  getAppPermissions,
  validatePermissions,
  objectIdsAreValid,
};
