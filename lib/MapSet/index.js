"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.MapSetPresentationMap = exports.MapSetMap = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _lodash = require("lodash");

var _ptrUtils = require("@gisatcz/ptr-utils");

var _ptrCore = require("@gisatcz/ptr-core");

var _MapGrid = _interopRequireDefault(require("../MapGrid"));

require("./style.scss");

var _MapWrapper = _interopRequireDefault(require("../MapWrapper"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

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

var Map = /*#__PURE__*/function (_React$PureComponent) {
  _inherits(Map, _React$PureComponent);

  var _super = _createSuper(Map);

  function Map() {
    _classCallCheck(this, Map);

    return _super.apply(this, arguments);
  }

  _createClass(Map, [{
    key: "render",
    value: function render() {
      return null;
    }
  }]);

  return Map;
}(_react["default"].PureComponent);

var PresentationMap = /*#__PURE__*/function (_React$PureComponent2) {
  _inherits(PresentationMap, _React$PureComponent2);

  var _super2 = _createSuper(PresentationMap);

  function PresentationMap() {
    _classCallCheck(this, PresentationMap);

    return _super2.apply(this, arguments);
  }

  _createClass(PresentationMap, [{
    key: "render",
    value: function render() {
      return null;
    }
  }]);

  return PresentationMap;
}(_react["default"].PureComponent);

var MapSet = /*#__PURE__*/function (_React$PureComponent3) {
  _inherits(MapSet, _React$PureComponent3);

  var _super3 = _createSuper(MapSet);

  function MapSet(props) {
    var _this;

    _classCallCheck(this, MapSet);

    _this = _super3.call(this, props);

    if (!props.stateMapSetKey) {
      _this.state = {
        view: _ptrUtils.map.view.mergeViews(_ptrCore.mapConstants.defaultMapView, props.view),
        activeMapKey: props.activeMapKey,
        mapViews: {},
        mapsDimensions: {}
      };
      (0, _lodash.forEach)(_this.props.children, function (child) {
        if (child && _typeof(child) === 'object' && (child.type === Map || child.type === _this.props.connectedMapComponent || child.type === PresentationMap) && child.props.mapKey === props.activeMapKey) {
          _this.state.mapViews[child.props.mapKey] = _ptrUtils.map.view.mergeViews(_ptrCore.mapConstants.defaultMapView, props.view, child.props.view);
        }
      });
    } else {
      _this.state = {
        mapsDimensions: {}
      };
    }

    return _this;
  }

  _createClass(MapSet, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      if (this.props.onMount) {
        this.props.onMount();
      }
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      if (this.props.onUnmount) {
        this.props.onUnmount();
      }
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate(prevProps, prevState, snapshot) {
      var props = this.props;

      if (!props.stateMapSetKey) {
        if (prevProps.view !== props.view) {
          var mapViews = (0, _lodash.mapValues)(this.state.mapViews, function (view) {
            return _objectSpread(_objectSpread({}, view), props.view);
          });
          this.setState({
            // TODO sync props to view only?
            view: _objectSpread(_objectSpread({}, this.state.view), props.view),
            mapViews: mapViews
          });
        }

        if (props.layers && props.layers !== prevProps.layers || props.backgroundLayer && props.backgroundLayer !== prevProps.backgroundLayer) {
          if (props.refreshUse) {// props.refreshUse();
          }
        }
      }
    }
  }, {
    key: "onViewChange",
    value: function onViewChange(mapKey, update) {
      var _this2 = this;

      var syncUpdate;
      update = _ptrUtils.map.view.ensureViewIntegrity(update);
      mapKey = mapKey || this.state.activeMapKey;

      if (this.props.sync) {
        syncUpdate = (0, _lodash.pickBy)(update, function (updateVal, updateKey) {
          return _this2.props.sync[updateKey];
        });
        syncUpdate = _ptrUtils.map.view.ensureViewIntegrity(syncUpdate);
      } // merge views of all maps


      var mapViews = (0, _lodash.mapValues)(this.state.mapViews, function (view) {
        return _ptrUtils.map.view.mergeViews(view, syncUpdate);
      }); // merge views of given map

      mapViews[mapKey] = _ptrUtils.map.view.mergeViews(this.state.mapViews[mapKey], update);

      if (syncUpdate && !(0, _lodash.isEmpty)(syncUpdate)) {
        var mergedView = _ptrUtils.map.view.mergeViews(this.state.view, syncUpdate);

        this.setState({
          view: mergedView,
          mapViews: mapViews
        });

        if (this.props.onViewChange) {
          this.props.onViewChange(mergedView);
        }
      } else {
        this.setState({
          mapViews: mapViews
        });
      }
    }
  }, {
    key: "onResetHeading",
    value: function onResetHeading() {
      var _this3 = this;

      _ptrUtils.map.resetHeading(this.state.mapViews[this.state.activeMapKey].heading, function (heading) {
        return _this3.onViewChange(_this3.state.activeMapKey, {
          heading: heading
        });
      });
    }
    /**
     * Called in uncontrolled map set
     * @param key
     * @param view
     */

  }, {
    key: "onMapClick",
    value: function onMapClick(key, view) {
      if (this.state.mapViews[key]) {
        this.setState({
          activeMapKey: key
        });
      } else {
        var mapViews = _objectSpread({}, this.state.mapViews);

        mapViews[key] = view;
        this.setState({
          activeMapKey: key,
          mapViews: mapViews
        });
      }
    }
  }, {
    key: "onMapResize",
    value: function onMapResize(mapKey, width, height) {
      var mapsDimensions = _objectSpread(_objectSpread({}, this.state.mapsDimensions), {}, _defineProperty({}, mapKey, {
        width: width,
        height: height
      }));

      this.setState({
        mapsDimensions: mapsDimensions
      });
    }
  }, {
    key: "render",
    value: function render() {
      return /*#__PURE__*/_react["default"].createElement("div", {
        className: "ptr-map-set"
      }, /*#__PURE__*/_react["default"].createElement("div", {
        className: "ptr-map-set-maps"
      }, this.renderMaps()), /*#__PURE__*/_react["default"].createElement("div", {
        className: "ptr-map-set-controls"
      }, this.renderControls()));
    }
  }, {
    key: "renderControls",
    value: function renderControls() {
      var updateView, resetHeading, view, mapKey, activeMapDimensions;

      if (this.props.stateMapSetKey) {
        updateView = this.props.updateView;
        resetHeading = this.props.resetHeading;
        view = this.props.activeMapView || this.props.view;
        mapKey = this.props.activeMapKey;
        activeMapDimensions = this.props.activeMapViewport;
      } else {
        updateView = this.onViewChange.bind(this, null);
        resetHeading = this.onResetHeading.bind(this);
        view = _ptrUtils.map.view.mergeViews(this.state.view, this.state.mapViews[this.state.activeMapKey]);
        mapKey = this.state.activeMapKey;
        activeMapDimensions = this.state.mapsDimensions && this.state.mapsDimensions[this.state.activeMapKey];
      }

      return _react["default"].Children.map(this.props.children, function (child) {
        if (!(_typeof(child) === 'object' && child.type === Map)) {
          return /*#__PURE__*/_react["default"].cloneElement(child, _objectSpread(_objectSpread({}, child.props), {}, {
            view: view,
            updateView: updateView,
            resetHeading: resetHeading,
            mapKey: mapKey,
            mapWidth: activeMapDimensions && activeMapDimensions.width,
            mapHeight: activeMapDimensions && activeMapDimensions.height
          }));
        }
      });
    }
  }, {
    key: "renderMaps",
    value: function renderMaps() {
      var _this4 = this;

      var maps = []; // For now, render either maps from state, OR from children

      if (this.props.stateMapSetKey) {
        // all from state
        if (this.props.maps && this.props.maps.length) {
          this.props.maps.map(function (mapKey) {
            var props = {
              key: mapKey,
              stateMapKey: mapKey,
              onResize: _this4.onMapResize.bind(_this4, mapKey)
            };
            maps.push(_this4.renderMap(_this4.props.connectedMapComponent, _objectSpread(_objectSpread({}, props), {}, {
              mapComponent: _this4.props.mapComponent
            }), null, mapKey === _this4.props.activeMapKey));
          });
        }
      } else {
        _react["default"].Children.map(this.props.children, function (child, index) {
          var _child$props = child.props,
              view = _child$props.view,
              layers = _child$props.layers,
              backgroundLayer = _child$props.backgroundLayer,
              mapKey = _child$props.mapKey,
              restProps = _objectWithoutProperties(_child$props, ["view", "layers", "backgroundLayer", "mapKey"]);

          var props = _objectSpread(_objectSpread({}, restProps), {}, {
            key: index,
            view: _ptrUtils.map.view.mergeViews(_this4.state.view, view, _this4.state.mapViews[mapKey]),
            backgroundLayer: backgroundLayer || _this4.props.backgroundLayer,
            layers: _ptrUtils.map.mergeLayers(_this4.props.layers, layers),
            onViewChange: _this4.onViewChange.bind(_this4, mapKey),
            onClick: _this4.onMapClick.bind(_this4, mapKey),
            onResize: _this4.onMapResize.bind(_this4, mapKey),
            mapKey: mapKey
          });

          if (_typeof(child) === 'object' && (child.type === Map || child.type === _this4.props.connectedMapComponent)) {
            // layers from state
            maps.push(_this4.renderMap(_this4.props.connectedMapComponent, _objectSpread(_objectSpread({}, props), {}, {
              mapComponent: _this4.props.mapComponent
            }), null, mapKey === _this4.state.activeMapKey));
          } else if (_typeof(child) === 'object' && child.type === PresentationMap) {
            // all presentational
            maps.push(_this4.renderMap(_this4.props.mapComponent || child.props.mapComponent, props, child.props.children, mapKey === _this4.state.activeMapKey, true));
          }
        });
      }

      return /*#__PURE__*/_react["default"].createElement(_MapGrid["default"], null, maps);
    }
  }, {
    key: "renderMap",
    value: function renderMap(mapComponent, props, children, active, renderWrapper) {
      // TODO custom wrapper component
      if (this.props.wrapper) {
        var wrapperProps = this.props.wrapperProps;

        if (this.props.onMapRemove && !this.props.disableMapRemoval) {
          wrapperProps = _objectSpread(_objectSpread({}, this.props.wrapperProps), {}, {
            onMapRemove: this.props.onMapRemove
          });
        }

        var allProps = _objectSpread(_objectSpread(_objectSpread({}, props), wrapperProps), {}, {
          wrapper: this.props.wrapper,
          active: active
        }); // Render wrapper here, if mapComponent is final (framework-specific) map component


        if (renderWrapper) {
          var wrapperComponent = this.props.wrapper.prototype && this.props.wrapper.prototype.isReactComponent || typeof this.props.wrapper === 'function' ? this.props.wrapper : _MapWrapper["default"];
          return /*#__PURE__*/_react["default"].createElement(wrapperComponent, allProps, /*#__PURE__*/_react["default"].createElement(mapComponent, props, children));
        } else {
          return /*#__PURE__*/_react["default"].createElement(mapComponent, allProps, children);
        }
      } else {
        return /*#__PURE__*/_react["default"].createElement(mapComponent, props, children);
      }
    }
  }]);

  return MapSet;
}(_react["default"].PureComponent);

MapSet.defaultProps = {
  disableMapRemoval: false
};
MapSet.propTypes = {
  activeMapKey: _propTypes["default"].string,
  activeMapView: _propTypes["default"].object,
  activeMapViewport: _propTypes["default"].object,
  disableMapRemoval: _propTypes["default"].bool,
  mapSetKey: _propTypes["default"].string,
  maps: _propTypes["default"].array,
  mapComponent: _propTypes["default"].func,
  view: _propTypes["default"].object,
  stateMapSetKey: _propTypes["default"].string,
  sync: _propTypes["default"].object,
  wrapper: _propTypes["default"].oneOfType([_propTypes["default"].elementType, _propTypes["default"].element, _propTypes["default"].bool]),
  wrapperProps: _propTypes["default"].object
};
var MapSetMap = Map;
exports.MapSetMap = MapSetMap;
var MapSetPresentationMap = PresentationMap;
exports.MapSetPresentationMap = MapSetPresentationMap;
var _default = MapSet;
exports["default"] = _default;