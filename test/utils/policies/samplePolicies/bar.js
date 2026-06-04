const data = {
  likes: true,
  dislikes: false,
  ownerId: 3,
};

/**
 * A example that defines complex policies - boolean OR and AND.
 */
export default {
  create: {
    $or: [
      {
        $and: [{ any: ['bar.a', 'bar.b'] }, { all: ['bar.m', 'bar.n'] }],
      },
      { any: ['bar.j', 'bar.k'] },
    ],
  },
  edit: {
    $or: [
      {
        $and: [{ any: ['bar.p', 'bar.q'] }, () => data.likes],
      },
      { any: ['bar.n', 'bar.o'] },
    ],
  },
  list: {
    $and: [
      {
        $or: [{ any: ['bar.c', 'bar.d'] }, { all: ['bar.e', 'bar.f'] }],
      },
      { all: ['bar.l', 'bar.m'] },
    ],
  },
  remove: {
    $or: [
      {
        $and: [{ any: ['bar.g', 'bar.h'] }, { all: ['bar.i', 'bar.j'] }],
      },
      { $or: [{ any: ['bar.r', 'bar.s'] }, () => data.dislikes] },
    ],
  },
  archive: {
    $and: [
      (req) => req.params.id === data.ownerId,
      { any: ['bar.x', 'bar.y'] },
    ],
  },
  // a promise callback nested inside an operator
  share: {
    $and: [{ any: ['bar.g'] }, async () => true],
  },
  start: {
    $and: ['bar.r', 'bar.s'],
  },
  pause: {
    $or: ['bar.x', 'bar.y'],
  },
  stop: {
    $and: ['bar.m', 'bar.n', { $or: ['bar.a', 'bar.b', 'bar.c'] }],
  },
  restart: {
    $and: ['bar.g', 'bar.h', { any: ['bar.j', 'bar.k', 'bar.l'] }],
  },
  // $not - authorized only when the user lacks any of the listed permissions
  block: {
    $not: { any: ['bar.x', 'bar.y'] },
  },
  // $nor - authorized only when the user has none of the listed permissions
  gate: {
    $nor: ['bar.a', 'bar.b'],
  },
  // multiple keys are implicitly AND-ed: any(bar.a) AND all(bar.m)
  combo: {
    any: ['bar.a'],
    all: ['bar.m'],
  },
};
