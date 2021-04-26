"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _react = _interopRequireDefault(require("react"));

var _lodash = require("lodash");

var _propTypes = _interopRequireDefault(require("prop-types"));

var _ptrUtils = require("@gisatcz/ptr-utils");

var _reactLeaflet = require("react-leaflet");

var _leaflet = _interopRequireDefault(require("leaflet"));

var _helpers = _interopRequireDefault(require("../helpers"));

var _memoizeOne = _interopRequireDefault(require("memoize-one"));

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

var GeoJsonLayer = /*#__PURE__*/function (_React$PureComponent) {
  _inherits(GeoJsonLayer, _React$PureComponent);

  var _super = _createSuper(GeoJsonLayer);

  function GeoJsonLayer(props) {
    var _this;

    _classCallCheck(this, GeoJsonLayer);

    _this = _super.call(this, props);
    _this.getStyle = _this.getStyle.bind(_assertThisInitialized(_this));
    _this.filter = _this.filter.bind(_assertThisInitialized(_this));
    _this.onEachFeature = _this.onEachFeature.bind(_assertThisInitialized(_this));
    _this.pointToLayer = _this.pointToLayer.bind(_assertThisInitialized(_this));
    _this.getRenderId = (0, _memoizeOne["default"])(function (features) {
      if (features) {
        return _ptrUtils.utils.uuid();
      }
    });
    return _this;
  }

  _createClass(GeoJsonLayer, [{
    key: "getStyle",
    value: function getStyle(feature) {
      var styles = _helpers["default"].calculateStyle(feature.feature, this.props.styleDefinition, this.props.hoveredStyleDefinition, feature.selected, feature.selectedStyleDefinition, feature.selectedHoveredStyleDefinition);

      if (feature.selected) {
        return styles.selected;
      } else {
        return styles["default"];
      }
    }
  }, {
    key: "onEachFeature",
    value: function onEachFeature(feature, layer) {
      var _this2 = this;

      var geometryType = feature.geometry.type;
      var isPolygon = geometryType === 'Polygon' || geometryType === 'MultiPolygon';
      var isLine = geometryType === 'Line' || geometryType === 'LineString';

      var styles = _helpers["default"].calculateStyle(feature.feature, this.props.styleDefinition, this.props.hoveredStyleDefinition, feature.selected, feature.selectedStyleDefinition, feature.selectedHoveredStyleDefinition);

      layer.on({
        click: function click(e) {
          if (_this2.props.onFeatureClick && _this2.props.selectable && feature.fid) {
            _this2.props.onFeatureClick(feature.fid);
          }
        },
        mousemove: function mousemove(e) {
          if (_this2.props.hoverable) {
            if (feature.selected && styles.selectedHovered) {
              _this2.setStyle(styles.selectedHovered, e.target);
            } else {
              _this2.setStyle(styles.hovered, e.target);
            }

            if (isPolygon || isLine) {
              layer.bringToFront();
            }
          }
        },
        mouseout: function mouseout(e) {
          if (_this2.props.hoverable) {
            if (feature.selected && styles.selected) {
              _this2.setStyle(styles.selected, e.target);
            } else {
              _this2.setStyle(styles["default"], e.target);
            }

            if ((isLine || isPolygon) && !feature.selected) {
              layer.bringToBack();
            }
          }
        }
      });
    }
    /**
     * Set style of the feature
     * @param leafletStyle {Object} Leaflet style definition
     * @param element {Object} Leaflet element
     */

  }, {
    key: "setStyle",
    value: function setStyle(leafletStyle, element) {
      var _element$options;

      var shape = element === null || element === void 0 ? void 0 : (_element$options = element.options) === null || _element$options === void 0 ? void 0 : _element$options.icon;

      if (shape) {
        shape.setStyle(leafletStyle, shape.id, shape.isBasicShape);
      } else {
        element.setStyle(leafletStyle);
      }
    } // render points

  }, {
    key: "pointToLayer",
    value: function pointToLayer(feature, coord) {
      if (this.props.pointAsMarker) {
        var _style, _style2, _style3;

        var style = feature.defaultStyle; // for circles, use L.circleMarker due to better performance

        if (!((_style = style) !== null && _style !== void 0 && _style.shape) && !((_style2 = style) !== null && _style2 !== void 0 && _style2.icon) || ((_style3 = style) === null || _style3 === void 0 ? void 0 : _style3.shape) === 'circle') {
          return _leaflet["default"].circleMarker(coord, _objectSpread(_objectSpread({}, feature.defaultStyle), {}, {
            pane: this.props.paneName
          }));
        } else {
          if (feature.selected) {
            var styles = _helpers["default"].calculateStyle(feature.feature, this.props.styleDefinition, this.props.hoveredStyleDefinition, feature.selected, feature.selectedStyleDefinition, feature.selectedHoveredStyleDefinition);

            style = styles.selected;
          }

          var shapeId = feature.uniqueFeatureKey ? "".concat(feature.uniqueFeatureKey, "_icon") : _ptrUtils.utils.uuid();

          var shape = _helpers["default"].getMarkerShape(shapeId, style, {
            icons: this.props.icons
          });

          return _leaflet["default"].marker(coord, {
            pane: this.props.paneName,
            interactive: this.props.hoverable || this.props.selectable,
            icon: shape
          });
        }
      } else {
        return _leaflet["default"].circle(coord, feature.defaultStyle);
      }
    }
  }, {
    key: "filter",
    value: function filter(feature) {
      if (this.props.omittedFeatureKeys) {
        var featureKey = feature.id || feature.properties[this.props.fidColumnName];
        return !(featureKey && (0, _lodash.includes)(this.props.omittedFeatureKeys, featureKey));
      } else {
        return true;
      }
    }
  }, {
    key: "render",
    value: function render() {
      var features = this.props.features.map(function (item) {
        return _objectSpread(_objectSpread({}, item.feature), item);
      }); // generate new key on features change to return the new instance
      // more: https://react-leaflet.js.org/docs/en/components#geojson

      var key = this.getRenderId(this.props.features);
      return /*#__PURE__*/_react["default"].createElement(_reactLeaflet.GeoJSON, {
        key: key,
        data: features,
        style: this.getStyle,
        onEachFeature: this.onEachFeature,
        pointToLayer: this.pointToLayer,
        filter: this.filter
      });
    }
  }]);

  return GeoJsonLayer;
}(_react["default"].PureComponent);

GeoJsonLayer.propTypes = {
  omittedFeatureKeys: _propTypes["default"].array // list of feature keys that shouldn't be rendered

};

var _default = (0, _reactLeaflet.withLeaflet)(GeoJsonLayer);

exports["default"] = _default;