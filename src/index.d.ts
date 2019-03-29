/**
 * Authorize a user action on an entity based on the user permissions and
 * system policies. All occurrences of the callback rule are called with
 * the req object. This allows the user to authorize based on req
 * parameters.
 *
 * @param action
 * @param entity
 * @param userPermissions
 * @param policies
 * @param req
 * @returns {*}
 */
export const authorize: (
    action,
    entity,
    userPermissions,
    policies,
    req
) => boolean;

/**
 * Loads the policies defined on the specified path. When loading, the policy
 * objects are added to an object.
 *
 * @param pathName
 */
export const loadPolicies: (pathName) => object;

/**
 * Loads the permissions defined on the specified path. When loading, the permission
 * objects are added to an object. The actions are each prefixed with the name of
 * the entity. It also adds an object with all the permissions.
 *
 * @param pathName
 * @returns {{$all: {}}}
 */
export const loadPermissions: (pathName) => object;

/**
 * Checks a list of permissions against the system permissions. It returns an
 * object with two values: valid (boolean) indicating whether its valid and
 * invalids (list) with any invalid permission that may be found.
 *
 * @param systemPermissions
 * @param permissions
 * @returns {{invalids: Array, isValid: boolean}}
 */
export const validatePermissions: (systemPermissions, permissions) => object;

/**
 * Get all the permissions for an entity. For example passing 'x' will
 * return [ 'x.*', 'x.view', 'c.create', ..., ].
 *
 * @param systemPermissions
 * @param entity
 * @returns {string[]}
 */
export const getAllPermissionsFor: (systemPermissions, entity) => Array<string>;

/**
 * Get an array containing mappings (key : description) of permissions. These are
 * against the system pe
 *
 * @param systemPermissions
 * @param permissions
 * @returns {Array}
 */
export const getPermissionsMapArray: (
    systemPermissions,
    permissions
) => Array<object>;
