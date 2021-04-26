"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _react = _interopRequireDefault(require("react"));

var _reactLoadable = _interopRequireDefault(require("react-loadable"));

var _ptrCore = require("@gisatcz/ptr-core");

var _presentationEmpty = _interopRequireDefault(require("../LoadableMap/presentationEmpty"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

var LoadableReactLeafletMap = (0, _reactLoadable["default"])({
  loader: function loader() {
    return _ptrCore.isServer ? Promise.resolve().then(function () {
      return _interopRequireWildcard(require('../LoadableMap/presentationEmpty'));
    }) : Promise.resolve().then(function () {
      return _interopRequireWildcard(require('../ReactLeafletMap'));
    });
  },
  render: function render(loaded, props) {
    var ReactLeafletMap = loaded["default"];
    return /*#__PURE__*/_react["default"].createElement(ReactLeafletMap, props);
  },
  loading: function loading(props) {
    if (props.error) {
      return /*#__PURE__*/_react["default"].createElement("div", null, "Error!");
    } else {
      return /*#__PURE__*/_react["default"].createElement("div", null, "Loading...");
    }
  }
});

var isomorphicLoadableReactLeafletMap = function isomorphicLoadableReactLeafletMap(props) {
  return _ptrCore.isServer ? /*#__PURE__*/_react["default"].createElement(_presentationEmpty["default"], null) : /*#__PURE__*/_react["default"].createElement(LoadableReactLeafletMap, props);
};

var _default = isomorphicLoadableReactLeafletMap;
exports["default"] = _default;