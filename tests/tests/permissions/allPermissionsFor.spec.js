import expect from 'expect';
import { getAllPermissionsFor } from '../../../src/permissions';
import { systemPermissions } from '../../utils/permissions/helpers';

describe('permissions.js', () => {
  describe('allPermissionsFor()', () => {
    it('should list all permissions for a permission group', () => {
      const allArticlePermissions = [
        'article.list',
        'article.get',
        'article.create',
        'article.update',
        'article.remove',
        'article.*',
      ];

      expect(getAllPermissionsFor(systemPermissions.$all, 'article')).toEqual(
        allArticlePermissions,
      );
    });

    it('should give an empty list when permission group does not exist', () => {
      expect(getAllPermissionsFor(systemPermissions.$all, 'job')).toEqual([]);
    });
  });
});
