import { loadPermissions } from '../../../src';

const permissionsPath = `${__dirname}/samplePermissions`;

export const systemPermissions = loadPermissions(permissionsPath);

export const samplePermissionsObject = {
  article: {
    list: 'List articles',
    get: 'Get single article',
    create: 'Create articles',
    update: 'Update articles',
    remove: 'Delete articles',
    '*': 'Full articles access',
  },
  item: {
    list: 'List items',
    get: 'Get single item',
    create: 'Create items',
    update: 'Update items',
    remove: 'Delete items',
    '*': 'Full items access',
  },
};
