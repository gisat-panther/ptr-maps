"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _reactLeaflet = require("react-leaflet");

var _shallowEqual = require("shallow-equal");

var _ptrUtils = require("@gisatcz/ptr-utils");

var _ContextWrapper = _interopRequireDefault(require("./ContextWrapper"));

var _helpers = _interopRequireDefault(require("../helpers"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

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

var Feature = /*#__PURE__*/function (_React$PureComponent) {
  _inherits(Feature, _React$PureComponent);

  var _super = _createSuper(Feature);

  function Feature(props) {
    var _this;

    _classCallCheck(this, Feature);

    _this = _super.call(this, props);
    _this.onClick = _this.onClick.bind(_assertThisInitialized(_this));
    _this.onMouseMove = _this.onMouseMove.bind(_assertThisInitialized(_this));
    _this.onMouseOut = _this.onMouseOut.bind(_assertThisInitialized(_this));
    _this.onAdd = _this.onAdd.bind(_assertThisInitialized(_this));
    _this.fid = props.fid;

    if (props.type === 'Point' && props.pointAsMarker) {
      _this.shapeId = _this.props.uniqueFeatureKey ? "".concat(_this.props.uniqueFeatureKey, "_icon") : _ptrUtils.utils.uuid();
    }

    _this.state = {
      hovered: false
    };
    _this.calculateStyles = _helpers["default"].calculateStylesMemo;
    _this.convertCoordinates = _helpers["default"].convertCoordinatesMemo;
    return _this;
  }

  _createClass(Feature, [{
    key: "componentDidUpdate",
    value: function componentDidUpdate(prevProps, prevState, snapshot) {
      if (this.props.hasOwnProperty('hoveredFromContext')) {
        if (this.props.hoveredFromContext && !this.state.hovered) {
          this.showOnTop();
          this.setState({
            hovered: true
          });
        } else if (!this.props.hoveredFromContext && this.state.hovered) {
          if (!this.props.selected) {
            this.showOnBottom();
          }

          this.setState({
            hovered: false
          });
        }
      }
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      if (this.props.changeContext) {
        this.props.changeContext(null);
      }
    }
  }, {
    key: "onAdd",
    value: function onAdd(event) {
      if (event.target) {
        this.leafletFeature = event.target;
      }
    }
  }, {
    key: "onClick",
    value: function onClick() {
      if (this.props.selectable) {
        this.showOnTop();

        if (this.props.onClick && this.props.fid) {
          this.props.onClick(this.props.fid);
        }
      }
    }
  }, {
    key: "onMouseMove",
    value: function onMouseMove(event) {
      if (this.props.hoverable) {
        this.showOnTop();

        if (this.fid && this.props.changeContext) {
          this.props.changeContext([this.fid], {
            popup: {
              x: event.originalEvent ? event.originalEvent.pageX : event.pageX,
              y: event.originalEvent ? event.originalEvent.pageY : event.pageY,
              fidColumnName: this.props.fidColumnName,
              data: this.props.feature.properties
            }
          });
        }

        if (!this.state.hovered) {
          this.setState({
            hovered: true
          });
        }
      }
    }
  }, {
    key: "onMouseOut",
    value: function onMouseOut() {
      if (this.props.hoverable) {
        if (!this.props.selected) {
          this.showOnBottom();
        }

        if (this.props.changeContext) {
          this.props.changeContext(null);
        }

        this.setState({
          hovered: false
        });
      }
    }
    /**
     * Show feature on the top of others, if it's not a point
     */

  }, {
    key: "showOnTop",
    value: function showOnTop() {
      if (this.leafletFeature && this.props.type !== 'Point') {
        this.leafletFeature.bringToFront();
      }
    }
    /**
     * Show feature in the bottom, if it's a polygon
     */

  }, {
    key: "showOnBottom",
    value: function showOnBottom() {
      if (this.leafletFeature && (this.props.type === 'Polygon' || this.props.type === 'MultiPolygon')) {
        this.leafletFeature.bringToBack();
      }
    }
  }, {
    key: "render",
    value: function render() {
      var props = this.props;
      var coordinates = this.convertCoordinates(props.feature);
      var styles = this.calculateStyles(props.feature, props.styleDefinition, props.hoveredStyleDefinition, props.selected, props.selectedStyleDefinition, props.selectedHoveredStyleDefinition);
      var style = styles["default"];

      if (props.selected && this.state.hovered && styles.selectedHovered) {
        style = styles.selectedHovered;
      } else if (this.state.hovered && styles.hovered) {
        style = styles.hovered;
      } else if (props.selected && styles.selected) {
        style = styles.selected;
      } // TODO add support for other geometry types


      switch (this.props.type) {
        case 'Polygon':
        case 'MultiPolygon':
          return this.renderPolygon(coordinates, style);

        case 'Point':
        case 'MultiPoint':
          return this.renderPoint(coordinates, style);

        case 'LineString':
        case 'MultiLineString':
          return this.renderLine(coordinates, style);

        default:
          return null;
      }
    }
  }, {
    key: "renderPolygon",
    value: function renderPolygon(coordinates, style) {
      return /*#__PURE__*/_react["default"].createElement(_reactLeaflet.Polygon, _extends({
        interactive: this.props.hoverable || this.props.selectable,
        onAdd: this.onAdd,
        onClick: this.onClick,
        onMouseMove: this.onMouseMove,
        onMouseOut: this.onMouseOut,
        positions: coordinates
      }, style));
    }
  }, {
    key: "renderLine",
    value: function renderLine(coordinates, style) {
      return /*#__PURE__*/_react["default"].createElement(_reactLeaflet.Polyline, _extends({
        interactive: this.props.hoverable || this.props.selectable,
        onAdd: this.onAdd,
        onClick: this.onClick,
        onMouseOver: this.onMouseMove,
        onMouseMove: this.onMouseMove,
        onMouseOut: this.onMouseOut,
        positions: coordinates
      }, style));
    }
  }, {
    key: "renderPoint",
    value: function renderPoint(coordinates, style) {
      if (this.props.pointAsMarker) {
        return this.renderShape(coordinates, style);
      } else {
        return /*#__PURE__*/_react["default"].createElement(_reactLeaflet.Circle, _extends({
          interactive: this.props.hoverable || this.props.selectable,
          onAdd: this.onAdd,
          onClick: this.onClick,
          onMouseMove: this.onMouseMove,
          onMouseOver: this.onMouseMove,
          onMouseOut: this.onMouseOut,
          center: coordinates
        }, style));
      }
    }
  }, {
    key: "renderShape",
    value: function renderShape(coordinates, style) {
      if (!this.shape) {
        this.shape = _helpers["default"].getMarkerShape(this.shapeId, style, {
          icons: this.props.icons,
          onMouseMove: this.onMouseMove,
          onMouseOver: this.onMouseMove,
          onMouseOut: this.onMouseOut,
          onClick: this.onClick
        });
      }

      if (!(0, _shallowEqual.shallowEqualObjects)(this.style, style)) {
        this.style = style;
        this.shape.setStyle(style, this.shapeId, this.shape.basicShape);
      }

      return /*#__PURE__*/_react["default"].createElement(_reactLeaflet.Marker, {
        interactive: this.props.hoverable || this.props.selectable,
        position: coordinates,
        icon: this.shape,
        onAdd: this.onAdd
      });
    }
  }]);

  return Feature;
}(_react["default"].PureComponent);

Feature.propTypes = {
  feature: _propTypes["default"].object,
  fid: _propTypes["default"].oneOfType([_propTypes["default"].string, _propTypes["default"].number]),
  fidColumnName: _propTypes["default"].string,
  hoverable: _propTypes["default"].bool,
  hoveredFromContext: _propTypes["default"].bool,
  hoveredStyleDefinition: _propTypes["default"].oneOfType([_propTypes["default"].string, _propTypes["default"].object]),
  selectable: _propTypes["default"].bool,
  selected: _propTypes["default"].bool,
  selectedStyleDefinition: _propTypes["default"].oneOfType([_propTypes["default"].string, _propTypes["default"].object]),
  selectedHoveredStyleDefinition: _propTypes["default"].oneOfType([_propTypes["default"].string, _propTypes["default"].object]),
  changeContext: _propTypes["default"].func,
  interactive: _propTypes["default"].bool,
  styleDefinition: _propTypes["default"].object
};

var _default = (0, _ContextWrapper["default"])(Feature);

exports["default"] = _default;