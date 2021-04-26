"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _memoizeOne = _interopRequireDefault(require("memoize-one"));

var _ptrUtils = require("@gisatcz/ptr-utils");

var _ptrCore = require("@gisatcz/ptr-core");

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

var geojsonRbush = require('geojson-rbush')["default"];

function getBoundingBox(view, width, height, crs, optLat) {
  // TODO extent calculations for non-mercator projections
  if (!crs || crs === 'EPSG:3857') {
    var boxRange = view.boxRange; // view.boxRange may differ from actual rance visible in map because of levels

    var calculatedBoxRange = _ptrUtils.map.view.getNearestZoomLevelBoxRange(width, height, view.boxRange);

    if (boxRange !== calculatedBoxRange) {
      boxRange = calculatedBoxRange;
    }

    return _ptrUtils.map.view.getBoundingBoxFromViewForEpsg3857(view.center, boxRange, width / height, optLat);
  } else {
    return {
      minLat: -90,
      maxLat: 90,
      minLon: -180,
      maxLon: 180
    };
  }
}

var IndexedVectorLayer = /*#__PURE__*/function (_React$PureComponent) {
  _inherits(IndexedVectorLayer, _React$PureComponent);

  var _super = _createSuper(IndexedVectorLayer);

  function IndexedVectorLayer(props) {
    var _this;

    _classCallCheck(this, IndexedVectorLayer);

    _this = _super.call(this, props);
    _this.state = {
      rerender: null
    };
    _this.indexTree = geojsonRbush();
    _this.repopulateIndexTreeIfNeeded = (0, _memoizeOne["default"])(function (features) {
      if (features) {
        _this.indexTree.clear();

        _this.indexTree.load(features);
      }
    });
    return _this;
  }

  _createClass(IndexedVectorLayer, [{
    key: "boxRangeFitsLimits",
    value: function boxRangeFitsLimits() {
      var props = this.props;

      if (props.boxRangeRange) {
        var minBoxRange = props.boxRangeRange[0];
        var maxBoxRange = props.boxRangeRange[1];

        if (minBoxRange && maxBoxRange) {
          return minBoxRange <= props.view.boxRange && maxBoxRange >= props.view.boxRange;
        } else if (minBoxRange) {
          return minBoxRange <= props.view.boxRange;
        } else if (maxBoxRange) {
          return maxBoxRange >= props.view.boxRange;
        }
      } else {
        return true;
      }
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props = this.props,
          view = _this$props.view,
          zoom = _this$props.zoom,
          component = _this$props.component,
          width = _this$props.width,
          height = _this$props.height,
          crs = _this$props.crs,
          props = _objectWithoutProperties(_this$props, ["view", "zoom", "component", "width", "height", "crs"]);

      if (props.features && this.boxRangeFitsLimits()) {
        this.repopulateIndexTreeIfNeeded(props.features);
        var bbox = getBoundingBox(view, width, height, crs, _ptrCore.mapConstants.averageLatitude);
        var geoJsonBbox = {
          type: 'Feature',
          bbox: [bbox.minLon, bbox.minLat, bbox.maxLon, bbox.maxLat]
        }; // Find features in given bounding box

        var foundFeatureCollection = this.indexTree.search(geoJsonBbox);
        var foundFeatures = foundFeatureCollection && foundFeatureCollection.features || []; // Add filtered features only to Vector layer

        if (props.features.length !== foundFeatures.length) {
          props.features = foundFeatures;
        }

        return /*#__PURE__*/_react["default"].createElement(component, props);
      } else {
        return null;
      }
    }
  }]);

  return IndexedVectorLayer;
}(_react["default"].PureComponent);

IndexedVectorLayer.propTypes = {
  boxRangeRange: _propTypes["default"].array,
  component: _propTypes["default"].oneOfType([_propTypes["default"].func, _propTypes["default"].object]),
  omittedFeatureKeys: _propTypes["default"].array
};
var _default = IndexedVectorLayer;
exports["default"] = _default;