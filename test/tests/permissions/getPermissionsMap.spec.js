import expect from 'expect';
import { getPermissionsMap } from '../../../src/permissions';
import { systemPermissions } from '../../utils/permissions/helpers';

describe('permissions.js', () => {
  describe('getPermissionsMapArray()', () => {
    it('should map permissions correctly', () => {
      expect(
        getPermissionsMap(systemPermissions.$all, [
          'article.list',
          'item.remove',
        ]),
      ).toEqual({
        'article.list': 'List articles',
        'item.remove': 'Delete items',
      });
    });

    it('should give an empty object when passed list is empty ', () => {
      expect(getPermissionsMap(systemPermissions.$all, [])).toEqual({});
    });
  });
});
