"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _react = _interopRequireDefault(require("react"));

var _lodash = require("lodash");

var _propTypes = _interopRequireDefault(require("prop-types"));

var _CanvasVectorLayer = _interopRequireDefault(require("../CanvasVectorLayer"));

var _IndexedVectorLayer = _interopRequireDefault(require("../IndexedVectorLayer"));

var _SvgVectorLayer = _interopRequireDefault(require("../SvgVectorLayer"));

var _TiledVectorLayer = _interopRequireDefault(require("../TiledVectorLayer"));

var _view = _interopRequireDefault(require("../../../utils/view"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

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

var VectorLayer = /*#__PURE__*/function (_React$PureComponent) {
  _inherits(VectorLayer, _React$PureComponent);

  var _super = _createSuper(VectorLayer);

  function VectorLayer() {
    _classCallCheck(this, VectorLayer);

    return _super.apply(this, arguments);
  }

  _createClass(VectorLayer, [{
    key: "getOptions",
    value: function getOptions() {
      var _props$options;

      var props = this.props;
      var renderAs = (_props$options = props.options) === null || _props$options === void 0 ? void 0 : _props$options.renderAs;
      var options = props.options;

      if (renderAs) {
        var _props$view;

        var boxRange = (_props$view = props.view) === null || _props$view === void 0 ? void 0 : _props$view.boxRange;
        var renderAsData = (0, _lodash.find)(renderAs, function (renderAsItem) {
          return _view["default"].isBoxRangeInRange(boxRange, renderAsItem.boxRangeRange);
        });

        if (renderAsData) {
          var _renderAsData$options, _options, _renderAsData$options2, _options2, _renderAsData$options3, _options3;

          // TODO enable to define other layer options in renderAs
          options = _objectSpread(_objectSpread({}, options), {}, {
            style: ((_renderAsData$options = renderAsData.options) === null || _renderAsData$options === void 0 ? void 0 : _renderAsData$options.style) || ((_options = options) === null || _options === void 0 ? void 0 : _options.style),
            pointAsMarker: (_renderAsData$options2 = renderAsData.options) !== null && _renderAsData$options2 !== void 0 && _renderAsData$options2.hasOwnProperty('pointAsMarker') ? renderAsData.options.pointAsMarker : (_options2 = options) === null || _options2 === void 0 ? void 0 : _options2.pointAsMarker,
            renderingTechnique: ((_renderAsData$options3 = renderAsData.options) === null || _renderAsData$options3 === void 0 ? void 0 : _renderAsData$options3.renderingTechnique) || ((_options3 = options) === null || _options3 === void 0 ? void 0 : _options3.renderingTechnique)
          });
        }
      }

      return options;
    }
  }, {
    key: "render",
    value: function render() {
      var type = this.props.type;
      var options = this.getOptions(); // TODO handle type 'diagram'

      if (type === 'tiledVector' || type === 'tiled-vector') {
        return this.renderTiledVectorLayer(options);
      } else {
        return this.renderBasicVectorLayer(options);
      }
    }
  }, {
    key: "renderTiledVectorLayer",
    value: function renderTiledVectorLayer(options) {
      var _this$props = this.props,
          opt = _this$props.options,
          props = _objectWithoutProperties(_this$props, ["options"]);

      return /*#__PURE__*/_react["default"].createElement(_TiledVectorLayer["default"], _extends({}, props, options));
    }
  }, {
    key: "renderBasicVectorLayer",
    value: function renderBasicVectorLayer(options) {
      var _this$props2 = this.props,
          opt = _this$props2.options,
          props = _objectWithoutProperties(_this$props2, ["options"]);

      if (options.renderingTechnique === 'canvas') {
        return /*#__PURE__*/_react["default"].createElement(_CanvasVectorLayer["default"], _extends({}, props, options));
      } else {
        return /*#__PURE__*/_react["default"].createElement(_IndexedVectorLayer["default"], _extends({
          component: _SvgVectorLayer["default"]
        }, props, options));
      }
    }
  }]);

  return VectorLayer;
}(_react["default"].PureComponent);

VectorLayer.propTypes = {
  layerKey: _propTypes["default"].string,
  uniqueLayerKey: _propTypes["default"].oneOfType([_propTypes["default"].number, _propTypes["default"].string]),
  onClick: _propTypes["default"].func,
  opacity: _propTypes["default"].number,
  options: _propTypes["default"].object,
  type: _propTypes["default"].string,
  view: _propTypes["default"].object,
  zoom: _propTypes["default"].number,
  zIndex: _propTypes["default"].number
};
var _default = VectorLayer;
exports["default"] = _default;