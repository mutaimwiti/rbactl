export default {
  // basic
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
  start: () => true,
  stop: () => false,
  pause: req => req.body.status === 0
};
