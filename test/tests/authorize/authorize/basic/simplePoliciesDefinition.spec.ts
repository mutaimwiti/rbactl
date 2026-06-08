import { authorize } from '../../../../../src';

/*
A simple policies definition in an object. Can be very useful for small apps.
 */
const policies = {
  article: {
    create: 'article.create',
    remove: 'article.remove',
  },
  user: {
    update: 'user.update',
  },
};

describe('authorize.js - simple policies', () => {
  it('should check for authorization correctly - success', () => {
    const permissions = ['article.create', 'article.remove', 'user.update'];
    expect(authorize('create', 'article', permissions, policies)).toEqual(true);
    expect(authorize('remove', 'article', permissions, policies)).toEqual(true);
    expect(authorize('update', 'user', permissions, policies)).toEqual(true);
  });

  it('should check for authorization correctly - failure', () => {
    expect(authorize('create', 'article', [], policies)).toEqual(false);
    expect(authorize('remove', 'article', [], policies)).toEqual(false);
    expect(authorize('update', 'user', [], policies)).toEqual(false);
  });
});
