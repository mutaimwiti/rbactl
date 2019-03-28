// The permissions object can be used with the validatePermissions() function
// to check whether a given list of permissions is a valid system permission.
// Permissions can also be defined in their own directory; each file named
// after its entity. The loadPermissions can be used to load them. That
// would be something like this:
//  - permissions [dir]
//    * user.js
//    * article.js
// The definition of [ article ] permissions would be something like this:
//  module.exports = {
//    "article.view": "View articles",
//    "article.create": "Create articles",
//    "article.update": "Update articles",
//    "article.delete": "Delete articles"
//  }

module.exports = {
  "article.view": "View articles",
  "article.create": "Create articles",
  "article.update": "Update articles",
  "article.delete": "Delete articles"
};
