import authorize from '../../../../utils/authorize';

describe('authorize.js - complex - case 9', () => {
  it('should check for authorization correctly - success', () => {
    const successCombinations = [
      ['bar.g', 'bar.h', 'bar.j'],
      ['bar.g', 'bar.h', 'bar.k'],
      ['bar.g', 'bar.h', 'bar.l'],
      ['bar.g', 'bar.h', 'bar.j', 'bar.k'],
      ['bar.g', 'bar.h', 'bar.j', 'bar.l'],
      ['bar.g', 'bar.h', 'bar.k', 'bar.l'],
    ];

    successCombinations.forEach((permissions) => {
      expect(authorize('restart', 'bar', permissions)).toEqual(true);
    });
  });

  it('should check for authorization correctly - failure', () => {
    const failureCombinations = [
      [],
      ['bar.g'],
      ['bar.h'],
      ['bar.g', 'bar.h'],
      ['bar.g', 'bar.h', 'bar.z'],
    ];

    failureCombinations.forEach((permissions) => {
      expect(authorize('restart', 'bar', permissions)).toEqual(false);
    });
  });
});
