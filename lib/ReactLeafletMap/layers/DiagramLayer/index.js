"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _react = _interopRequireDefault(require("react"));

var _lodash = require("lodash");

var _reactLeaflet = require("react-leaflet");

var _centerOfMass = _interopRequireDefault(require("@turf/center-of-mass"));

var _flip = _interopRequireDefault(require("@turf/flip"));

var _constants = _interopRequireDefault(require("../../../constants"));

var _SvgVectorLayer2 = _interopRequireDefault(require("../SvgVectorLayer"));

var _Feature = _interopRequireDefault(require("../SvgVectorLayer/Feature"));

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

var DiagramLayer = /*#__PURE__*/function (_SvgVectorLayer) {
  _inherits(DiagramLayer, _SvgVectorLayer);

  var _super = _createSuper(DiagramLayer);

  function DiagramLayer(props) {
    _classCallCheck(this, DiagramLayer);

    return _super.call(this, props);
  }

  _createClass(DiagramLayer, [{
    key: "getDiagramDefaultStyle",
    value: function getDiagramDefaultStyle(feature, defaultStyleObject) {
      return this.getDiagramLeafletStyle(feature, defaultStyleObject);
    }
  }, {
    key: "getDiagramAccentedStyle",
    value: function getDiagramAccentedStyle(feature, defaultStyleObject, accentedStyleObject) {
      var style = _objectSpread(_objectSpread({}, defaultStyleObject), accentedStyleObject);

      return this.getDiagramLeafletStyle(feature, style);
    }
  }, {
    key: "getDiagramLeafletStyle",
    value: function getDiagramLeafletStyle(feature, style) {
      var finalStyle = {};
      finalStyle.color = style.diagramOutlineColor ? style.diagramOutlineColor : null;
      finalStyle.weight = style.diagramOutlineWidth ? style.diagramOutlineWidth : 0;
      finalStyle.opacity = style.diagramOutlineOpacity ? style.diagramOutlineOpacity : 1;
      finalStyle.fillOpacity = style.diagramFillOpacity ? style.diagramFillOpacity : 1;
      finalStyle.fillColor = style.diagramFill;

      if (!style.diagramFill) {
        finalStyle.fillColor = null;
        finalStyle.fillOpacity = 0;
      }

      if (!style.diagramOutlineColor || !style.diagramOutlineWidth) {
        finalStyle.color = null;
        finalStyle.opacity = 0;
        finalStyle.weight = 0;
      }

      if (style.diagramSize) {
        finalStyle.radius = style.diagramSize;
      } else if (style.diagramVolume) {
        finalStyle.radius = Math.sqrt(style.diagramVolume / Math.PI);
      }

      return finalStyle;
    }
  }, {
    key: "prepareData",
    value: function prepareData(features) {
      var _this = this;

      if (features) {
        var data = [];
        (0, _lodash.forEach)(features, function (feature) {
          var _this$props$hovered;

          var fid = _this.props.fidColumnName && feature.properties[_this.props.fidColumnName];
          var centroid = (0, _centerOfMass["default"])(feature.geometry);
          var selected = null;
          var areaSelectedStyle = null;
          var diagramSelectedStyle = null;
          var areaSelectedHoveredStyle = null;
          var diagramSelectedHoveredStyle = null;

          if (_this.props.selected && fid) {
            (0, _lodash.forIn)(_this.props.selected, function (selection, key) {
              if (selection.keys && (0, _lodash.includes)(selection.keys, fid)) {
                selected = selection;
              }
            });
          } // Flip coordinates due to different leaflet implementation


          var flippedFeature = (0, _flip["default"])(feature);
          var flippedCentroid = (0, _flip["default"])(centroid);
          var diagramLeafletCoordinates = flippedCentroid && flippedCentroid.geometry && flippedCentroid.geometry.coordinates;
          var areaLeafletCoordinates = flippedFeature && flippedFeature.geometry && flippedFeature.geometry.coordinates; // Prepare default styles

          var defaultStyleObject = _this.getDefaultStyleObject(feature);

          var areaDefaultStyle = _this.getFeatureDefaultStyle(feature, defaultStyleObject);

          var diagramDefaultStyle = _this.getDiagramDefaultStyle(feature, defaultStyleObject); // Prepare hovered style


          var hoveredStyleObject = null;
          var areaHoveredStyle = null;
          var diagramHoveredStyle = null;

          if ((_this$props$hovered = _this.props.hovered) !== null && _this$props$hovered !== void 0 && _this$props$hovered.style) {
            hoveredStyleObject = _this.props.hovered.style === 'default' ? _objectSpread(_objectSpread({}, _constants["default"].vectorFeatureStyle.hovered), _constants["default"].diagramStyle.hovered) : _this.props.hovered.style;
            areaHoveredStyle = _this.getFeatureAccentedStyle(feature, defaultStyleObject, hoveredStyleObject);
            diagramHoveredStyle = _this.getDiagramAccentedStyle(feature, defaultStyleObject, hoveredStyleObject);
          } // Prepare selected and selected hovered style, if selected


          if (selected) {
            var selectedStyleObject,
                selectedHoveredStyleObject = null;

            if (selected.style) {
              selectedStyleObject = selected.style === 'default' ? _objectSpread(_objectSpread({}, _constants["default"].vectorFeatureStyle.selected), _constants["default"].diagramStyle.selected) : selected.style;
              areaSelectedStyle = _this.getFeatureAccentedStyle(feature, defaultStyleObject, selectedStyleObject);
              diagramSelectedStyle = _this.getDiagramAccentedStyle(feature, defaultStyleObject, selectedStyleObject);
            }

            if (selected.hoveredStyle) {
              selectedHoveredStyleObject = selected.hoveredStyle === 'default' ? _objectSpread(_objectSpread({}, _constants["default"].vectorFeatureStyle.selectedHovered), _constants["default"].diagramStyle.selectedHovered) : selected.hoveredStyle;
              areaSelectedHoveredStyle = _this.getFeatureAccentedStyle(feature, defaultStyleObject, selectedHoveredStyleObject);
              diagramSelectedHoveredStyle = _this.getDiagramAccentedStyle(feature, defaultStyleObject, selectedHoveredStyleObject);
            }
          }

          data.push({
            feature: feature,
            fid: fid,
            selected: !!selected,
            hoverable: _this.props.hoverable,
            selectable: _this.props.selectable,
            areaDefaultStyle: areaDefaultStyle,
            areaHoveredStyle: areaHoveredStyle,
            areaSelectedStyle: areaSelectedStyle,
            areaSelectedHoveredStyle: areaSelectedHoveredStyle,
            areaLeafletCoordinates: areaLeafletCoordinates,
            diagramDefaultStyle: diagramDefaultStyle,
            diagramHoveredStyle: diagramHoveredStyle,
            diagramSelectedStyle: diagramSelectedStyle,
            diagramSelectedHoveredStyle: diagramSelectedHoveredStyle,
            diagramLeafletCoordinates: diagramLeafletCoordinates
          });
        });
        return (0, _lodash.orderBy)(data, ['diagramDefaultStyle.radius'], ['desc']);
      } else {
        return null;
      }
    }
  }, {
    key: "render",
    value: function render() {
      var _this2 = this;

      var data = this.prepareData(this.props.features);
      var sortedPolygons = data;

      if (this.props.selected) {
        sortedPolygons = (0, _lodash.orderBy)(data, ['selected'], ['asc']);
      }

      var style = this.props.opacity ? {
        opacity: this.props.opacity
      } : null;
      return data ? /*#__PURE__*/_react["default"].createElement(_reactLeaflet.Pane, {
        style: style
      }, /*#__PURE__*/_react["default"].createElement(_reactLeaflet.Pane, null, sortedPolygons.map(function (item, index) {
        return _this2.renderArea(item, index);
      })), /*#__PURE__*/_react["default"].createElement(_reactLeaflet.Pane, null, data.map(function (item, index) {
        return _this2.renderDiagram(item, index);
      }))) : null;
    }
  }, {
    key: "renderArea",
    value: function renderArea(data, index) {
      return /*#__PURE__*/_react["default"].createElement(_Feature["default"], {
        key: data.fid || index,
        fid: data.fid,
        onClick: this.onFeatureClick,
        fidColumnName: this.props.fidColumnName,
        type: data.feature.geometry.type,
        selectable: data.selectable,
        hoverable: data.hoverable,
        defaultStyle: data.areaDefaultStyle,
        hoveredStyle: data.areaHoveredStyle,
        selectedStyle: data.areaSelectedStyle,
        selectedHoveredStyle: data.areaSelectedHoveredStyle,
        selected: data.selected,
        leafletCoordinates: data.areaLeafletCoordinates,
        feature: data.feature
      });
    }
  }, {
    key: "renderDiagram",
    value: function renderDiagram(data, index) {
      return /*#__PURE__*/_react["default"].createElement(_Feature["default"], {
        key: data.fid || index,
        fid: data.fid,
        onClick: this.onFeatureClick,
        fidColumnName: this.props.fidColumnName,
        type: "Point",
        selectable: data.selectable,
        hoverable: data.hoverable,
        defaultStyle: data.diagramDefaultStyle,
        hoveredStyle: data.diagramHoveredStyle,
        selectedStyle: data.diagramSelectedStyle,
        selectedHoveredStyle: data.diagramSelectedHoveredStyle,
        selected: data.selected,
        leafletCoordinates: data.diagramLeafletCoordinates,
        feature: data.feature
      });
    }
  }]);

  return DiagramLayer;
}(_SvgVectorLayer2["default"]);

var _default = DiagramLayer;
exports["default"] = _default;