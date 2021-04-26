"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _lodash = require("lodash");

var _ptrUtils = require("@gisatcz/ptr-utils");

var _webworldwindEsa = _interopRequireDefault(require("webworldwind-esa"));

var _WorldWindowControllerDecorator = _interopRequireDefault(require("./controllers/WorldWindowControllerDecorator"));

var _helpers = _interopRequireDefault(require("./layers/helpers"));

var _helpers2 = _interopRequireDefault(require("./navigator/helpers"));

require("./style.scss");

var _LargeDataLayer = _interopRequireDefault(require("./layers/LargeDataLayerSource/LargeDataLayer"));

var _VectorLayer = _interopRequireDefault(require("./layers/VectorLayer"));

var _ptrCore = require("@gisatcz/ptr-core");

var _crossPackageReactContext = _interopRequireDefault(require("@gisatcz/cross-package-react-context"));

var _reactResizeDetector = _interopRequireDefault(require("react-resize-detector"));

var _viewport = _interopRequireDefault(require("../utils/viewport"));

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

var HoverContext = _crossPackageReactContext["default"].getContext('HoverContext');

var WorldWindow = _webworldwindEsa["default"].WorldWindow,
    ElevationModel = _webworldwindEsa["default"].ElevationModel;

var WorldWindMap = /*#__PURE__*/function (_React$PureComponent) {
  _inherits(WorldWindMap, _React$PureComponent);

  var _super = _createSuper(WorldWindMap);

  function WorldWindMap(props) {
    var _this;

    _classCallCheck(this, WorldWindMap);

    _this = _super.call(this, props);
    _this.canvasId = _ptrUtils.utils.uuid();
    _this.state = {
      width: null,
      height: null
    };
    _this.onClick = _this.onClick.bind(_assertThisInitialized(_this));
    _this.onLayerHover = _this.onLayerHover.bind(_assertThisInitialized(_this));
    _this.onWorldWindHover = _this.onWorldWindHover.bind(_assertThisInitialized(_this));
    _this.onLayerClick = _this.onLayerClick.bind(_assertThisInitialized(_this));
    _this.onMouseOut = _this.onMouseOut.bind(_assertThisInitialized(_this));
    _this.onResize = _this.onResize.bind(_assertThisInitialized(_this));
    _this.onZoomLevelsBased = _this.onZoomLevelsBased.bind(_assertThisInitialized(_this));
    _this.onZoomLevelsBasedTimeout = null;
    _this.onZoomLevelsBasedStep = 0;
    return _this;
  }

  _createClass(WorldWindMap, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      this.wwd = new WorldWindow(this.canvasId, this.getElevationModel());
      (0, _WorldWindowControllerDecorator["default"])(this.wwd.worldWindowController, this.props.viewLimits, this.props.levelsBased);
      this.wwd.worldWindowController.onNavigatorChanged = this.onNavigatorChange.bind(this);

      if (this.props.levelsBased) {
        // rewrite default wheel listener.
        this.wwd.eventListeners.wheel.listeners = [this.onZoomLevelsBased.bind(this)];
      }

      new _ptrUtils.CyclicPickController(this.wwd, ['mousemove', 'mousedown', 'mouseup', 'mouseout', 'touchstart', 'touchmove', 'touchend'], this.onWorldWindHover, true);
      this.updateNavigator(_ptrCore.mapConstants.defaultMapView);
      this.updateLayers();
    }
  }, {
    key: "onZoomLevelsBased",
    value: function onZoomLevelsBased(e) {
      var _this2 = this;

      e.preventDefault();

      if (e.wheelDelta) {
        this.onZoomLevelsBasedStep += e.wheelDelta;

        if (this.onZoomLevelsBasedTimeout) {
          clearTimeout(this.onZoomLevelsBasedTimeout);
        }

        this.onZoomLevelsBasedTimeout = setTimeout(function () {
          var zoomLevel = _ptrUtils.map.view.getZoomLevelFromBoxRange(_this2.props.view.boxRange, _this2.state.width, _this2.state.height);

          if (_this2.onZoomLevelsBasedStep > 300) {
            zoomLevel += 3;
          } else if (_this2.onZoomLevelsBasedStep > 150) {
            zoomLevel += 2;
          } else if (_this2.onZoomLevelsBasedStep > 0) {
            zoomLevel++;
          } else if (_this2.onZoomLevelsBasedStep < -300) {
            zoomLevel -= 3;
          } else if (_this2.onZoomLevelsBasedStep < -150) {
            zoomLevel -= 2;
          } else {
            zoomLevel--;
          }

          var levelsRange = _ptrCore.mapConstants.defaultLevelsRange;
          var boxRangeRange = _this2.props.viewLimits && _this2.props.viewLimits.boxRangeRange;
          var maxLevel = boxRangeRange && boxRangeRange[0] ? _ptrUtils.map.view.getZoomLevelFromBoxRange(boxRangeRange[0], _this2.state.width, _this2.state.height) : levelsRange[1];
          var minLevel = boxRangeRange && boxRangeRange[1] ? _ptrUtils.map.view.getZoomLevelFromBoxRange(boxRangeRange[1], _this2.state.width, _this2.state.height) : levelsRange[0];
          levelsRange = [minLevel, maxLevel];
          var finalZoomLevel = zoomLevel;

          if (finalZoomLevel > levelsRange[1]) {
            finalZoomLevel = levelsRange[1];
          } else if (finalZoomLevel < levelsRange[0]) {
            finalZoomLevel = levelsRange[0];
          }

          var boxRange = _ptrUtils.map.view.getBoxRangeFromZoomLevel(finalZoomLevel, _this2.state.width, _this2.state.height);

          if (_this2.props.onViewChange) {
            _this2.props.onViewChange({
              boxRange: boxRange
            });
          }

          _this2.onZoomLevelsBasedTimeout = null;
          _this2.onZoomLevelsBasedStep = 0;
        }, 50);
      }
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate(prevProps) {
      if (prevProps) {
        if (this.props.view && prevProps.view !== this.props.view) {
          this.updateNavigator();
        }

        if (prevProps.layers !== this.props.layers || prevProps.backgroundLayer !== this.props.backgroundLayer) {
          this.updateLayers();
        }

        if (this.context && this.context.hoveredItems) {
          var currentHoveredItemsString = JSON.stringify((0, _lodash.sortBy)(this.context.hoveredItems));

          if (currentHoveredItemsString !== this.previousHoveredItemsString) {
            this.updateHoveredFeatures();
          }
        }
      }
    }
  }, {
    key: "updateLayers",
    value: function updateLayers() {
      var _this3 = this;

      var layers = [];

      if (this.props.backgroundLayer) {
        // TODO fix for compatibility
        var backgroundLayers = (0, _lodash.isArray)(this.props.backgroundLayer) ? this.props.backgroundLayer : [this.props.backgroundLayer];
        backgroundLayers.forEach(function (layer) {
          layers.push(_helpers["default"].getLayerByType(layer, _this3.wwd));
        });
      }

      if (this.props.layers) {
        this.props.layers.forEach(function (layer) {
          var mapLayer = _helpers["default"].getLayerByType(layer, _this3.wwd, _this3.onLayerHover, _this3.onLayerClick, _this3.props.pointAsMarker);

          layers.push(mapLayer);
        });
      }

      this.invalidateLayers(this.wwd.layers);
      this.wwd.layers = layers;
      this.wwd.redraw();
    }
  }, {
    key: "invalidateLayers",
    value: function invalidateLayers(previousLayers) {
      previousLayers.forEach(function (prevLayer) {
        if (prevLayer instanceof _LargeDataLayer["default"]) {
          prevLayer.removeListeners();
        }
      });
    }
  }, {
    key: "updateHoveredFeatures",
    value: function updateHoveredFeatures() {
      var _this4 = this;

      this.wwd.layers.forEach(function (layer) {
        if (layer instanceof _LargeDataLayer["default"]) {
          layer.updateHoveredKeys(_this4.context.hoveredItems, _this4.context.x, _this4.context.y);
        } else if (layer instanceof _VectorLayer["default"]) {
          layer.updateHoveredFeatures(_this4.context.hoveredItems);
        }
      });
      this.wwd.redraw();
      this.previousHoveredItemsString = JSON.stringify((0, _lodash.sortBy)(this.context.hoveredItems));
    }
  }, {
    key: "updateNavigator",
    value: function updateNavigator(defaultView) {
      var viewport = this.wwd.viewport;
      var width = this.state.width || viewport.width;
      var height = this.state.height || viewport.height;

      var currentView = defaultView || _helpers2["default"].getViewParamsFromWorldWindNavigator(this.wwd.navigator, width, height);

      var nextView = _objectSpread(_objectSpread({}, currentView), this.props.view);

      _helpers2["default"].update(this.wwd, nextView, width, height);
    }
    /**
     * @returns {null | elevation}
     */

  }, {
    key: "getElevationModel",
    value: function getElevationModel() {
      switch (this.props.elevationModel) {
        case 'default':
          return null;

        case null:
          var elevation = new ElevationModel();
          elevation.removeAllCoverages();
          return elevation;
      }
    }
  }, {
    key: "onNavigatorChange",
    value: function onNavigatorChange(event) {
      var _this5 = this;

      if (event) {
        var viewParams = _helpers2["default"].getViewParamsFromWorldWindNavigator(event, this.state.width, this.state.height);

        var changedViewParams = _helpers2["default"].getChangedViewParams(_objectSpread(_objectSpread({}, _ptrCore.mapConstants.defaultMapView), this.props.view), viewParams);

        if (this.props.onViewChange) {
          if (!(0, _lodash.isEmpty)(changedViewParams)) {
            if (this.props.delayedWorldWindNavigatorSync) {
              if (this.changedNavigatorTimeout) {
                clearTimeout(this.changedNavigatorTimeout);
              }

              this.changedNavigatorTimeout = setTimeout(function () {
                _this5.props.onViewChange(changedViewParams);
              }, this.props.delayedWorldWindNavigatorSync);
            } else {
              this.props.onViewChange(changedViewParams);
            }
          }
        }
      }
    }
  }, {
    key: "onClick",
    value: function onClick() {
      if (this.props.onClick) {
        var _this$wwd$viewport = this.wwd.viewport,
            width = _this$wwd$viewport.width,
            height = _this$wwd$viewport.height;

        var currentView = _helpers2["default"].getViewParamsFromWorldWindNavigator(this.wwd.navigator, width, height);

        this.props.onClick(currentView);
      }
    }
  }, {
    key: "onMouseOut",
    value: function onMouseOut() {
      if (this.context && this.context.onHoverOut) {
        this.context.onHoverOut();
      }
    }
  }, {
    key: "onLayerHover",
    value: function onLayerHover(layerKey, featureKeys, x, y, popupContent, data, fidColumnName) {
      // pass data to popup
      if (this.context && this.context.onHover && featureKeys.length) {
        this.context.onHover(featureKeys, {
          popup: {
            x: x,
            y: y,
            content: popupContent,
            data: data,
            fidColumnName: fidColumnName
          }
        });
      }
    }
  }, {
    key: "onLayerClick",
    value: function onLayerClick(layerKey, featureKeys) {
      if (this.props.onLayerClick) {
        this.props.onLayerClick(this.props.mapKey, layerKey, featureKeys);
      }
    }
  }, {
    key: "onWorldWindHover",
    value: function onWorldWindHover(renderables, event) {
      // TODO can be hovered more than one renderable at one time?
      if (renderables.length && renderables.length === 1) {
        // TODO is this enough?
        var layerPantherProps = renderables[0].parentLayer.pantherProps;
        var data = renderables[0].userObject.userProperties;
        var featureKeys = [data[layerPantherProps.fidColumnName]]; // TODO add support for touch events

        if (event.type === 'mousedown' && layerPantherProps.selectable) {
          this.onLayerClick(layerPantherProps.layerKey, featureKeys);
        } else if (layerPantherProps.hoverable) {
          this.onLayerHover(layerPantherProps.layerKey, featureKeys, event.pageX, event.pageY, /*#__PURE__*/_react["default"].createElement("div", null, featureKeys.join(',')), data, layerPantherProps.fidColumnName);
        }
      } else if (this.context && this.context.onHoverOut) {
        this.context.onHoverOut();
      }
    }
  }, {
    key: "onResize",
    value: function onResize(width, height) {
      height = _viewport["default"].roundDimension(height);
      width = _viewport["default"].roundDimension(width);
      this.setState({
        width: width,
        height: height
      });
      this.updateNavigator();

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
        onResize: this.onResize
      }), /*#__PURE__*/_react["default"].createElement("div", {
        className: "ptr-map ptr-world-wind-map",
        onClick: this.onClick,
        onMouseOut: this.onMouseOut
      }, /*#__PURE__*/_react["default"].createElement("canvas", {
        className: "ptr-world-wind-map-canvas",
        id: this.canvasId
      }, "Your browser does not support HTML5 Canvas.")));
    }
  }]);

  return WorldWindMap;
}(_react["default"].PureComponent);

WorldWindMap.contextType = HoverContext;
WorldWindMap.defaultProps = {
  elevationModel: null
};
WorldWindMap.propTypes = {
  backgroundLayer: _propTypes["default"].oneOfType([_propTypes["default"].object, _propTypes["default"].array]),
  layers: _propTypes["default"].array,
  name: _propTypes["default"].string,
  view: _propTypes["default"].object,
  viewLimits: _propTypes["default"].object,
  onClick: _propTypes["default"].func,
  onLayerClick: _propTypes["default"].func,
  onViewChange: _propTypes["default"].func,
  elevationModel: _propTypes["default"].string
};
var _default = WorldWindMap;
exports["default"] = _default;