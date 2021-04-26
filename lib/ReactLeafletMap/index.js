"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _react = _interopRequireDefault(require("react"));

var _lodash = require("lodash");

var _reactLeaflet = require("react-leaflet");

var _propTypes = _interopRequireDefault(require("prop-types"));

var _leaflet = _interopRequireDefault(require("leaflet"));

var _proj4leaflet = _interopRequireDefault(require("proj4leaflet"));

var _reactResizeDetector = _interopRequireDefault(require("react-resize-detector"));

var _ptrCore = require("@gisatcz/ptr-core");

var _ptrUtils = require("@gisatcz/ptr-utils");

var _view = _interopRequireDefault(require("../utils/view"));

var _viewHelpers = _interopRequireDefault(require("./viewHelpers"));

var _VectorLayer = _interopRequireDefault(require("./layers/VectorLayer"));

var _WMSLayer = _interopRequireDefault(require("./layers/WMSLayer"));

var _TileGridLayer = _interopRequireDefault(require("./layers/TileGridLayer"));

var _constants = _interopRequireDefault(require("../constants"));

var _viewport = _interopRequireDefault(require("../utils/viewport"));

require("./style.scss");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

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

var ReactLeafletMap = /*#__PURE__*/function (_React$PureComponent) {
  _inherits(ReactLeafletMap, _React$PureComponent);

  var _super = _createSuper(ReactLeafletMap);

  function ReactLeafletMap(props) {
    var _this;

    _classCallCheck(this, ReactLeafletMap);

    _this = _super.call(this, props);
    _this.state = {
      view: null,
      crs: _this.getCRS(props.crs)
    };
    _this.onClick = _this.onClick.bind(_assertThisInitialized(_this));
    _this.onLayerClick = _this.onLayerClick.bind(_assertThisInitialized(_this));
    _this.onViewportChanged = _this.onViewportChanged.bind(_assertThisInitialized(_this));
    _this.onResize = _this.onResize.bind(_assertThisInitialized(_this));
    return _this;
  }

  _createClass(ReactLeafletMap, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      // Hack for ugly 1px tile borders in Chrome
      // Version of Leaflet package in dependencies should match version used by react-leaflet
      var originalInitTile = _leaflet["default"].GridLayer.prototype._initTile;

      _leaflet["default"].GridLayer.include({
        _initTile: function _initTile(tile) {
          originalInitTile.call(this, tile);
          var tileSize = this.getTileSize();
          tile.style.width = tileSize.x + 1 + 'px';
          tile.style.height = tileSize.y + 1 + 'px';
        }
      });
    }
  }, {
    key: "getCRS",
    value: function getCRS(code) {
      switch (code) {
        case 'EPSG:4326':
          return _leaflet["default"].CRS.EPSG4326;

        case 'EPSG:5514':
          return new _proj4leaflet["default"].CRS('EPSG:5514', _constants["default"].projDefinitions.epsg5514, {
            resolutions: [102400, 51200, 25600, 12800, 6400, 3200, 1600, 800, 400, 200, 100, 50, 25, 12.5, 6.25, 3.125, 1.5625, 0.78125, 0.390625]
          });

        default:
          return _leaflet["default"].CRS.EPSG3857;
      }
    }
  }, {
    key: "setZoomLevelsBounds",
    value: function setZoomLevelsBounds(width, height) {
      var props = this.props;
      this.minZoom = _ptrCore.mapConstants.defaultLevelsRange[0];
      this.maxZoom = _ptrCore.mapConstants.defaultLevelsRange[1];

      if (props.viewLimits && props.viewLimits.boxRangeRange) {
        if (props.viewLimits.boxRangeRange[1]) {
          this.minZoom = _ptrUtils.map.view.getZoomLevelFromBoxRange(props.viewLimits.boxRangeRange[1], width, height);
        }

        if (props.viewLimits.boxRangeRange[0]) {
          this.maxZoom = _ptrUtils.map.view.getZoomLevelFromBoxRange(props.viewLimits.boxRangeRange[0], width, height);
        }
      }
    }
  }, {
    key: "onViewportChanged",
    value: function onViewportChanged(viewport) {
      if (viewport) {
        var change = {};

        if (viewport.center && (viewport.center[0] !== this.state.leafletView.center[0] || viewport.center[1] !== this.state.leafletView.center[1])) {
          var _this$props$viewLimit;

          change.center = _view["default"].getCenterWhichFitsLimits({
            lat: viewport.center[0],
            lon: viewport.center[1]
          }, (_this$props$viewLimit = this.props.viewLimits) === null || _this$props$viewLimit === void 0 ? void 0 : _this$props$viewLimit.center);
        }

        if (viewport.hasOwnProperty('zoom') && Number.isFinite(viewport.zoom) && viewport.zoom !== this.state.leafletView.zoom) {
          change.boxRange = _ptrUtils.map.view.getBoxRangeFromZoomLevel(viewport.zoom, this.state.width, this.state.height);
        }

        if (!(0, _lodash.isEmpty)(change) && !this.hasResized()) {
          var _this$props$viewLimit2;

          change = _ptrUtils.map.view.ensureViewIntegrity(change);

          if ((_this$props$viewLimit2 = this.props.viewLimits) !== null && _this$props$viewLimit2 !== void 0 && _this$props$viewLimit2.center) {
            /* Center coordinate values are compared by value. If the map view is changed from inside (by dragging) and the center gets out of the range, then the center coordinates are adjusted to those limits. However, if we move the map a bit again, these values will remain the same and the map component will not reredner. Therefore, it is necessary to make insignificant change in center coordinates values */
            change.center = {
              lat: change.center.lat + Math.random() / Math.pow(10, 13),
              lon: change.center.lon + Math.random() / Math.pow(10, 13)
            };
          }

          if (this.props.onViewChange) {
            this.props.onViewChange(change);
          } // just presentational map
          else {
              this.setState({
                view: _objectSpread(_objectSpread(_objectSpread({}, this.props.view), this.state.view), change)
              });
            }
        }
      }
    }
  }, {
    key: "hasResized",
    value: function hasResized() {
      var _this$leafletMap$_siz = this.leafletMap._size,
          x = _this$leafletMap$_siz.x,
          y = _this$leafletMap$_siz.y; // take into account only a significant change in size

      var widthChange = Math.abs(x - this.state.width) > 5;
      var heightChange = Math.abs(y - this.state.height) > 5;
      return widthChange || heightChange;
    }
  }, {
    key: "onResize",
    value: function onResize(width, height) {
      height = _viewport["default"].roundDimension(height);
      width = _viewport["default"].roundDimension(width);

      if (this.leafletMap) {
        this.leafletMap.invalidateSize();
      }

      if (!this.maxZoom && !this.minZoom) {
        this.setZoomLevelsBounds(width, height);
      }

      this.setState({
        width: width,
        height: height,
        leafletView: _viewHelpers["default"].getLeafletViewportFromViewParams(this.state.view || this.props.view, this.state.width, this.state.height)
      });

      if (this.props.onResize) {
        this.props.onResize(width, height);
      }
    }
  }, {
    key: "render",
    value: function render() {
      return /*#__PURE__*/_react["default"].createElement(_react["default"].Fragment, null, /*#__PURE__*/_react["default"].createElement(_reactResizeDetector["default"], {
        handleHeight: true,
        handleWidth: true,
        onResize: this.onResize,
        refreshMode: "debounce",
        refreshRate: 500
      }), this.state.width && this.state.height ? this.renderMap() : null);
    }
  }, {
    key: "renderMap",
    value: function renderMap() {
      var _this2 = this;

      var leafletView = _viewHelpers["default"].getLeafletViewportFromViewParams(this.state.view || this.props.view, this.state.width, this.state.height); // fix for backward compatibility


      var backgroundLayersSource = (0, _lodash.isArray)(this.props.backgroundLayer) ? this.props.backgroundLayer : [this.props.backgroundLayer];
      var backgroundLayersZindex = _constants["default"].defaultLeafletPaneZindex + 1;
      var backgroundLayers = backgroundLayersSource && backgroundLayersSource.map(function (layer, i) {
        return _this2.getLayerByType(layer, i, null, leafletView.zoom);
      });
      var baseLayersZindex = _constants["default"].defaultLeafletPaneZindex + 101;
      var layers = this.props.layers && this.props.layers.map(function (layer, i) {
        return /*#__PURE__*/_react["default"].createElement(_reactLeaflet.Pane, {
          key: layer.key || i,
          style: {
            zIndex: baseLayersZindex + i
          }
        }, _this2.getLayerByType(layer, i, baseLayersZindex + i, leafletView.zoom));
      }); //
      // Add debug grid layer on under all "layers" or at the top
      //

      if (this.props.debugTileGrid) {
        var _this$props$debugTile, _layers;

        var bottom = (_this$props$debugTile = this.props.debugTileGrid) === null || _this$props$debugTile === void 0 ? void 0 : _this$props$debugTile.bottom;
        var zIndex = bottom ? 0 : (((_layers = layers) === null || _layers === void 0 ? void 0 : _layers.length) || 0) + 1;

        var tileGridLayer = /*#__PURE__*/_react["default"].createElement(_reactLeaflet.Pane, {
          key: 'tilegrid',
          style: {
            zIndex: baseLayersZindex + zIndex - 1
          }
        }, this.getLayerByType({
          type: 'tile-grid',
          key: 'tilegrid',
          layerKey: 'tilegridlayerkey',
          options: {
            viewport: {
              width: this.state.width,
              height: this.state.height
            }
          }
        }, 0, baseLayersZindex + zIndex - 1, leafletView.zoom));

        if (bottom) {
          layers = layers ? [tileGridLayer].concat(_toConsumableArray(layers)) : [tileGridLayer];
        } else {
          layers = layers ? [].concat(_toConsumableArray(layers), [tileGridLayer]) : [tileGridLayer];
        }
      }

      return /*#__PURE__*/_react["default"].createElement(_reactLeaflet.Map, {
        id: this.props.mapKey,
        ref: function ref(map) {
          _this2.leafletMap = map && map.leafletElement;
        },
        className: "ptr-map ptr-leaflet-map",
        onViewportChanged: this.onViewportChanged,
        onClick: this.onClick,
        center: leafletView.center,
        zoom: leafletView.zoom,
        zoomControl: false,
        minZoom: this.minZoom // non-dynamic prop
        ,
        maxZoom: this.maxZoom // non-dynamic prop
        ,
        attributionControl: false,
        crs: this.state.crs,
        animate: false
      }, /*#__PURE__*/_react["default"].createElement(_reactLeaflet.Pane, {
        style: {
          zIndex: backgroundLayersZindex
        }
      }, backgroundLayers), layers, this.props.children);
    }
  }, {
    key: "getLayerByType",
    value: function getLayerByType(layer, i, zIndex, zoom) {
      if (layer && layer.type) {
        switch (layer.type) {
          case 'wmts':
            return this.getTileLayer(layer, i);

          case 'wms':
            return this.getWmsTileLayer(layer, i);

          case 'vector':
          case 'tiledVector':
          case 'tiled-vector':
          case 'diagram':
            return this.getVectorLayer(layer, i, zIndex, zoom);

          case 'tile-grid':
            return this.getTileGridLayer(layer, i, zIndex, zoom);

          default:
            return null;
        }
      } else {
        return null;
      }
    }
  }, {
    key: "getVectorLayer",
    value: function getVectorLayer(layer, i, zIndex, zoom) {
      return /*#__PURE__*/_react["default"].createElement(_VectorLayer["default"], {
        key: layer.key || i,
        layerKey: layer.layerKey || layer.key,
        uniqueLayerKey: layer.key || i,
        resources: this.props.resources,
        onClick: this.onLayerClick,
        opacity: layer.opacity || 1,
        options: layer.options,
        type: layer.type,
        view: this.state.view || this.props.view,
        width: this.state.width,
        height: this.state.height,
        crs: this.props.crs,
        zoom: zoom,
        zIndex: zIndex
      });
    }
  }, {
    key: "getTileGridLayer",
    value: function getTileGridLayer(layer, i, zIndex, zoom) {
      return /*#__PURE__*/_react["default"].createElement(_TileGridLayer["default"], {
        key: layer.key || i,
        layerKey: layer.layerKey || layer.key,
        uniqueLayerKey: layer.key || i,
        view: this.state.view || this.props.view,
        options: layer.options,
        zoom: zoom,
        zIndex: zIndex
      });
    }
  }, {
    key: "getTileLayer",
    value: function getTileLayer(layer, i) {
      var _layer$options = layer.options,
          url = _layer$options.url,
          restOptions = _objectWithoutProperties(_layer$options, ["url"]); // fix for backward compatibility


      if (layer.options.urls) {
        url = layer.options.urls[0];
      }

      return /*#__PURE__*/_react["default"].createElement(_reactLeaflet.TileLayer, _extends({
        key: layer.key || i,
        url: url
      }, restOptions));
    }
  }, {
    key: "getWmsTileLayer",
    value: function getWmsTileLayer(layer, i) {
      var o = layer.options;
      var layers = o.params && o.params.layers || '';
      var crs = o.params && o.params.crs && this.getCRS(o.params.crs) || null;
      var imageFormat = o.params && o.params.imageFormat || 'image/png';
      var reservedParamsKeys = ['layers', 'crs', 'imageFormat', 'pane', 'maxZoom', 'styles'];
      var restParameters = o.params && Object.entries(o.params).reduce(function (acc, _ref) {
        var _ref2 = _slicedToArray(_ref, 2),
            key = _ref2[0],
            value = _ref2[1];

        if (reservedParamsKeys.includes(key)) {
          return acc;
        } else {
          acc[key] = value;
          return acc;
        }
      }, {}) || {};
      return /*#__PURE__*/_react["default"].createElement(_WMSLayer["default"], {
        key: layer.key || i,
        url: o.url,
        crs: crs,
        singleTile: o.singleTile === true,
        params: _objectSpread({
          layers: layers,
          opacity: layer.opacity || 1,
          transparent: true,
          format: imageFormat
        }, restParameters)
      });
    }
  }, {
    key: "onLayerClick",
    value: function onLayerClick(layerKey, featureKeys) {
      if (this.props.onLayerClick) {
        this.props.onLayerClick(this.props.mapKey, layerKey, featureKeys);
      }
    }
  }, {
    key: "onClick",
    value: function onClick() {
      if (this.props.onClick) {
        this.props.onClick(this.props.view);
      }
    }
  }]);

  return ReactLeafletMap;
}(_react["default"].PureComponent);

ReactLeafletMap.propTypes = {
  backgroundLayer: _propTypes["default"].oneOfType([_propTypes["default"].object, _propTypes["default"].array]),
  name: _propTypes["default"].string,
  crs: _propTypes["default"].string,
  layers: _propTypes["default"].array,
  mapKey: _propTypes["default"].string.isRequired,
  onClick: _propTypes["default"].func,
  onLayerClick: _propTypes["default"].func,
  onViewChange: _propTypes["default"].func,
  resources: _propTypes["default"].object,
  view: _propTypes["default"].object,
  viewLimits: _propTypes["default"].object,
  debugTileGrid: _propTypes["default"].oneOfType([_propTypes["default"].bool, _propTypes["default"].shape({
    bottom: _propTypes["default"].bool
  })])
};
var _default = ReactLeafletMap;
exports["default"] = _default;