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

var _authorize = _interopRequireDefault(require("./authorize"));

var _policies = require("./policies");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }