"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _react = _interopRequireDefault(require("react"));

var _classnames = _interopRequireDefault(require("classnames"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _lodash = require("lodash");

var _ptrUtils = require("@gisatcz/ptr-utils");

var _reactLeaflet = require("react-leaflet");

var _helpers = _interopRequireDefault(require("./helpers"));

var _Feature = _interopRequireDefault(require("./Feature"));

var _constants = _interopRequireDefault(require("../../../constants"));

var _GeoJsonLayer = _interopRequireDefault(require("./GeoJsonLayer"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

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

var SvgVectorLayer = /*#__PURE__*/function (_React$PureComponent) {
  _inherits(SvgVectorLayer, _React$PureComponent);

  var _super = _createSuper(SvgVectorLayer);

  function SvgVectorLayer(props) {
    var _this;

    _classCallCheck(this, SvgVectorLayer);

    _this = _super.call(this, props);
    _this.pointsPaneName = _ptrUtils.utils.uuid();
    _this.linesPaneName = _ptrUtils.utils.uuid();
    _this.polygonsPaneName = _ptrUtils.utils.uuid();
    _this.onFeatureClick = _this.onFeatureClick.bind(_assertThisInitialized(_this));
    return _this;
  }

  _createClass(SvgVectorLayer, [{
    key: "onFeatureClick",
    value: function onFeatureClick(fid) {
      if (this.props.onClick) {
        this.props.onClick(this.props.layerKey, [fid]);
      }
    }
  }, {
    key: "prepareData",
    value: function prepareData(features) {
      var _this2 = this;

      if (features) {
        var pointFeatures = [];
        var polygonFeatures = [];
        var lineFeatures = [];
        var sortedPointFeatures = null;
        var sortedPolygonFeatures = null;
        (0, _lodash.forEach)(features, function (feature) {
          var type = feature && feature.geometry && feature.geometry.type;

          if (type) {
            var _selected, _selected2;

            var fid = _this2.props.fidColumnName && feature.properties[_this2.props.fidColumnName];
            var uniqueFeatureKey = "".concat(_this2.props.uniqueLayerKey, "_").concat(fid);
            var selected = null;
            var defaultStyle = null;

            if (_this2.props.selected && fid) {
              (0, _lodash.forIn)(_this2.props.selected, function (selection, key) {
                if (selection.keys && (0, _lodash.includes)(selection.keys, fid)) {
                  selected = selection;
                }
              });
            }

            if (type === 'Point' || type === 'MultiPoint') {
              defaultStyle = _helpers["default"].getDefaultStyle(feature, _this2.props.style);
            }

            var data = {
              feature: feature,
              fid: fid,
              uniqueFeatureKey: uniqueFeatureKey,
              defaultStyle: defaultStyle,
              selected: !!selected,
              selectedStyleDefinition: (_selected = selected) === null || _selected === void 0 ? void 0 : _selected.style,
              selectedHoveredStyleDefinition: (_selected2 = selected) === null || _selected2 === void 0 ? void 0 : _selected2.hoveredStyle
            };

            switch (type) {
              case 'Point':
              case 'MultiPoint':
                pointFeatures.push(data);
                break;

              case 'Polygon':
              case 'MultiPolygon':
                polygonFeatures.push(data);
                break;

              case 'LineString':
              case 'MultiLineString':
                lineFeatures.push(data);
                break;

              default:
                break;
            }
          }
        }); // sort point features by radius

        if (pointFeatures.length) {
          sortedPointFeatures = (0, _lodash.orderBy)(pointFeatures, ['defaultStyle.radius', 'fid'], ['desc', 'asc']);
        } // sort polygon features, if selected


        if (polygonFeatures.length) {
          if (this.props.selected) {
            sortedPolygonFeatures = (0, _lodash.orderBy)(polygonFeatures, ['selected'], ['asc']);
          } else {
            sortedPolygonFeatures = polygonFeatures;
          }
        }

        return {
          polygons: sortedPolygonFeatures,
          points: sortedPointFeatures || pointFeatures,
          lines: lineFeatures
        };
      } else {
        return null;
      }
    }
  }, {
    key: "render",
    value: function render() {
      var _data$polygons, _data$lines, _data$points;

      var data = this.prepareData(this.props.features);
      var style = this.props.opacity ? {
        opacity: this.props.opacity
      } : null;
      var classes = (0, _classnames["default"])({
        'hoverable-pane': this.props.hoverable,
        'selected-features-pane': this.props.withSelectedFeaturesOnly
      });
      return data ? /*#__PURE__*/_react["default"].createElement(_react["default"].Fragment, null, (_data$polygons = data.polygons) !== null && _data$polygons !== void 0 && _data$polygons.length ? /*#__PURE__*/_react["default"].createElement(_reactLeaflet.Pane, {
        className: classes,
        style: style,
        name: this.polygonsPaneName
      }, this.renderFeatures(data.polygons)) : null, (_data$lines = data.lines) !== null && _data$lines !== void 0 && _data$lines.length ? /*#__PURE__*/_react["default"].createElement(_reactLeaflet.Pane, {
        className: classes,
        style: style,
        name: this.linesPaneName
      }, this.renderFeatures(data.lines)) : null, (_data$points = data.points) !== null && _data$points !== void 0 && _data$points.length ? /*#__PURE__*/_react["default"].createElement(_reactLeaflet.Pane, {
        className: classes,
        style: style,
        name: this.pointsPaneName
      }, this.renderFeatures(data.points)) : null) : null;
    }
  }, {
    key: "renderFeatures",
    value: function renderFeatures(features) {
      var _this3 = this;

      if (this.props.renderAsGeoJson || features.length > _constants["default"].maxFeaturesAsReactElement) {
        // GeoJsonLayer doesn't get context
        return this.renderGeoJson(features);
      } else {
        return features.map(function (item, index) {
          return _this3.renderFeature(item, index);
        });
      }
    }
  }, {
    key: "renderGeoJson",
    value: function renderGeoJson(features) {
      var _this$props$resources;

      return /*#__PURE__*/_react["default"].createElement(_GeoJsonLayer["default"], {
        layerKey: this.props.layerKey,
        uniqueLayerKey: this.props.uniqueLayerKey,
        paneName: this.pointsPaneName,
        features: features,
        onFeatureClick: this.onFeatureClick,
        omittedFeatureKeys: this.props.omittedFeatureKeys,
        fidColumnName: this.props.fidColumnName,
        pointAsMarker: this.props.pointAsMarker,
        selectable: this.props.selectable,
        hoverable: this.props.hoverable,
        styleDefinition: this.props.style,
        hoveredStyleDefinition: this.props.hovered && this.props.hovered.style,
        icons: (_this$props$resources = this.props.resources) === null || _this$props$resources === void 0 ? void 0 : _this$props$resources.icons
      });
    }
  }, {
    key: "renderFeature",
    value: function renderFeature(data, index) {
      var _this$props$resources2;

      var key = data.uniqueFeatureKey || "".concat(this.props.uniqueLayerKey, "_").concat(data.fid || index);
      return /*#__PURE__*/_react["default"].createElement(_Feature["default"], {
        key: key,
        uniqueFeatureKey: data.uniqueFeatureKey,
        onClick: this.onFeatureClick,
        fid: data.fid,
        fidColumnName: this.props.fidColumnName,
        feature: data.feature,
        type: data.feature.geometry.type,
        pointAsMarker: this.props.pointAsMarker,
        selectable: this.props.selectable,
        selected: data.selected,
        selectedStyleDefinition: data.selectedStyleDefinition,
        selectedHoveredStyleDefinition: data.selectedStyleDefinition,
        hoverable: this.props.hoverable,
        styleDefinition: this.props.style,
        hoveredStyleDefinition: this.props.hovered && this.props.hovered.style,
        icons: (_this$props$resources2 = this.props.resources) === null || _this$props$resources2 === void 0 ? void 0 : _this$props$resources2.icons
      });
    }
  }]);

  return SvgVectorLayer;
}(_react["default"].PureComponent);

SvgVectorLayer.propTypes = {
  layerKey: _propTypes["default"].string,
  uniqueLayerKey: _propTypes["default"].string,
  // typically a combination of layerKey and data source key (or just layerKey, if no data source)
  renderAsGeoJson: _propTypes["default"].bool,
  // Use Leaflet's GeoJSON layer to render vector features
  features: _propTypes["default"].array,
  fidColumnName: _propTypes["default"].string,
  omittedFeatureKeys: _propTypes["default"].array,
  selectable: _propTypes["default"].bool,
  selected: _propTypes["default"].object,
  hoverable: _propTypes["default"].bool,
  hovered: _propTypes["default"].object,
  style: _propTypes["default"].object,
  pointAsMarker: _propTypes["default"].bool,
  onClick: _propTypes["default"].func,
  withSelectedFeaturesOnly: _propTypes["default"].bool // True, if layer contains only selected features

};
var _default = SvgVectorLayer;
exports["default"] = _default;