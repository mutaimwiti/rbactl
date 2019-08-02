import expect from 'expect';
import { hasAnyPermission } from '../../../src/permissions';

describe('permissions.js', () => {
  describe('hasAnyPermission()', () => {
    const validPermissions = ['user.edit', 'user.view', 'user.update'];
    const withValidPermissions = ['user.view', 'user.update'];
    const withoutValidPermissions = ['blog.edit'];

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

    it('should return true when full group permission is provided', () => {
      expect(hasAnyPermission(['user.*'], ['user.create'])).toEqual(true);
    });

    it('should return false when an invalid full group permission is provided', () => {
      expect(hasAnyPermission(['blog.*'], ['user.create'])).toEqual(false);
    });
  });
});
