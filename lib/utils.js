"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.hasAllPermissions = exports.hasAnyPermission = void 0;

/**
 * Check whether the user has any valid permission. If the list of valid permissions
 * is empty it returns true since it is basically checking against nothing.
 *
 * @param userPermissions
 * @param validPermissions
 * @returns boolean
 */
var hasAnyPermission = function hasAnyPermission(userPermissions, validPermissions) {
  if (!validPermissions.length) {
    return true;
  }

  return userPermissions.some(function (permission) {
    return validPermissions.indexOf(permission) >= 0;
  });
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
    if (userPermissions.indexOf(permission) < 0) {
      hasAllRequired = false;
    }
  });
  return hasAllRequired;
};

exports.hasAllPermissions = hasAllPermissions;