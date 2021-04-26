"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.EVENTS_RE = void 0;

var _leaflet = require("leaflet");

var _fastDeepEqual = _interopRequireDefault(require("fast-deep-equal"));

var _reactLeaflet = require("react-leaflet");

var _leaflet2 = _interopRequireDefault(require("./leaflet.wms"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _get(target, property, receiver) { if (typeof Reflect !== "undefined" && Reflect.get) { _get = Reflect.get; } else { _get = function _get(target, property, receiver) { var base = _superPropBase(target, property); if (!base) return; var desc = Object.getOwnPropertyDescriptor(base, property); if (desc.get) { return desc.get.call(receiver); } return desc.value; }; } return _get(target, property, receiver || target); }

function _superPropBase(object, property) { while (!Object.prototype.hasOwnProperty.call(object, property)) { object = _getPrototypeOf(object); if (object === null) break; } return object; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

var EVENTS_RE = /^on(.+)$/i;
exports.EVENTS_RE = EVENTS_RE;

var WMSLayer = /*#__PURE__*/function (_MapLayer) {
  _inherits(WMSLayer, _MapLayer);

  var _super = _createSuper(WMSLayer);

  function WMSLayer() {
    _classCallCheck(this, WMSLayer);

    return _super.apply(this, arguments);
  }

  _createClass(WMSLayer, [{
    key: "createLeafletElement",
    value: function createLeafletElement(props) {
      var url = props.url,
          params = props.params,
          singleTile = props.singleTile,
          restParams = _objectWithoutProperties(props, ["url", "params", "singleTile"]);

      var _this$getOptions = this.getOptions(_objectSpread(_objectSpread({}, restParams), params)),
          _l = _this$getOptions.leaflet,
          options = _objectWithoutProperties(_this$getOptions, ["leaflet"]);

      if (singleTile) {
        var source = new _leaflet2["default"].source(url, _objectSpread(_objectSpread({}, options), {}, {
          pane: _l.pane,
          tiled: false,
          identify: false
        }));
        var layer = source.getLayer(options.layers);
        layer.options.pane = _l.pane;
        return layer;
      } else {
        return new _leaflet.TileLayer.WMS(url, options);
      }
    }
  }, {
    key: "updateLeafletElement",
    value: function updateLeafletElement(fromProps, toProps) {
      _get(_getPrototypeOf(WMSLayer.prototype), "updateLeafletElement", this).call(this, fromProps, toProps);

      var prevUrl = fromProps.url;
      var url = toProps.url;

      if (url !== prevUrl) {
        this.leafletElement.setUrl(url);
      }

      if (!(0, _fastDeepEqual["default"])(fromProps.params, toProps.params)) {
        this.leafletElement.setParams(_objectSpread(_objectSpread({}, toProps.params), {}, {
          pane: toProps.leaflet.pane
        }));
      }
    }
  }, {
    key: "getOptions",
    value: function getOptions(params) {
      var superOptions = _get(_getPrototypeOf(WMSLayer.prototype), "getOptions", this).call(this, params);

      return Object.keys(superOptions).reduce(function (options, key) {
        if (!EVENTS_RE.test(key)) {
          options[key] = superOptions[key];
        }

        return options;
      }, {});
    }
  }]);

  return WMSLayer;
}(_reactLeaflet.MapLayer);

var _default = (0, _reactLeaflet.withLeaflet)(WMSLayer);

exports["default"] = _default;