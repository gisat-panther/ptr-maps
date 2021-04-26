"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _react = _interopRequireDefault(require("react"));

var _svg = _interopRequireDefault(require("./svg"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var Pin = function Pin(props) {
  return /*#__PURE__*/_react["default"].createElement("g", {
    transform: "translate(".concat(props.offset, " ").concat(props.offset + props.offset / 4, ")")
  }, /*#__PURE__*/_react["default"].createElement("path", {
    vectorEffect: "non-scaling-stroke",
    d: "M 27,10.999999 C 26.999936,4.924849 22.075087,0 16,0 9.9249129,0 5.0000636,4.924849 5,10.999999 4.9998451,13.460703 6.2398215,15.834434 8.6666665,18.857143 11.093512,21.879851 13.424935,25.819509 16,32 18.614084,25.725879 20.878951,21.8993 23.333333,18.857143 25.787715,15.814985 26.999857,13.488539 27,10.999999 Z"
  }), props.icon ? /*#__PURE__*/_react["default"].createElement("g", {
    transform: "translate(9 3.5) scale(0.4375 0.4375)"
  }, props.icon) : null);
};

var _default = function _default(props) {
  return /*#__PURE__*/_react["default"].createElement(_svg["default"], props, Pin);
};

exports["default"] = _default;