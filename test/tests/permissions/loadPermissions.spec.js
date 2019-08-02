import expect from 'expect';
import { loadPermissions } from '../../../src/permissions';

describe('permissions.js', () => {
  describe('loadPermissions()', () => {
    const loaded = loadPermissions(
      `${__dirname}/../../utils/permissions/samplePermissions`,
    );

    it('should load all permissions', () => {
      expect(Object.keys(loaded).length).toEqual(3);
      expect(loaded).toMatchObject({ article: {}, item: {}, $all: {} });
    });

    it('should load permissions prefixed with the entity - [entity.action]', () => {
      expect(loaded).toMatchObject({
        article: {
          'article.list': 'List articles',
          'article.get': 'Get single article',
          'article.create': 'Create articles',
          'article.update': 'Update articles',
          'article.remove': 'Delete articles',
          'article.*': 'Full articles access',
        },
        item: {
          'item.list': 'List items',
          'item.get': 'Get single item',
          'item.create': 'Create items',
          'item.update': 'Update items',
          'item.remove': 'Delete items',
          'item.*': 'Full items access',
        },
      });
    });

    it('should include an object ($all) with all the permissions', () => {
      expect(loaded.$all).toEqual({
        'article.list': 'List articles',
        'article.get': 'Get single article',
        'article.create': 'Create articles',
        'article.update': 'Update articles',
        'article.remove': 'Delete articles',
        'article.*': 'Full articles access',
        'item.list': 'List items',
        'item.get': 'Get single item',
        'item.create': 'Create items',
        'item.update': 'Update items',
        'item.remove': 'Delete items',
        'item.*': 'Full items access',
      });
    });
  });
});
