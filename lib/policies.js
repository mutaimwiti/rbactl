"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.loadPolicies = void 0;

var _requireAll = _interopRequireDefault(require("require-all"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var loadPolicies = function loadPolicies(pathName) {
  return (0, _requireAll.default)("".concat(__dirname, "/").concat(pathName));
};

exports.loadPolicies = loadPolicies;