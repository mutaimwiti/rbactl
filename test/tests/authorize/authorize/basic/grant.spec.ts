import authorize from '../../../../utils/authorize';

// The foo policy defines `$grant: 'foo.*'`, granting a user with full foo
// access every foo action regardless of the per-action policy.
describe('authorize.js - $grant rule', () => {
  it('authorizes any defined action when the $grant rule passes', () => {
    // foo.stop's own policy always denies; foo.load needs foo.m AND foo.n.
    // The $grant rule overrides both for a holder of foo.*
    expect(authorize('stop', 'foo', ['foo.*'])).toEqual(true);
    expect(authorize('load', 'foo', ['foo.*'])).toEqual(true);
    expect(authorize('dive', 'foo', ['foo.*'])).toEqual(true);
  });

  it('falls back to the action policy when the $grant rule fails', () => {
    // without foo.* the per-action policy decides
    expect(authorize('stop', 'foo', [])).toEqual(false);
    expect(authorize('load', 'foo', ['foo.m', 'foo.n'])).toEqual(true);
    expect(authorize('load', 'foo', ['foo.m'])).toEqual(false);
    expect(authorize('release', 'foo', ['foo.x'])).toEqual(true);
  });

  it('still requires the action to be defined', () => {
    // $grant does not grant access to actions the entity does not define
    expect(() => authorize('lock', 'foo', ['foo.*'])).toThrow(
      'does not define action [lock]',
    );
  });
});
