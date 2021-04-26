"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _webworldwindEsa = _interopRequireDefault(require("webworldwind-esa"));

var _ptrUtils = _interopRequireDefault(require("@gisatcz/ptr-utils"));

var _lodash = require("lodash");

var _constants = _interopRequireDefault(require("../../constants"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

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
 * @param layer.name {string}
 * @param layer.opacity {number}
 * @param layer.options {Object}
 * @param layer.options.features {Array}
 * @augments WorldWind.RenderableLayer
 * @constructor
 */
var VectorLayer = /*#__PURE__*/function (_WorldWind$Renderable) {
  _inherits(VectorLayer, _WorldWind$Renderable);

  var _super = _createSuper(VectorLayer);

  function VectorLayer(layer, options) {
    var _this;

    _classCallCheck(this, VectorLayer);

    var name = layer.name || '';
    _this = _super.call(this, name);
    _this.opacity = layer.opacity || 1;
    _this.pantherProps = {
      features: options.features || [],
      fidColumnName: options.fidColumnName,
      hoverable: options.hoverable,
      selectable: options.selectable,
      hovered: _objectSpread({}, options.hovered),
      selected: _objectSpread({}, options.selected),
      key: layer.key,
      layerKey: options.layerKey,
      onHover: options.onHover,
      onClick: options.onClick,
      style: options.style
    };

    _this.addFeatures(_this.pantherProps.features);

    return _this;
  }
  /**;
   * @param features {Array} List of GeoJSON features
   */


  _createClass(VectorLayer, [{
    key: "addFeatures",
    value: function addFeatures(features) {
      var _this2 = this;

      var geojson = {
        type: 'FeatureCollection',
        features: features
      };
      var parser = new _webworldwindEsa["default"].GeoJSONParser(geojson);

      var shapeConfigurationCallback = function shapeConfigurationCallback(geometry, properties) {
        var _this2$pantherProps$h;

        var defaultStyleObject = _ptrUtils["default"].mapStyle.getStyleObject(properties, _this2.pantherProps.style || _constants["default"].vectorFeatureStyle.defaultFull);

        var defaultStyle = _this2.getStyleDefinition(defaultStyleObject);

        var hoveredStyleObject, hoveredStyle;

        if ((_this2$pantherProps$h = _this2.pantherProps.hovered) !== null && _this2$pantherProps$h !== void 0 && _this2$pantherProps$h.style) {
          hoveredStyleObject = _this2.pantherProps.hovered.style === 'default' ? _constants["default"].vectorFeatureStyle.hovered : _this2.pantherProps.hovered.style;
          hoveredStyle = _this2.getStyleDefinition(_objectSpread(_objectSpread({}, defaultStyleObject), hoveredStyleObject));
        }

        return {
          userProperties: _objectSpread(_objectSpread({}, properties), {}, {
            defaultStyleObject: defaultStyleObject,
            defaultStyle: defaultStyle,
            hoveredStyleObject: hoveredStyleObject,
            hoveredStyle: hoveredStyle
          })
        };
      };

      var renderablesAddCallback = function renderablesAddCallback(layer) {
        layer.renderables.forEach(function (renderable) {
          _this2.applyStyles(renderable);
        });
      };

      parser.load(renderablesAddCallback, shapeConfigurationCallback, this);
    }
    /**
     * @param fids {Array}
     */

  }, {
    key: "updateHoveredFeatures",
    value: function updateHoveredFeatures(fids) {
      var _this3 = this;

      this.renderables.forEach(function (renderable) {
        var key = renderable.userProperties[_this3.pantherProps.fidColumnName];

        if ((0, _lodash.includes)(fids, key)) {
          var selection = _this3.getSelection(renderable);

          if (selection !== null && selection !== void 0 && selection.hoveredStyle) {
            var selectedHoveredStyleObject = selection.hoveredStyle === 'default' ? _constants["default"].vectorFeatureStyle.selectedHovered : selection.hoveredStyle;

            var selectedHoveredStyle = _this3.getStyleDefinition(_objectSpread(_objectSpread({}, renderable.userProperties.defaultStyleObject), selectedHoveredStyleObject));

            _this3.applyWorldWindStyles(renderable, selectedHoveredStyle);
          } else if (renderable, renderable.userProperties.hoveredStyle) {
            _this3.applyWorldWindStyles(renderable, renderable.userProperties.hoveredStyle);
          }
        } else {
          _this3.applyStyles(renderable);
        }
      });
    }
    /**
     * Convert panther style definition to World Wind style definition
     * @param styleObject {Object}
     * @return {Object}
     */

  }, {
    key: "getStyleDefinition",
    value: function getStyleDefinition(styleObject) {
      var style = {};

      if (styleObject.fill) {
        var fillRgb = _ptrUtils["default"].mapStyle.hexToRgb(styleObject.fill);

        style.interiorColor = new _webworldwindEsa["default"].Color(fillRgb.r / 255, fillRgb.g / 256, fillRgb.b / 256, styleObject.fillOpacity || 1);
      } else {
        style.interiorColor = _webworldwindEsa["default"].Color.TRANSPARENT;
      }

      if (styleObject.outlineColor && styleObject.outlineWidth) {
        var outlineRgb = _ptrUtils["default"].mapStyle.hexToRgb(styleObject.outlineColor);

        style.outlineColor = new _webworldwindEsa["default"].Color(outlineRgb.r / 255, outlineRgb.g / 256, outlineRgb.b / 256, styleObject.outlineOpacity || 1);
        style.outlineWidth = styleObject.outlineWidth;
      } else {
        style.outlineColor = _webworldwindEsa["default"].Color.TRANSPARENT;
      }

      return style;
    }
    /**
     * Get selection for feature
     * @param renderable {Object}
     * @return {Object}
     */

  }, {
    key: "getSelection",
    value: function getSelection(renderable) {
      if (this.pantherProps.selected) {
        var featureKey = renderable.userProperties[this.pantherProps.fidColumnName];
        var selectionDefintion = null;
        (0, _lodash.forIn)(this.pantherProps.selected, function (selection, key) {
          if (selection.keys && (0, _lodash.includes)(selection.keys, featureKey)) {
            selectionDefintion = selection;
          }
        });
        return selectionDefintion;
      } else {
        return null;
      }
    }
    /**
     * @param renderable {WorldWind.Renderable}
     */

  }, {
    key: "applyStyles",
    value: function applyStyles(renderable) {
      var defaultStyleObject = renderable.userProperties.defaultStyleObject;
      var selection = this.getSelection(renderable);

      if (selection !== null && selection !== void 0 && selection.style) {
        var selectedStyleObject = selection.style === 'default' ? _constants["default"].vectorFeatureStyle.selected : selection.style;
        var selectedStyle = this.getStyleDefinition(_objectSpread(_objectSpread({}, defaultStyleObject), selectedStyleObject));
        this.applyWorldWindStyles(renderable, selectedStyle);
      } else {
        this.applyWorldWindStyles(renderable, renderable.userProperties.defaultStyle);
      }
    }
    /**
     * @param renderable {WorldWind.Renderable}
     * @param style {Object}
     */

  }, {
    key: "applyWorldWindStyles",
    value: function applyWorldWindStyles(renderable, style) {
      renderable.attributes.outlineWidth = style.outlineWidth;
      renderable.attributes.outlineColor = style.outlineColor;
      renderable.attributes.interiorColor = style.interiorColor;
    }
  }]);

  return VectorLayer;
}(_webworldwindEsa["default"].RenderableLayer);

var _default = VectorLayer;
exports["default"] = _default;