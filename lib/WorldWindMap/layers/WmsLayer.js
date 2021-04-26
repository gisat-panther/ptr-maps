"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _webworldwindEsa = _interopRequireDefault(require("webworldwind-esa"));

var _lodash = require("lodash");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

/**
 * @param layer {Object}
 * @param layer.key {string}
 * @param layer.opacity {number}
 * @param layer.options {Object}
 * @param layer.options.url {string}
 * @param layer.options.params {object}
 * @augments WorldWind.WmsLayer
 * @constructor
 */
var WmsLayer = /*#__PURE__*/function (_WorldWind$WmsLayer) {
  _inherits(WmsLayer, _WorldWind$WmsLayer);

  var _super = _createSuper(WmsLayer);

  function WmsLayer(layer) {
    var _this;

    _classCallCheck(this, WmsLayer);

    var key = layer.key,
        options = layer.options,
        opacity = layer.opacity;

    var _options$params = options.params,
        imageFormat = _options$params.imageFormat,
        layers = _options$params.layers,
        name = _options$params.name,
        styles = _options$params.styles,
        version = _options$params.version,
        params = _objectWithoutProperties(_options$params, ["imageFormat", "layers", "name", "styles", "version"]);

    var worldWindOptions = {
      key: key,
      format: imageFormat || 'image/png',
      layerNames: layers,
      levelZeroDelta: new _webworldwindEsa["default"].Location(45, 45),
      name: name,
      numLevels: 18,
      opacity: opacity || 1,
      params: (0, _lodash.isEmpty)(params) ? null : params,
      sector: new _webworldwindEsa["default"].Sector(-90, 90, -180, 180),
      service: options.url,
      size: 256,
      styleNames: styles,
      version: version || '1.3.0'
    };
    _this = _super.call(this, worldWindOptions);
    _this.key = key;
    _this.attributions = options.attributions;
    _this.layerNames = layers;
    _this.service = options.url;
    _this.styleNames = styles || '';
    _this.customParams = params;
    _this.numLevels = worldWindOptions.numLevels;
    _this.cachePath = "".concat(_this.service, "/").concat(_this.layerNames);

    if (_this.styleNames) {
      _this.cachePath += "/".concat(_this.styleNames);
    }

    if (_this.customParams && _this.customParams.time) {
      _this.cachePath += "/".concat(_this.customParams.time);
    }

    _this.opacity = worldWindOptions.opacity; // TODO extend url builder to accept custom params

    return _this;
  }

  _createClass(WmsLayer, [{
    key: "doRender",
    value: function doRender(dc) {
      _webworldwindEsa["default"].WmsLayer.prototype.doRender.call(this, dc);

      dc.screenCreditController.clear();
    }
  }]);

  return WmsLayer;
}(_webworldwindEsa["default"].WmsLayer);

var _default = WmsLayer;
exports["default"] = _default;