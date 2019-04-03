const { authorize } = require("../../../lib");
const policies = require("./policies");
const { User, Article } = require("./models");

module.exports = {
  /**
   * This middleware just sets the req.context to an empty object.
   * req.context is used to add our custom request values to
   * avoid polluting or accidentally overriding important
   * req object values.
   * @param req
   * @param res
   * @param next
   * @returns {*}
   */
  init: (req, res, next) => {
    req.context = {};
    return next();
  },

  /**
   * This middleware identifies the user making the request via the
   * authorization header. If it is not able to authenticate the
   * user it returns a 401 error response. Else, it adds the
   * user object to the req object to make it available to
   * all other consequent handlers.
   *
   * @param req
   * @param res
   * @param next
   * @returns {Promise<*>}
   */
  authenticate: async (req, res, next) => {
    // we are identifying the user using their id that is set as the
    // Authorization header. This is to avoid going out of scope.
    // Ideally this would be decoding a jwt auth token or
    // verifying the username/email and password
    // combination.
    const authId = Number(req.headers.authorization) || null;
    if (!authId) {
      return res.status(401).json({
        message: "Unauthenticated. Log in and try again."
      });
    }
    // Adding the user object to the request object so that all proceeding
    // handlers e.g. authorize middleware will know the authenticated
    // user.
    req.user = await User.findOne({ where: { id: authId } });
    return next();
  },

  /**
   * This middleware returns a middleware function that is able to authorize
   * the action that the user is trying to make on a given entity. If the
   * user is not allowed to perform the action it returns a 403 error
   * response. Else, it allows the request to proceed by calling the
   * next handler.
   *
   * @param action
   * @param entity
   * @returns {Function}
   */
  can: (action, entity) => {
    return async (req, res, next) => {
      const userPermissions = await req.user.getPermissions();
      try {
        // If any of your policies use the express req object you must pass it.
        // The req parameter is
        // optional.
        if (!authorize(action, entity, userPermissions, policies, req)) {
          return res.status(403).json({
            message: `You are not authorized to perform this action.`
          });
        }
        return next();
      } catch (e) {
        // eslint-disable-next-line
        console.log(e);
        // two exceptions are possible: missing policy or missing policy action
        return res.status(500).json({
          message: "Sorry :( Something bad happened."
        });
      }
    };
  },

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
  articleExists: async (req, res, next) => {
    const article = await Article.findOne({
      where: { id: req.params.id },
      include: { model: User }
    });
    if (!article) {
      return res.status(404).json({
        message: "The article does not exist."
      });
    }
    req.context.article = article;
    return next();
  }
};
