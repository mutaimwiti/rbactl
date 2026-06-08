import authorize from '../../../../utils/authorize';

// Capabilities gained by delegating evaluation to logical-compiler:
// $not, $nor, and implicit AND across multiple keys of a policy object.
describe('authorize.js - complex - case 11', () => {
  describe('$not', () => {
    // bar.block = { $not: { any: ['bar.x', 'bar.y'] } }
    it('authorizes only when the user lacks the negated permissions', () => {
      expect(authorize('block', 'bar', [])).toEqual(true);
      expect(authorize('block', 'bar', ['bar.z'])).toEqual(true);
      expect(authorize('block', 'bar', ['bar.x'])).toEqual(false);
      expect(authorize('block', 'bar', ['bar.x', 'bar.y'])).toEqual(false);
    });
  });

  describe('$nor', () => {
    // bar.gate = { $nor: ['bar.a', 'bar.b'] }
    it('authorizes only when the user has none of the permissions', () => {
      expect(authorize('gate', 'bar', [])).toEqual(true);
      expect(authorize('gate', 'bar', ['bar.c'])).toEqual(true);
      expect(authorize('gate', 'bar', ['bar.a'])).toEqual(false);
      expect(authorize('gate', 'bar', ['bar.b'])).toEqual(false);
    });
  });

  describe('implicit AND across multiple keys', () => {
    // bar.combo = { any: ['bar.a'], all: ['bar.m'] }
    it('requires every key to pass', () => {
      expect(authorize('combo', 'bar', ['bar.a', 'bar.m'])).toEqual(true);
      expect(authorize('combo', 'bar', ['bar.a'])).toEqual(false);
      expect(authorize('combo', 'bar', ['bar.m'])).toEqual(false);
      expect(authorize('combo', 'bar', [])).toEqual(false);
    });

    // bar.merge = { $or: ['bar.a', 'bar.b'], all: ['bar.m'] }
    it('AND-s an operator key with a rule key', () => {
      expect(authorize('merge', 'bar', ['bar.a', 'bar.m'])).toEqual(true);
      expect(authorize('merge', 'bar', ['bar.b', 'bar.m'])).toEqual(true);
      expect(authorize('merge', 'bar', ['bar.a'])).toEqual(false);
      expect(authorize('merge', 'bar', ['bar.m'])).toEqual(false);
    });
  });
});
