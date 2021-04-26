"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _Cross = _interopRequireDefault(require("./Cross"));

var _Pin = _interopRequireDefault(require("./Pin"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _default = {
  cross: {
    anchorPoint: [0.5, 0.5],
    component: _Cross["default"]
  },
  pin: {
    anchorPoint: [0.5, 1],
    component: _Pin["default"]
  }
};
exports["default"] = _default;