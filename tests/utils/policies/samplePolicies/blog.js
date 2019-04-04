/**
 * A realistic example.
 */
// exported this why to ensure this type of export works
// correctly with loadPolicies()
module.exports = {
  list: "blog.list",
  get: {
    any: ["blog.get", "blog.list"]
  },
  create: "blog.create",
  update: {
    any: ["blog.update", "blog.create"]
  },
  remove: "blog.delete"
};
