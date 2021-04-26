"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _leaflet = _interopRequireDefault(require("leaflet"));

var _lodash = require("lodash");

var _server = _interopRequireDefault(require("react-dom/server"));

var _react = _interopRequireDefault(require("react"));

var _helpers = _interopRequireDefault(require("../helpers"));

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

/**
 * It enables to draw various shapes as marker icon.
 * @augments L.DivIcon
 * @param props {object}
 * @param props.basicShape {bool} If true -> DIV element, if false -> SVG element
 * @param props.icon {Object} Icon definition
 * @param props.icon.component {React.Component}
 * @param props.icon.componentProps {React.Object} Additional icon component props
 * @param props.id {string}
 * @param props.iconAnchor {string} https://leafletjs.com/reference-1.7.1.html#icon-iconanchor
 * @param props.onClick {function} onclick callback
 * @param props.onMouseMove {function} mousemove callback
 * @param props.onMouseOver {function} mouseover callback
 * @param props.onMouseOut {function} mouseout callback
 * @param props.shape {Object} Shape definition
 * @param props.shape.component {React.Component}
 * @param props.shape.componentProps {React.Object} Additional shape component props
 * @param props.style {string} Extended Leaflet style (see getSvgStyle method for details)
 */
var MarkerShape = /*#__PURE__*/function (_L$DivIcon) {
  _inherits(MarkerShape, _L$DivIcon);

  var _super = _createSuper(MarkerShape);

  function MarkerShape(props) {
    var _this;

    _classCallCheck(this, MarkerShape);

    _this = _super.call(this, props); // Needed by L.DivIcon

    _this.iconAnchor = props.iconAnchor;
    _this.basicShape = props.basicShape;
    _this.id = props.id;
    _this.style = props.style;
    _this.shape = props.shape;
    _this.icon = props.icon;
    _this.onMouseMove = props.onMouseMove;
    _this.onMouseOver = props.onMouseOver;
    _this.onMouseOut = props.onMouseOut;
    _this.onClick = props.onClick;
    return _this;
  }
  /**
   * Overwrite ancestor's method
   * @param oldShape
   * @return {HTMLDivElement}
   */


  _createClass(MarkerShape, [{
    key: "createIcon",
    value: function createIcon(oldShape) {
      var div;

      if (oldShape && oldShape.tagName === 'DIV') {
        div = oldShape;
      } else {
        div = document.createElement('div');
        div.id = this.id;

        if (this.onMouseMove) {
          div.addEventListener('mousemove', this.onMouseMove);
        }

        if (this.onMouseOver) {
          div.addEventListener('mouseover', this.onMouseOver);
        }

        if (this.onMouseOut) {
          div.addEventListener('mouseout', this.onMouseOut);
        }

        if (this.onClick) {
          div.addEventListener('click', this.onClick);
        }
      }

      var html = this.getShapeHtml();

      if (html instanceof Element) {
        div.appendChild(html);
      } else {
        div.innerHTML = html !== false ? html : '';
      }

      this._setIconStyles(div, 'icon');

      return div;
    }
    /**
     * Prepare html of the icon based on shape and icon components
     * @return {string}
     */

  }, {
    key: "getShapeHtml",
    value: function getShapeHtml() {
      // Basic shape -> no need for svg
      if (this.basicShape) {
        var style = _helpers["default"].getMarkerShapeCssStyle(this.style);

        return _server["default"].renderToString( /*#__PURE__*/_react["default"].createElement("div", {
          style: style
        }));
      } else {
        var finalShape;

        var _style = _helpers["default"].getMarkerShapeSvgStyle(this.style); // Combined shape and icon
        // Currently only shape="pin" is suitable for combination


        if (this.shape && this.icon) {
          finalShape = this.getShapeWithIcon(_style);
        } // Just shape
        else if (this.shape) {
            finalShape = this.getShape(_style);
          } // No shape, but icon? Use icon as shape
          else if (this.icon) {
              finalShape = this.getIcon(_style);
            }

        return _server["default"].renderToString(finalShape);
      }
    }
    /**
     * @param style {Object} style object suitable for SVG
     * @return {React.DetailedReactHTMLElement<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>}
     */

  }, {
    key: "getShape",
    value: function getShape(style) {
      var props = this.shape.componentProps ? _objectSpread(_objectSpread({}, this.shape.componentProps), {}, {
        style: style
      }) : {
        style: style
      };
      return /*#__PURE__*/_react["default"].createElement(this.shape.component, _objectSpread(_objectSpread({}, props), {}, {
        outlineWidth: this.style.weight
      }));
    }
    /**
     * @param style {Object} style object suitable for SVG
     * @return {React.DetailedReactHTMLElement<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>}
     */

  }, {
    key: "getIcon",
    value: function getIcon(style) {
      var iconStyle = _objectSpread(_objectSpread({}, style), {}, {
        fill: style.iconFill ? style.iconFill : style.fill
      });

      var props = this.icon.componentProps ? _objectSpread(_objectSpread({}, this.icon.componentProps), {}, {
        style: iconStyle
      }) : {
        style: iconStyle
      };
      return /*#__PURE__*/_react["default"].createElement(this.icon.component, props);
    }
    /**
     * @param style {Object} style object suitable for SVG
     * @return {React.DetailedReactHTMLElement<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>}
     */

  }, {
    key: "getShapeWithIcon",
    value: function getShapeWithIcon(style) {
      var iconStyle = {
        strokeWidth: 0
      }; // TODO think about icons styling inside shape

      var iconFill = style.iconFill,
          shapeStyle = _objectWithoutProperties(style, ["iconFill"]);

      if (iconFill) {
        iconStyle.fill = iconFill;
      } else {
        iconStyle.fill = shapeStyle.stroke;
      }

      var iconProps = this.icon.componentProps ? _objectSpread(_objectSpread({}, this.icon.componentProps), {}, {
        style: iconStyle
      }) : {
        style: iconStyle
      };

      var iconComponent = /*#__PURE__*/_react["default"].createElement(this.icon.component, iconProps);

      var props = this.shape.componentProps ? _objectSpread(_objectSpread({}, this.shape.componentProps), {}, {
        style: shapeStyle
      }) : {
        style: shapeStyle
      };
      return /*#__PURE__*/_react["default"].createElement(this.shape.component, _objectSpread(_objectSpread({}, props), {}, {
        icon: iconComponent,
        outlineWidth: this.style.weight
      }));
    }
    /**
     * Set style of element
     * @param style {Object} Leaflet style definition
     * @param id {string} id of the shape
     * @param isBasicShape {bool} If true -> DIV element, if false -> SVG element
     */

  }, {
    key: "setStyle",
    value: function setStyle(style, id, isBasicShape) {
      var _element$children;

      id = id || this.id;
      isBasicShape = isBasicShape || this.basicShape;
      var shapeStyle = isBasicShape ? _helpers["default"].getMarkerShapeCssStyle(style) : _helpers["default"].getMarkerShapeSvgStyle(style);
      var element = document.getElementById(id);
      var shape = element === null || element === void 0 ? void 0 : (_element$children = element.children) === null || _element$children === void 0 ? void 0 : _element$children[0];

      if (shape) {
        (0, _lodash.forIn)(shapeStyle, function (value, key) {
          shape.style[key] = value;
        });
      }
    }
  }]);

  return MarkerShape;
}(_leaflet["default"].DivIcon);

var _default = MarkerShape;
exports["default"] = _default;