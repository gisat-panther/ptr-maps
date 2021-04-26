"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _ptrCore = require("@gisatcz/ptr-core");

var _ptrAtoms = require("@gisatcz/ptr-atoms");

var _ptrUtils = require("@gisatcz/ptr-utils");

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

var MapControls = /*#__PURE__*/function (_React$PureComponent) {
  _inherits(MapControls, _React$PureComponent);

  var _super = _createSuper(MapControls);

  function MapControls() {
    var _this;

    _classCallCheck(this, MapControls);

    _this = _super.call(this);
    _this.tiltIncrement = 5;
    _this.headingIncrement = 1.0;
    _this.zoomIncrement = 0.04;
    _this.exaggerationIncrement = 1;
    _this.state = {
      resetHeadingDisabled: false
    };
    return _this;
  }

  _createClass(MapControls, [{
    key: "componentDidUpdate",
    value: function componentDidUpdate(prevProps, prevState, snapshot) {
      if (this.state.resetHeadingDisabled && (!this.props.view.heading || this.props.heading === '360')) {
        this.setState({
          resetHeadingDisabled: false
        });
      }
    }
  }, {
    key: "handleTiltUp",
    value: function handleTiltUp() {
      var update = {
        tilt: this.props.view.tilt - this.tiltIncrement
      };
      this.props.updateView(update, this.props.mapKey);
    }
  }, {
    key: "handleTiltDown",
    value: function handleTiltDown() {
      var update = {
        tilt: this.props.view.tilt + this.tiltIncrement
      };
      this.props.updateView(update, this.props.mapKey);
    }
  }, {
    key: "handleHeadingRight",
    value: function handleHeadingRight() {
      var update = {
        heading: this.props.view.heading - this.headingIncrement
      };
      this.props.updateView(update, this.props.mapKey);
    }
  }, {
    key: "handleHeadingLeft",
    value: function handleHeadingLeft() {
      var update = {
        heading: this.props.view.heading + this.headingIncrement
      };
      this.props.updateView(update, this.props.mapKey);
    }
  }, {
    key: "handleZoomIn",
    value: function handleZoomIn() {
      var update = null;

      if (this.props.levelsBased && this.props.view && this.props.view.boxRange) {
        // remove 1 from box range to prevent rounding issues
        update = {
          boxRange: (this.props.view.boxRange - 1) / 2
        };
      } else {
        update = {
          boxRange: this.props.view.boxRange * (1 - this.zoomIncrement)
        };
      }

      this.props.updateView(update, this.props.mapKey);
    }
  }, {
    key: "handleZoomOut",
    value: function handleZoomOut() {
      var update;

      if (this.props.levelsBased && this.props.view && this.props.view.boxRange) {
        // add 1 to box range to prevent rounding issues
        update = {
          boxRange: this.props.view.boxRange * 2 + 1
        };
      } else {
        update = {
          boxRange: this.props.view.boxRange * (1 + this.zoomIncrement)
        };
      }

      this.props.updateView(update, this.props.mapKey);
    }
  }, {
    key: "handleResetHeading",
    value: function handleResetHeading() {
      this.props.resetHeading(this.props.mapKey);
      this.setState({
        resetHeadingDisabled: true
      });
    }
  }, {
    key: "handleExaggeratePlus",
    value: function handleExaggeratePlus() {// const update = {elevation: this.props.view.elevation + this.exaggerationIncrement};
      // this.props.updateView(update, this.props.mapKey);
    }
  }, {
    key: "handleExaggerateMinus",
    value: function handleExaggerateMinus() {// const update = {elevation: Math.max(1, this.props.view.elevation - this.exaggerationIncrement)};
      // this.props.updateView(update, this.props.mapKey);
    }
  }, {
    key: "isZoomButtonActive",
    value: function isZoomButtonActive(type) {
      var definedLimits = this.props.viewLimits && this.props.viewLimits.boxRangeRange;
      var currentBoxRange = this.props.view && this.props.view.boxRange;

      if (this.props.levelsBased) {
        var currentLevel = _ptrUtils.map.view.getZoomLevelFromBoxRange(currentBoxRange, this.props.mapWidth, this.props.mapHeight);

        if (type === 'in') {
          var maxZoom = _ptrCore.mapConstants.defaultLevelsRange[1];

          if (definedLimits && definedLimits[0]) {
            var definedLimitAsLevel = _ptrUtils.map.view.getZoomLevelFromBoxRange(definedLimits[0], this.props.mapWidth, this.props.mapHeight);

            if (definedLimitAsLevel < maxZoom) {
              maxZoom = definedLimitAsLevel;
            }
          }

          return currentLevel < maxZoom;
        } else {
          var minZoom = _ptrCore.mapConstants.defaultLevelsRange[0];

          if (definedLimits && definedLimits[1]) {
            var _definedLimitAsLevel = _ptrUtils.map.view.getZoomLevelFromBoxRange(definedLimits[1], this.props.mapWidth, this.props.mapHeight);

            if (_definedLimitAsLevel > minZoom) {
              minZoom = _definedLimitAsLevel;
            }
          }

          return currentLevel > minZoom;
        }
      } else {
        if (type === 'in') {
          var limit = definedLimits && definedLimits[0] || _ptrCore.mapConstants.minBoxRange;
          return currentBoxRange * (1 - this.zoomIncrement) >= limit;
        } else {
          var _limit = definedLimits && definedLimits[1] || _ptrCore.mapConstants.maxBoxRange;

          return currentBoxRange * (1 + this.zoomIncrement) <= _limit;
        }
      }
    }
  }, {
    key: "render",
    value: function render() {
      var _this2 = this;

      // TODO different controls for 2D
      return /*#__PURE__*/_react["default"].createElement("div", {
        className: "ptr-map-controls"
      }, /*#__PURE__*/_react["default"].createElement("div", {
        className: "zoom-control control"
      }, /*#__PURE__*/_react["default"].createElement(_ptrAtoms.Button, {
        onHold: function onHold() {
          _this2.handleZoomIn();
        },
        onClick: function onClick() {
          _this2.handleZoomIn();
        },
        disabled: !this.isZoomButtonActive('in')
      }, /*#__PURE__*/_react["default"].createElement(_ptrAtoms.Icon, {
        icon: "plus-thick"
      })), /*#__PURE__*/_react["default"].createElement(_ptrAtoms.Button, {
        onHold: function onHold() {
          _this2.handleZoomOut();
        },
        onClick: function onClick() {
          _this2.handleZoomOut();
        },
        disabled: !this.isZoomButtonActive('out')
      }, /*#__PURE__*/_react["default"].createElement(_ptrAtoms.Icon, {
        icon: "minus-thick"
      }))), !this.props.zoomOnly ? /*#__PURE__*/_react["default"].createElement(_react["default"].Fragment, null, /*#__PURE__*/_react["default"].createElement("div", {
        className: "rotate-control control"
      }, /*#__PURE__*/_react["default"].createElement(_ptrAtoms.Button, {
        onHold: function onHold() {
          _this2.handleHeadingRight();
        },
        onClick: function onClick() {
          _this2.handleHeadingRight();
        }
      }, /*#__PURE__*/_react["default"].createElement(_ptrAtoms.Icon, {
        icon: "rotate-right"
      })), /*#__PURE__*/_react["default"].createElement(_ptrAtoms.Button, {
        onClick: function onClick() {
          _this2.handleResetHeading();
        },
        disabled: this.state.resetHeadingDisabled
      }, /*#__PURE__*/_react["default"].createElement(_ptrAtoms.Icon, {
        style: {
          transform: "rotate(".concat(this.props.view ? -this.props.view.heading : 0, "deg)")
        },
        icon: "north-arrow"
      })), /*#__PURE__*/_react["default"].createElement(_ptrAtoms.Button, {
        onHold: function onHold() {
          _this2.handleHeadingLeft();
        },
        onClick: function onClick() {
          _this2.handleHeadingLeft();
        }
      }, /*#__PURE__*/_react["default"].createElement(_ptrAtoms.Icon, {
        icon: "rotate-left"
      }))), /*#__PURE__*/_react["default"].createElement("div", {
        className: "tilt-control control"
      }, /*#__PURE__*/_react["default"].createElement(_ptrAtoms.Button, {
        className: "tilt-more-control",
        onHold: function onHold() {
          _this2.handleTiltDown();
        },
        onClick: function onClick() {
          _this2.handleTiltDown();
        }
      }, /*#__PURE__*/_react["default"].createElement(_ptrAtoms.Icon, {
        icon: "tilt-more"
      })), /*#__PURE__*/_react["default"].createElement(_ptrAtoms.Button, {
        className: "tilt-more-control",
        onHold: function onHold() {
          _this2.handleTiltUp();
        },
        onClick: function onClick() {
          _this2.handleTiltUp();
        }
      }, /*#__PURE__*/_react["default"].createElement(_ptrAtoms.Icon, {
        icon: "tilt-less"
      })))) : null);
    }
  }]);

  return MapControls;
}(_react["default"].PureComponent);

MapControls.propTypes = {
  view: _propTypes["default"].object,
  viewLimits: _propTypes["default"].object,
  updateView: _propTypes["default"].func,
  resetHeading: _propTypes["default"].func,
  mapKey: _propTypes["default"].string,
  zoomOnly: _propTypes["default"].bool,
  levelsBased: _propTypes["default"].oneOfType([_propTypes["default"].bool, _propTypes["default"].array]),
  mapHeight: _propTypes["default"].number,
  mapWidth: _propTypes["default"].number
};
var _default = MapControls;
exports["default"] = _default;