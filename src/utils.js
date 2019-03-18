/**
 * Generate the full group permission string for the passed permission i.e if
 * the permission is [user.create] it returns [user.*] which is the full
 * permission for the user permission group. If the permission is
 * already a full group permission it returns it.
 *
 * @param permission
 * @returns {*}
 */
export const getFullGroupPermission = permission => {
  if (permission.indexOf("*") >= 0) {
    return permission;
  }
  return `${permission.substr(0, permission.lastIndexOf("."))}.*`;
};

/**
 * Check whether the user has any valid permission. If the list of valid permissions
 * is empty it returns true since it is basically checking against nothing.
 *
 * @param userPermissions
 * @param validPermissions
 * @returns boolean
 */
export const hasAnyPermission = (userPermissions, validPermissions) => {
  if (!validPermissions.length) {
    return true;
  }

  let hasAnyValid = false;

  validPermissions.forEach(permission => {
    if (
      userPermissions.indexOf(permission) >= 0 ||
      userPermissions.indexOf(getFullGroupPermission(permission)) >= 0
    ) {
      hasAnyValid = true;
    }
  });

  return hasAnyValid;
};

/**
 * Check whether the user has all the required permissions. If the list of required permissions
 * is empty it returns true since it is basically checking against nothing.
 *
 * @param userPermissions
 * @param requiredPermissions
 * @returns boolean
 */
export const hasAllPermissions = (userPermissions, requiredPermissions) => {
  let hasAllRequired = true;

  requiredPermissions.forEach(permission => {
    if (
      userPermissions.indexOf(permission) < 0 &&
      userPermissions.indexOf(getFullGroupPermission(permission)) < 0
    ) {
      hasAllRequired = false;
    }
  });

  return hasAllRequired;
};
