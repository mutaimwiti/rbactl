"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "authorize", {
  enumerable: true,
  get: function get() {
    return _authorize.default;
  }
});
Object.defineProperty(exports, "loadPolicies", {
  enumerable: true,
  get: function get() {
    return _policies.loadPolicies;
  }
});
Object.defineProperty(exports, "loadPermissions", {
  enumerable: true,
  get: function get() {
    return _permissions.loadPermissions;
  }
});
Object.defineProperty(exports, "validatePermissions", {
  enumerable: true,
  get: function get() {
    return _permissions.validatePermissions;
  }
});
Object.defineProperty(exports, "getAllPermissionsFor", {
  enumerable: true,
  get: function get() {
    return _permissions.getAllPermissionsFor;
  }
});
Object.defineProperty(exports, "getPermissionsMapArray", {
  enumerable: true,
  get: function get() {
    return _permissions.getPermissionsMapArray;
  }
});

var _authorize = _interopRequireDefault(require("./authorize"));

var _policies = require("./policies");

var _permissions = require("./permissions");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }