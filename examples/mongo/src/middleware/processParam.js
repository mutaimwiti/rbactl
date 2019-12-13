const { User, Role, Article } = require('../models');

/**
 * This middleware checks whether the article whose id is passed as a
 * parameter on the request exits. If it does not exist it returns a
 * 404 error response. Else, it adds the article object to the
 * req.context object and calls the next handler.
 *
 * @param req
 * @param res
 * @param next
 * @returns {Promise<*>}
 */
const processArticleParam = async (req, res, next) => {
  try {
    const { id } = req.params;
    req.context.article = await Article.findOne({ _id: id })
      .populate('owner', '-password')
      .orFail();
    return next();
  } catch (e) {
    return res.status(404).json({
      message: 'The article does not exist.',
    });
  }
};

/**
 * This middleware checks whether the role whose id is passed as a
 * parameter on the request exits. If it does not exist it returns a
 * 404 error response. Else, it adds the role object to the
 * req.context object and calls the next handler.
 *
 * @param req
 * @param res
 * @param next
 * @returns {Promise<*>}
 */
const processRoleParam = async (req, res, next) => {
  try {
    const { id } = req.params;
    req.context.role = await Role.findOne({ _id: id }).orFail();
    return next();
  } catch (e) {
    return res.status(404).json({
      message: 'The role does not exist.',
    });
  }
};

/**
 * This middleware checks whether the user whose id is passed as a
 * parameter on the request exits. If it does not exist it returns a
 * 404 error response. Else, it adds the role object to the
 * req.context object and calls the next handler.
 *
 * @param req
 * @param res
 * @param next
 * @returns {Promise<*>}
 */
const processUserParam = async (req, res, next) => {
  try {
    const { id } = req.params;
    req.context.user = await User.findOne({ _id: id })
      .populate('roles')
      .orFail();
    return next();
  } catch (e) {
    return res.status(404).json({
      message: 'The user does not exist.',
    });
  }
};

module.exports = {
  processArticleParam,
  processRoleParam,
  processUserParam,
};
