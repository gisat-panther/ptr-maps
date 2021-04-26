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

var _ptrAtoms = require("@gisatcz/ptr-atoms");

var _ptrCore = require("@gisatcz/ptr-core");

var _MapWrapper = _interopRequireDefault(require("./MapWrapper"));

require("./style.scss");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

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

var PresentationMap = /*#__PURE__*/function (_React$PureComponent) {
  _inherits(PresentationMap, _React$PureComponent);

  var _super = _createSuper(PresentationMap);

  function PresentationMap(props) {
    var _this;

    _classCallCheck(this, PresentationMap);

    _this = _super.call(this, props);
    _this.state = {
      width: null,
      height: null
    };

    if (!props.stateMapKey) {
      _this.state.view = _objectSpread(_objectSpread({}, _ptrCore.mapConstants.defaultMapView), props.view);
    }

    _this.onViewChange = _this.onViewChange.bind(_assertThisInitialized(_this));
    _this.onPropViewChange = _this.onPropViewChange.bind(_assertThisInitialized(_this));
    _this.resetHeading = _this.resetHeading.bind(_assertThisInitialized(_this));
    _this.onResize = _this.onResize.bind(_assertThisInitialized(_this));
    return _this;
  }

  _createClass(PresentationMap, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      if (this.props.onMount) {
        this.props.onMount(this.state.width, this.state.height);
      }
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate(prevProps) {
      var props = this.props;

      if (props.view) {
        var view = this.getValidView(props.view);

        if (prevProps && prevProps.view) {
          //todo simplify
          if (!(0, _lodash.isEqual)(props.view, prevProps.view)) {
            if (!this.props.stateMapKey) {
              this.saveViewChange(view, false);
            } else {
              this.onPropViewChange(view);
            }
          }
        } else {
          if (!this.props.stateMapKey) {
            this.saveViewChange(view, true);
          } else {
            this.onPropViewChange(view);
          }
        }
      }

      if (props.layers && props.layers !== prevProps.layers || props.backgroundLayer && props.backgroundLayer !== prevProps.backgroundLayer) {// this.props.refreshUse();
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
    key: "onViewChangeDecorator",
    value: function onViewChangeDecorator(onViewChange) {
      var _this2 = this;

      return function (update) {
        onViewChange(update, _this2.state.width, _this2.state.height);
      };
    }
  }, {
    key: "getValidView",
    value: function getValidView(update) {
      var view = _objectSpread(_objectSpread({}, _ptrCore.mapConstants.defaultMapView), view);

      if (this.state.view && !(0, _lodash.isEmpty)(this.state.view)) {
        view = _objectSpread(_objectSpread({}, this.state.view), update);
      }

      view = _ptrUtils.map.view.ensureViewIntegrity(view);
      return view;
    }
  }, {
    key: "saveViewChange",
    value: function saveViewChange(view, checkViewEquality) {
      if (checkViewEquality && !(0, _lodash.isEqual)(view, this.state.view)) {
        if (!this.props.stateMapKey) {
          this.setState({
            view: view
          });
        }
      }
    }
  }, {
    key: "onViewChange",
    value: function onViewChange(update) {
      var view = this.getValidView(update);
      this.saveViewChange(view, true);

      if (!(0, _lodash.isEqual)(view, this.state.view)) {
        if (this.props.onViewChange && !this.props.stateMapKey) {
          this.onViewChangeDecorator(this.props.onViewChange)(view);
        }
      }
    }
  }, {
    key: "onPropViewChange",
    value: function onPropViewChange(view) {
      if (this.props.stateMapKey && this.props.onPropViewChange) {
        this.onViewChangeDecorator(this.props.onPropViewChange)(view);
      }
    }
  }, {
    key: "resetHeading",
    value: function resetHeading() {
      var _this3 = this;

      _ptrUtils.map.resetHeading(this.state.view.heading, function (heading) {
        return _this3.setState({
          view: _objectSpread(_objectSpread({}, _this3.state.view), {}, {
            heading: heading
          })
        });
      });
    }
  }, {
    key: "onResize",
    value: function onResize(width, height) {
      if (this.props.onResize) {
        this.props.onResize(width, height);
      }

      this.setState({
        width: width,
        height: height
      });
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props = this.props,
          children = _this$props.children,
          mapComponent = _this$props.mapComponent,
          wrapper = _this$props.wrapper,
          wrapperProps = _this$props.wrapperProps,
          props = _objectWithoutProperties(_this$props, ["children", "mapComponent", "wrapper", "wrapperProps"]);

      if (!mapComponent) {
        return /*#__PURE__*/_react["default"].createElement(_ptrAtoms.Error, {
          centered: true
        }, "mapComponent not supplied to Map");
      } else {
        props.onResize = this.onResize;

        if (!props.stateMapKey) {
          props.view = this.state.view || props.view;
          props.onViewChange = this.onViewChange;
        }

        if (wrapper) {
          var wrapperComponent = this.props.wrapper.prototype && this.props.wrapper.prototype.isReactComponent || typeof this.props.wrapper === 'function' ? this.props.wrapper : _MapWrapper["default"];
          return /*#__PURE__*/_react["default"].createElement(wrapperComponent, _objectSpread(_objectSpread({}, props), wrapperProps), this.renderContent(mapComponent, props, children));
        } else {
          return this.renderContent(mapComponent, props, children);
        }
      }
    }
  }, {
    key: "renderContent",
    value: function renderContent(mapComponent, props, children) {
      var _this4 = this;

      var map = /*#__PURE__*/_react["default"].createElement(mapComponent, props);

      if (!children) {
        return map;
      } else {
        return /*#__PURE__*/_react["default"].createElement("div", {
          className: "ptr-map-controls-wrapper"
        }, map, _react["default"].Children.map(children, function (child) {
          var _this4$props$viewport, _this4$props$viewport2;

          return /*#__PURE__*/_react["default"].cloneElement(child, _objectSpread(_objectSpread({}, child.props), {}, {
            view: props.view,
            viewLimits: _this4.props.viewLimits,
            updateView: props.onViewChange,
            resetHeading: _this4.props.stateMapKey ? _this4.props.resetHeading : _this4.resetHeading,
            mapWidth: _this4.props.stateMapKey ? (_this4$props$viewport = _this4.props.viewport) === null || _this4$props$viewport === void 0 ? void 0 : _this4$props$viewport.width : _this4.state.width,
            mapHeight: _this4.props.stateMapKey ? (_this4$props$viewport2 = _this4.props.viewport) === null || _this4$props$viewport2 === void 0 ? void 0 : _this4$props$viewport2.height : _this4.state.height
          }));
        }));
      }
    }
  }]);

  return PresentationMap;
}(_react["default"].PureComponent);

PresentationMap.propTypes = {
  backgroundLayer: _propTypes["default"].oneOfType([_propTypes["default"].array, _propTypes["default"].object]),
  children: _propTypes["default"].element,
  layers: _propTypes["default"].array,
  mapComponent: _propTypes["default"].oneOfType([_propTypes["default"].element, _propTypes["default"].func]),
  onMount: _propTypes["default"].func,
  onPropViewChange: _propTypes["default"].func,
  onResize: _propTypes["default"].func,
  onViewChange: _propTypes["default"].func,
  resetHeading: _propTypes["default"].func,
  stateMapKey: _propTypes["default"].string,
  view: _propTypes["default"].object,
  viewport: _propTypes["default"].object,
  viewLimits: _propTypes["default"].object,
  wrapper: _propTypes["default"].oneOfType([_propTypes["default"].elementType, _propTypes["default"].element, _propTypes["default"].bool]),
  wrapperProps: _propTypes["default"].object
};
var _default = PresentationMap;
exports["default"] = _default;