"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.authorizeActionAgainstPolicy = void 0;

var _permissions = require("./permissions");

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

/**
 * Credit - https://stackoverflow.com/questions/55240828
 *
 * @param userPermissions
 * @param actionPolicy
 * @returns {*|*|*}
 */
var authorizeActionAgainstPolicy = function authorizeActionAgainstPolicy(userPermissions, actionPolicy) {
  var authorize = function authorize(policy) {
    var operators = {
      $or: "some",
      $and: "every"
    };
    var fns = {
      any: function any(permissions) {
        return (0, _permissions.hasAnyPermission)(userPermissions, permissions);
      },
      all: function all(permissions) {
        return (0, _permissions.hasAllPermissions)(userPermissions, permissions);
      }
    };
    if (typeof policy === "string") return (0, _permissions.hasAllPermissions)(userPermissions, [policy]);
    if (typeof policy === "function") return policy();
    if (!policy || _typeof(policy) !== "object") return false;

    var _Object$entries$ = _slicedToArray(Object.entries(policy)[0], 2),
        key = _Object$entries$[0],
        value = _Object$entries$[1];

    if (key in operators) return value[operators[key]](authorize);
    if (key in fns) return fns[key](value);
    return false;
  };

  return authorize(actionPolicy);
};

exports.authorizeActionAgainstPolicy = authorizeActionAgainstPolicy;

var _default = function _default(entity, action, userPermissions, policies) {
  var policy = policies[entity];

  if (policy) {
    var actionPolicy = policy[action];

    if (actionPolicy) {
      return authorizeActionAgainstPolicy(userPermissions, actionPolicy);
    }

    throw Error("The [".concat(entity, "] policy does not define action [").concat(action, "]."));
  }

  throw Error("The [".concat(entity, "] policy is not defined."));
};

exports.default = _default;