import authorize from '../../../../utils/authorize';

// The foo policy defines `$deny: (req) => req.suspended === true`. A passing
// $deny denies the action regardless of $grant or the per-action policy.
describe('authorize.js - $deny rule', () => {
  it('denies any action when the $deny rule passes', () => {
    const req = { suspended: true };
    // dive would pass for a foo.q holder; $deny overrides it
    expect(authorize('dive', 'foo', ['foo.q'], req)).toEqual(false);
    expect(authorize('release', 'foo', ['foo.x'], req)).toEqual(false);
  });

  it('outranks the $grant rule', () => {
    // foo.* grants via $grant, but a passing $deny still denies
    expect(authorize('dive', 'foo', ['foo.*'], { suspended: true })).toEqual(
      false,
    );
    // not suspended → $grant still grants
    expect(authorize('dive', 'foo', ['foo.*'], { suspended: false })).toEqual(
      true,
    );
  });

  it('does not affect authorization when it fails', () => {
    // not suspended → the per-action policy applies as normal
    expect(authorize('dive', 'foo', ['foo.q'], { suspended: false })).toEqual(
      true,
    );
    expect(authorize('dive', 'foo', [], { suspended: false })).toEqual(false);
  });
});
