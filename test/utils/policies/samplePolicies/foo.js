export default {
  // grant rule - a user with full foo access may perform any foo action
  $grant: 'foo.*',
  // deny rule - a suspended user may perform no foo action (outranks $grant)
  $deny: (req) => req.suspended === true,
  // basic
  dive: 'foo.q',
  // all
  load: {
    all: ['foo.m', 'foo.n'],
  },
  // any
  release: {
    any: ['foo.x', 'foo.y', 'foo.z'],
  },
  // callback
  start: () => true,
  stop: () => false,
  pause: (req) => req.body.status === 0,
  rewind: () =>
    new Promise((resolve) => {
      resolve(true);
    }),
  proceed: () =>
    new Promise((resolve) => {
      resolve(false);
    }),
  // a non-boolean returning callback - not supported
  renew: () => 'some string',
};
