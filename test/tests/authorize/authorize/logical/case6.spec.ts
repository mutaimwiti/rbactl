import authorize from '../../../../utils/authorize';

// bar.share = { $and: [{ any: ['bar.g'] }, async () => true] }
// A promise-returning callback nested inside an operator. This used to throw
// 'Unexpected nested promise callback'; it is now evaluated correctly.
describe('authorize.js - complex - case 6', () => {
  it('should resolve a nested promise callback rule - success', async () => {
    expect(await authorize('share', 'bar', ['bar.g'])).toEqual(true);
  });

  it('should resolve a nested promise callback rule - failure', async () => {
    // without bar.g the $and short-circuits to false before the async branch
    expect(await authorize('share', 'bar', [])).toEqual(false);
  });
});
