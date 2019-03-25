"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getAllPermissionsFor = exports.getPermissionsMapArray = exports.validatePermissions = exports.loadPermissions = exports.hasAllPermissions = exports.hasAnyPermission = exports.getFullGroupPermission = void 0;

var _requireAll = _interopRequireDefault(require("require-all"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

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
  if (permission.indexOf("*") >= 0) {
    return permission;
  }

  return "".concat(permission.substr(0, permission.lastIndexOf(".")), ".*");
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
/**
 * Loads the permissions defined on the specified path. When loading, the permission
 * objects are added to an object. The actions are each prefixed with the name of
 * the entity. It also adds an object with all the permissions.
 *
 * @param pathName
 * @returns {{$all: {}}}
 */


exports.hasAllPermissions = hasAllPermissions;

var loadPermissions = function loadPermissions(pathName) {
  var permissions = {
    $all: {}
  };
  var permissionsObj = (0, _requireAll.default)(pathName);
  Object.keys(permissionsObj).forEach(function (permission) {
    var actions = {};
    var actionsObj = permissionsObj[permission].default;
    Object.keys(actionsObj).forEach(function (action) {
      actions["".concat(permission, ".").concat(action)] = actionsObj[action];
    });
    permissions.$all = _objectSpread({}, permissions.$all, actions);
    permissions[permission] = actions;
  });
  return permissions;
};
/**
 * Checks a list of permissions against the system permissions. It returns an
 * object with two values: valid (boolean) indicating whether its valid and
 * invalids (list) with any invalid permission that may be found.
 *
 * @param systemPermissions
 * @param permissions
 * @returns {{invalids: Array, isValid: boolean}}
 */


exports.loadPermissions = loadPermissions;

var validatePermissions = function validatePermissions(systemPermissions, permissions) {
  var isValid = true;
  var invalids = [];
  var systemPermissionKeys = Object.keys(systemPermissions);
  permissions.forEach(function (permission) {
    if (systemPermissionKeys.indexOf(permission) < 0) {
      isValid = false;
      invalids.push(permission);
    }
  });
  return {
    isValid: isValid,
    invalids: invalids
  };
};
/**
 * Get an array containing mappings (key : description) of permissions. These are
 * against the system pe
 *
 * @param systemPermissions
 * @param permissions
 * @returns {Array}
 */


exports.validatePermissions = validatePermissions;

var getPermissionsMapArray = function getPermissionsMapArray(systemPermissions, permissions) {
  var permissionsArray = [];
  permissions.forEach(function (permission) {
    permissionsArray.push(_defineProperty({}, permission, systemPermissions[permission]));
  });
  return permissionsArray;
};
/**
 * Get all the permissions for an entity. For example passing 'x' will
 * return [ 'x.*', 'x.view', 'c.create', ..., ].
 *
 * @param systemPermissions
 * @param entity
 * @returns {string[]}
 */


exports.getPermissionsMapArray = getPermissionsMapArray;

var getAllPermissionsFor = function getAllPermissionsFor(systemPermissions, entity) {
  return Object.keys(systemPermissions).filter(function (permission) {
    return permission.startsWith(entity);
  });
};

exports.getAllPermissionsFor = getAllPermissionsFor;