/**
 * A realistic example.
 */
export default {
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
