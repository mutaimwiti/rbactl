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
  return userPermissions.some(
    (permission) => validPermissions.indexOf(permission) >= 0,
  );
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
  requiredPermissions.forEach((permission) => {
    if (userPermissions.indexOf(permission) < 0) {
      hasAllRequired = false;
    }
  });
  return hasAllRequired;
};
