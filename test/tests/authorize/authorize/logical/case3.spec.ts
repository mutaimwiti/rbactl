import authorize from '../../../../utils/authorize';

describe('authorize.js - complex - case 3', () => {
  it('should check for authorization correctly - success', () => {
    const successCombinations = [
      ['bar.c', 'bar.l', 'bar.m'],
      ['bar.d', 'bar.l', 'bar.m'],

      ['bar.c', 'bar.d', 'bar.l', 'bar.m'],
      ['bar.e', 'bar.f', 'bar.l', 'bar.m'],

      ['bar.c', 'bar.e', 'bar.f', 'bar.l', 'bar.m'],
      ['bar.d', 'bar.e', 'bar.f', 'bar.l', 'bar.m'],

      ['bar.c', 'bar.d', 'bar.e', 'bar.f', 'bar.l', 'bar.m'],
    ];

    successCombinations.forEach((permissions) => {
      expect(authorize('list', 'bar', permissions)).toEqual(true);
    });
  });

  it('should check for authorization correctly - failure', () => {
    const failureCombinations = [
      [],
      ['bar.e'],
      ['bar.f'],
      ['bar.e', 'bar.f'],

      ['bar.l'],
      ['bar.m'],
      ['bar.l', 'bar.m'],

      ['bar.e', 'bar.l'],
      ['bar.e', 'bar.m'],
      ['bar.e', 'bar.l', 'bar.m'],

      ['bar.f', 'bar.l'],
      ['bar.f', 'bar.m'],
      ['bar.f', 'bar.l', 'bar.m'],

      ['bar.e', 'bar.f', 'bar.l'],
      ['bar.e', 'bar.f', 'bar.m'],
    ];

    failureCombinations.forEach((permissions) => {
      expect(authorize('list', 'bar', permissions)).toEqual(false);
    });
  });
});
