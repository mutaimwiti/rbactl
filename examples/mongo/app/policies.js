const { getAllPermissionsFor } = require("../../../lib");
const { getAppPermissions } = require("./utils");

const isArticleOwner = req => {
  return req.user && req.user._id.equals(req.context.article.ownerId);
};

module.exports = {
  permission: {
    // since roles have permissions we allow anyone with any role permission
    // to view permissions
    view: {
      any: getAllPermissionsFor(getAppPermissions(), "role")
    }
  },

  role: {
    view: {
      any: ["role.view", "role.create", "role.update", "role.delete"]
    },
    create: "role.create",
    update: "role.update",
    delete: "role.delete"
  },

  user: {
    view: {
      any: ["user.view", "user.setRoles"]
    },
    setRoles: "user.setRoles"
  },

  article: {
    view: {
      any: [
        "article.view",
        "article.create",
        "article.update",
        "article.delete"
      ]
    },
    create: "article.create",
    update: isArticleOwner,
    delete: { $or: [isArticleOwner, "article.delete"] }
  }
};
