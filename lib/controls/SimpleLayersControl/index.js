"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _classnames = _interopRequireDefault(require("classnames"));

var _ptrAtoms = require("@gisatcz/ptr-atoms");

require("./style.scss");

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

// TODO Refactor
var SimpleLayersControl = /*#__PURE__*/function (_React$PureComponent) {
  _inherits(SimpleLayersControl, _React$PureComponent);

  var _super = _createSuper(SimpleLayersControl);

  function SimpleLayersControl(props) {
    var _this;

    _classCallCheck(this, SimpleLayersControl);

    _this = _super.call(this, props);
    _this.ref = /*#__PURE__*/_react["default"].createRef();
    _this.state = {
      open: false
    };
    _this.onControlButtonClick = _this.onControlButtonClick.bind(_assertThisInitialized(_this));
    _this.onBlur = _this.onBlur.bind(_assertThisInitialized(_this));
    return _this;
  }

  _createClass(SimpleLayersControl, [{
    key: "onBlur",
    value: function onBlur(e) {
      var _this2 = this;

      setTimeout(function () {
        _this2.setState({
          open: false
        });
      }, 50);
    }
  }, {
    key: "onControlButtonClick",
    value: function onControlButtonClick() {
      this.setState({
        open: !this.state.open
      });
    }
  }, {
    key: "onLayerTileClick",
    value: function onLayerTileClick(key) {
      if (this.props.onSelect) {
        this.props.onSelect(key);
      }
    }
  }, {
    key: "render",
    value: function render() {
      var buttonClasses = (0, _classnames["default"])('ptr-simple-layers-control control', {
        open: this.state.open
      });
      return /*#__PURE__*/_react["default"].createElement("div", {
        className: buttonClasses,
        onBlur: this.onBlur,
        ref: this.ref
      }, /*#__PURE__*/_react["default"].createElement(_ptrAtoms.Button, {
        onClick: this.onControlButtonClick
      }, /*#__PURE__*/_react["default"].createElement(_ptrAtoms.Icon, {
        icon: "layers"
      })), this.renderMenu());
    }
  }, {
    key: "renderMenu",
    value: function renderMenu() {
      var _this3 = this;

      var layers = this.props.layers;
      var tileWidth = 7;
      var tileHeight = 5;
      var tileMargin = 0.25;
      var contentMargin = 1;

      if (layers) {
        var grid = this.getGrid(layers.length);
        var menuClasses = (0, _classnames["default"])('ptr-simple-layers-control-menu', {
          open: this.state.open,
          right: this.props.right,
          left: !this.props.right
        });
        var menuStyle = {
          width: this.state.open ? "".concat((tileWidth + 2 * tileMargin) * grid.width + 2 * contentMargin, "rem") : 0,
          height: this.state.open ? "".concat((tileHeight + 2 * tileMargin) * grid.height + 2 * contentMargin, "rem") : '2rem'
        };
        var contentStyle = {
          margin: "".concat(contentMargin, "rem"),
          width: "calc(100% - ".concat(2 * contentMargin, "rem)"),
          height: "calc(100% - ".concat(2 * contentMargin, "rem)")
        };
        return /*#__PURE__*/_react["default"].createElement("div", {
          className: menuClasses,
          style: menuStyle
        }, /*#__PURE__*/_react["default"].createElement("div", {
          className: "ptr-simple-layers-control-menu-content",
          style: contentStyle
        }, layers.map(function (layer) {
          return _this3.renderTile(layer, tileWidth, tileHeight, tileMargin);
        })));
      } else {
        return null;
      }
    }
  }, {
    key: "renderTile",
    value: function renderTile(layer, width, height, margin) {
      var active = layer.key === this.props.activeLayer.key;
      var classes = (0, _classnames["default"])('ptr-simple-layers-control-tile', {
        active: active
      });
      var style = {
        width: "".concat(width, "rem"),
        height: "".concat(height, "rem"),
        margin: "".concat(margin, "rem")
      };

      if (layer.thumbnail) {// TODO check type of thumbnail
        // style.backgroundImage = `url(${require('./img/' + layer.thumbnail + '.png')})`;
      }

      return /*#__PURE__*/_react["default"].createElement("div", {
        key: layer.key,
        style: style,
        className: classes,
        onClick: this.onLayerTileClick.bind(this, layer.key)
      }, /*#__PURE__*/_react["default"].createElement("div", {
        className: "ptr-simple-layers-control-tile-name"
      }, layer.name));
    }
  }, {
    key: "getGrid",
    value: function getGrid(count) {
      var width = 1;
      var height = 1; // TODO solve 9+ cases

      if (count >= 7) {
        width = 3;
        height = 3;
      } else if (count >= 5) {
        width = 2;
        height = 3;
      } else if (count === 4) {
        width = 2;
        height = 2;
      } else if (count === 3) {
        height = 3;
      } else if (count === 2) {
        height = 2;
      }

      return {
        width: width,
        height: height
      };
    }
  }]);

  return SimpleLayersControl;
}(_react["default"].PureComponent);

SimpleLayersControl.propTypes = {
  activeLayer: _propTypes["default"].object,
  layers: _propTypes["default"].array,
  onSelect: _propTypes["default"].func,
  right: _propTypes["default"].bool
};
var _default = SimpleLayersControl;
exports["default"] = _default;