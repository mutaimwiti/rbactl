"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.loadPolicies = void 0;

var _requireAll = _interopRequireDefault(require("require-all"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var loadPolicies = function loadPolicies(pathName) {
  var policies = {};
  var policiesObj = (0, _requireAll.default)(pathName);
  Object.keys(policiesObj).forEach(function (policy) {
    policies[policy] = policiesObj[policy].default;
  });
  return policies;
};

exports.loadPolicies = loadPolicies;