"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _react = _interopRequireDefault(require("react"));

var _classnames = _interopRequireDefault(require("classnames"));

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

var MapGrid = /*#__PURE__*/function (_React$PureComponent) {
  _inherits(MapGrid, _React$PureComponent);

  var _super = _createSuper(MapGrid);

  function MapGrid(props) {
    var _this;

    _classCallCheck(this, MapGrid);

    _this = _super.call(this, props);
    _this.ref = /*#__PURE__*/_react["default"].createRef();
    _this.state = {
      width: null,
      height: null
    };
    return _this;
  }

  _createClass(MapGrid, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      this.resize();
      if (typeof window !== 'undefined') window.addEventListener('resize', this.resize.bind(this), {
        passive: true
      }); //todo IE
    }
  }, {
    key: "resize",
    value: function resize() {
      if (this.ref && this.ref.current) {
        var width = this.ref.current.clientWidth;
        var height = this.ref.current.clientHeight;
        this.setState({
          width: width,
          height: height
        });
      }
    }
  }, {
    key: "render",
    value: function render() {
      return /*#__PURE__*/_react["default"].createElement("div", {
        className: "ptr-map-grid",
        ref: this.ref
      }, this.renderMaps());
    }
  }, {
    key: "renderMaps",
    value: function renderMaps() {
      var availableWidth = this.state.width;
      var availableHeight = this.state.height;

      if (this.props.children.length && availableWidth && availableHeight) {
        var sizeRatio = availableWidth / availableHeight;
        var rows = 1,
            columns = 1;

        switch (this.props.children.length) {
          case 1:
            break;

          case 2:
            if (sizeRatio > 1) {
              columns = 2;
            } else {
              rows = 2;
            }

            break;

          case 3:
            if (sizeRatio > 2) {
              columns = 3;
            } else if (sizeRatio < 0.6666) {
              rows = 3;
            } else {
              columns = 2;
              rows = 2;
            }

            break;

          case 4:
            if (sizeRatio > 3) {
              columns = 4;
            } else if (sizeRatio < 0.5) {
              rows = 4;
            } else {
              columns = 2;
              rows = 2;
            }

            break;

          case 5:
          case 6:
            if (sizeRatio > 1) {
              columns = 3;
              rows = 2;
            } else {
              columns = 2;
              rows = 3;
            }

            break;

          case 7:
          case 8:
            if (sizeRatio > 2) {
              columns = 4;
              rows = 2;
            } else if (sizeRatio < 0.6666) {
              columns = 2;
              rows = 4;
            } else {
              columns = 3;
              rows = 3;
            }

            break;

          case 9:
            if (sizeRatio > 2.5) {
              columns = 5;
              rows = 2;
            } else if (sizeRatio < 0.5) {
              columns = 2;
              rows = 5;
            } else {
              columns = 3;
              rows = 3;
            }

            break;

          default:
            if (sizeRatio > 1) {
              columns = 4;
              rows = 3;
            } else {
              columns = 3;
              rows = 4;
            }

        }

        var width = +(100 / columns).toFixed(4) + '%';
        var height = +(100 / rows).toFixed(4) + '%';
        var style = {
          width: width,
          height: height
        };
        return this.props.children.map(function (map, index) {
          index++;
          var rowNo = Math.ceil(index / columns);
          var colNo = index % columns || columns;
          var wrapperClasses = (0, _classnames["default"])('ptr-map-grid-cell', 'row' + rowNo, 'col' + colNo, map.props.wrapperClasses);
          return /*#__PURE__*/_react["default"].createElement("div", {
            key: 'map-grid-cell-' + index,
            className: wrapperClasses,
            style: style
          }, map);
        });
      } else {
        return null;
      }
    }
  }]);

  return MapGrid;
}(_react["default"].PureComponent);

var _default = MapGrid;
exports["default"] = _default;