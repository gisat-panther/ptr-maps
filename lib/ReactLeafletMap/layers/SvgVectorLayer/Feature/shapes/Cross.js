"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _react = _interopRequireDefault(require("react"));

var _svg = _interopRequireDefault(require("./svg"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var Cross = function Cross(props) {
  return /*#__PURE__*/_react["default"].createElement("g", {
    transform: "translate(".concat(props.offset, " ").concat(props.offset, ")")
  }, /*#__PURE__*/_react["default"].createElement("path", {
    vectorEffect: "non-scaling-stroke",
    d: "M 1,1 31,31"
  }), /*#__PURE__*/_react["default"].createElement("path", {
    vectorEffect: "non-scaling-stroke",
    d: "M 1,31 31,1"
  }));
};

var _default = function _default(props) {
  return /*#__PURE__*/_react["default"].createElement(_svg["default"], props, Cross);
};

exports["default"] = _default;