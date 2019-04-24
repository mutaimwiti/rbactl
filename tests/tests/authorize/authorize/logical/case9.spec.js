import authorize from '../../../../utils/authorize';

describe('authorize.js - complex - case 9', () => {
  it('should check for authorization correctly - success', () => {
    const successCombinations = [
      ['bar.m', 'bar.n', 'bar.a'],
      ['bar.m', 'bar.n', 'bar.b'],
      ['bar.m', 'bar.n', 'bar.c'],
      ['bar.m', 'bar.n', 'bar.a', 'bar.b'],
      ['bar.m', 'bar.n', 'bar.a', 'bar.c'],
      ['bar.m', 'bar.n', 'bar.b', 'bar.c'],
    ];

    successCombinations.forEach((permissions) => {
      expect(authorize('stop', 'bar', permissions)).toEqual(true);
    });
  });

  it('should check for authorization correctly - failure', () => {
    const failureCombinations = [
      [],
      ['bar.m'],
      ['bar.n'],
      ['bar.m', 'bar.n'],
      ['bar.m', 'bar.n', 'bar.z'],
    ];

    failureCombinations.forEach((permissions) => {
      expect(authorize('stop', 'bar', permissions)).toEqual(false);
    });
  });
});
