"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.hasAllPermissions = exports.hasAnyPermission = exports.getFullGroupPermission = void 0;

/**
 * Generate the full group permission string for the passed permission i.e if
 * the permission is [user.create] it returns [user.*] which is the full
 * permission for the user permission group. If the permission is
 * already a full group permission it returns it.
 *
 * @param permission
 * @returns {*}
 */
var getFullGroupPermission = function getFullGroupPermission(permission) {
  if (permission.indexOf('*') >= 0) {
    return permission;
  }

  return "".concat(permission.substr(0, permission.lastIndexOf('.')), ".*");
};
/**
 * Check whether the user has any valid permission. If the list of valid permissions
 * is empty it returns true since it is basically checking against nothing.
 *
 * @param userPermissions
 * @param validPermissions
 * @returns boolean
 */


exports.getFullGroupPermission = getFullGroupPermission;

var hasAnyPermission = function hasAnyPermission(userPermissions, validPermissions) {
  if (!validPermissions.length) {
    return true;
  }

  var hasAnyValid = false;
  validPermissions.forEach(function (permission) {
    if (userPermissions.indexOf(permission) >= 0 || userPermissions.indexOf(getFullGroupPermission(permission)) >= 0) {
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


exports.hasAnyPermission = hasAnyPermission;

var hasAllPermissions = function hasAllPermissions(userPermissions, requiredPermissions) {
  var hasAllRequired = true;
  requiredPermissions.forEach(function (permission) {
    if (userPermissions.indexOf(permission) < 0 && userPermissions.indexOf(getFullGroupPermission(permission)) < 0) {
      hasAllRequired = false;
    }
  });
  return hasAllRequired;
};

exports.hasAllPermissions = hasAllPermissions;