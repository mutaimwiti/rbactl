import {hasAnyPermission, hasAllPermissions} from '../../src/utils';

describe('utils.js', () => {
  describe('hasAnyPermission()', () => {
    const validPermissions = [
      'user.*',
      'user.view',
      'user.update',
    ];
    const withValidPermissions = ['user.view', 'user.update'];
    const withoutValidPermissions = ['blog.*'];

    it('should return true when user has any valid permission', () => {
      expect(hasAnyPermission(withValidPermissions, validPermissions)).toEqual(
        true,
      );
    });

    it('should return false when user has no valid permission', () => {
      expect(
        hasAnyPermission(withoutValidPermissions, validPermissions),
      ).toEqual(false);
    });

    it('should return false when user has no permissions', () => {
      expect(hasAnyPermission([], validPermissions)).toEqual(false);
    });

    it('should return true when no valid permissions are provided', () => {
      expect(hasAnyPermission(withoutValidPermissions, [])).toEqual(true);
    });
  });

  describe('hasAllPermissions()', () => {
    const requiredPermissions = [
      'user.view',
      'user.update',
    ];
    const withRequiredPermissions = [
      'group.*',
      'user.view',
      'user.update',
    ];
    const withoutRequiredPermissions = ['group.*'];

    it('should return true when user has all required permissions', () => {
      expect(
        hasAllPermissions(withRequiredPermissions, requiredPermissions),
      ).toEqual(true);
    });

    it('should return false when user is missing any of the required permissions', () => {
      expect(
        hasAllPermissions(withoutRequiredPermissions, requiredPermissions),
      ).toEqual(false);
    });

    it('should return false when user has no permissions', () => {
      expect(hasAllPermissions([], requiredPermissions)).toEqual(false);
    });

    it('should return true when required permissions are not provided', () => {
      expect(hasAllPermissions(withoutRequiredPermissions, [])).toEqual(true);
    });
  });
});
