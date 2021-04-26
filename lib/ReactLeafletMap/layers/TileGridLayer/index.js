"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _react = _interopRequireDefault(require("react"));

var _lodash = _interopRequireDefault(require("lodash"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _ptrUtils = require("@gisatcz/ptr-utils");

var _ptrTileGrid = require("@gisatcz/ptr-tile-grid");

var _reactLeaflet = require("react-leaflet");

var _memoizeOne = _interopRequireDefault(require("memoize-one"));

var _helpers = _interopRequireDefault(require("../SvgVectorLayer/helpers"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

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

var getBoxRange = function getBoxRange(boxRange, width, height) {
  var calculatedBoxRange = _ptrUtils.map.view.getNearestZoomLevelBoxRange(width, height, boxRange);

  if (boxRange !== calculatedBoxRange) {
    return calculatedBoxRange;
  } else {
    return boxRange;
  }
};

var TileGridLayer = /*#__PURE__*/function (_React$PureComponent) {
  _inherits(TileGridLayer, _React$PureComponent);

  var _super = _createSuper(TileGridLayer);

  function TileGridLayer(props) {
    var _this;

    _classCallCheck(this, TileGridLayer);

    _this = _super.call(this, props);
    _this.pointsPaneName = _ptrUtils.utils.uuid();
    _this.getStyle = _this.getStyle.bind(_assertThisInitialized(_this));
    _this.onEachFeature = _this.onEachFeature.bind(_assertThisInitialized(_this));
    _this.getRenderId = (0, _memoizeOne["default"])(function (features) {
      if (features) {
        return _ptrUtils.utils.uuid();
      }
    });
    return _this;
  }

  _createClass(TileGridLayer, [{
    key: "onEachFeature",
    value: function onEachFeature(feature, layer) {}
  }, {
    key: "getStyle",
    value: function getStyle(feature) {
      var styles = _helpers["default"].calculateStyle(feature, this.props.style, undefined, feature.selected, feature.selectedStyleDefinition, feature.selectedHoveredStyleDefinition);

      if (feature.selected) {
        return styles.selected;
      } else {
        return styles["default"];
      }
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
    }
  }, {
    key: "render",
    value: function render() {
      var options = this.props.options;
      return this.renderBasicVectorLayer(options);
    }
  }, {
    key: "getGeoJsonTileGrid",
    value: function getGeoJsonTileGrid(tileGrid, boxRange, viewport) {
      var level = this.getTileGridLevel(boxRange, viewport); // // todo
      // // add buffer for leveles bigger than 5

      var size = _ptrTileGrid.utils.getGridSizeForLevel(level); // //consider caching levels


      var geojsonTileGrid = _ptrTileGrid.utils.getTileGridAsGeoJSON(tileGrid, size);

      return geojsonTileGrid;
    }
  }, {
    key: "getTileGridLevel",
    value: function getTileGridLevel(boxRange, viewport) {
      var viewportRange = _ptrUtils.map.view.getMapViewportRange(viewport.width, viewport.height);

      var nearestBoxRange = _ptrUtils.map.view.getNearestZoomLevelBoxRange(viewport.width, viewport.height, boxRange);

      var level = _ptrTileGrid.grid.getLevelByViewport(nearestBoxRange, viewportRange);

      return level;
    }
  }, {
    key: "getTilesMarkers",
    value: function getTilesMarkers() {
      var _this2 = this;

      var tileGrid = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
      var boxRange = arguments.length > 1 ? arguments[1] : undefined;
      var viewport = arguments.length > 2 ? arguments[2] : undefined;
      var level = this.getTileGridLevel(boxRange, viewport);
      var markers = tileGrid.reduce(function (acc, row) {
        var rowMarkers = row.map(function (tile, i) {
          return /*#__PURE__*/_react["default"].createElement(_reactLeaflet.Pane, {
            style: {
              zIndex: _this2.props.zIndex
            },
            key: "".concat(level, "-").concat(tile[0], "-").concat(tile[1])
          }, /*#__PURE__*/_react["default"].createElement(_reactLeaflet.Marker, {
            zIndex: _this2.props.zIndex,
            position: [tile[1], tile[0]],
            icon: new L.DivIcon({
              //push every second tile title up to prevent overlays
              iconAnchor: [-10, 20 + i % 2 * 20],
              className: 'my-div-icon',
              html: "<div style=\"display:flex\"><div style=\"white-space: nowrap;\">".concat(level, "-").concat(tile[0], "-").concat(tile[1], "</div></div>")
            })
          }));
        });
        return [].concat(_toConsumableArray(acc), _toConsumableArray(rowMarkers));
      }, []);
      return markers;
    }
  }, {
    key: "renderBasicVectorLayer",
    value: function renderBasicVectorLayer(options) {
      var _this$props = this.props,
          opt = _this$props.options,
          props = _objectWithoutProperties(_this$props, ["options"]);

      var recalculatedBoxrange = getBoxRange(props.view.boxRange, options.viewport.width, options.viewport.height);

      var tileGrid = _ptrTileGrid.grid.getTileGrid(options.viewport.width, options.viewport.height, recalculatedBoxrange, props.view.center, true);

      var geoJsonTileGrid = this.getGeoJsonTileGrid(tileGrid, recalculatedBoxrange, options.viewport); // generate new key on features change to return the new instance
      // more: https://react-leaflet.js.org/docs/en/components#geojson

      var key = this.getRenderId(geoJsonTileGrid.features);
      var tilesMarkers = this.getTilesMarkers(tileGrid, recalculatedBoxrange, options.viewport);
      return /*#__PURE__*/_react["default"].createElement(_react["default"].Fragment, null, /*#__PURE__*/_react["default"].createElement(_reactLeaflet.GeoJSON, {
        key: key,
        data: geoJsonTileGrid.features,
        style: this.getStyle,
        onEachFeature: this.onEachFeature,
        zIndex: this.props.zIndex // pointToLayer={this.pointToLayer}
        // filter={this.filter}

      }), tilesMarkers);
    }
  }]);

  return TileGridLayer;
}(_react["default"].PureComponent);

TileGridLayer.propTypes = {
  layerKey: _propTypes["default"].string,
  uniqueLayerKey: _propTypes["default"].oneOfType([_propTypes["default"].number, _propTypes["default"].string]),
  view: _propTypes["default"].object,
  zoom: _propTypes["default"].number,
  zIndex: _propTypes["default"].number
};

var _default = (0, _reactLeaflet.withLeaflet)(TileGridLayer);

exports["default"] = _default;