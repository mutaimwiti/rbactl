export default {
  // simple
  dive: "foo.q",
  // all
  load: {
    all: ["foo.m", "foo.n"]
  },
  // any
  release: {
    any: ["foo.x", "foo.y", "foo.z"]
  },
  // callback
  stop: () => true
};
