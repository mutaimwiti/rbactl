import authorize from '../../../../utils/authorize';

describe('authorize.js - complex - case 7', () => {
  it('should check for authorization correctly - success', () => {
    const successCombinations = [
      ['bar.r', 'bar.s'],
      ['bar.r', 'bar.s', 'bar.n'],
    ];

    successCombinations.forEach((permissions) => {
      expect(authorize('start', 'bar', permissions)).toEqual(true);
    });
  });

  it('should check for authorization correctly - failure', () => {
    const failureCombinations = [[], ['bar.r'], ['bar.s'], ['bar.g']];

    failureCombinations.forEach((permissions) => {
      expect(authorize('start', 'bar', permissions)).toEqual(false);
    });
  });
});
