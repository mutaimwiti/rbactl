const { authorize } = require("../../../lib");
const policies = require("./policies");
const { User, Article } = require("./models");

module.exports = {
  authenticate: (req, res, next) => {
    // we are identifying the user using their id that is set as the
    // Authorization header. This is to avoid going out of scope.
    // Ideally this would be decoding a jwt auth token or
    // verifying the username/email and password
    // combination.
    const authId = Number(req.headers.authorization);
    if (!authId) {
      return res.status(401).json({
        message: "Unauthenticated. Log in and try again."
      });
    }
    // Adding the user object to the request object so that all proceeding
    // handlers e.g. authorize middleware will know the authenticated
    // user.
    req.user = User.find(authId);
    return next();
  },
  can: (action, entity) => {
    return (req, res, next) => {
      try {
        // If any of your policies use the express req object you must pass it.
        // The req parameter is
        // optional.
        if (!authorize(action, entity, req.user.permissions, policies, req)) {
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
  // This middleware checks whether the article whose id is
  // passed as a parameter on the request exits.
  articleExists: (req, res, next) => {
    if (!Article.find(Number(req.params.id))) {
      return res.status(404).json({
        message: "The article does not exist."
      });
    }
    return next();
  }
};
