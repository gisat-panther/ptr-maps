"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _react = _interopRequireDefault(require("react"));

var _lodash = require("lodash");

var _propTypes = _interopRequireDefault(require("prop-types"));

var _memoizeOne = _interopRequireDefault(require("memoize-one"));

var _IndexedVectorLayer = _interopRequireDefault(require("../IndexedVectorLayer"));

var _CanvasVectorLayer = _interopRequireDefault(require("../CanvasVectorLayer"));

var _SvgVectorLayer = _interopRequireDefault(require("../SvgVectorLayer"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

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

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

/**
 * @param featureKeysGroupedByTileKey {Array} A collection of feature keys by tile key
 * @param tileKey {String} unique tile identifier
 * @param features {Array} List of current tile's features
 * @param fidColumnName {String}
 * @return {[]|null} List of feature keys to omit
 */
function getFeatureKeysToOmit(featureKeysGroupedByTileKey, tileKey, features, fidColumnName) {
  // Find the order of current tile among others
  var indexOfCurrentTile = (0, _lodash.findIndex)(featureKeysGroupedByTileKey, function (tile) {
    return tile.tileKey === tileKey;
  });
  var i = 0;

  if (indexOfCurrentTile > 0) {
    var _ret = function () {
      var featureKeysToOmit = [];
      var renderedFeatureKeys = new Set(); // Iterate over sibling tiles that should be rendered earlier
      // TODO don't iterate through features in each tile again

      while (i < indexOfCurrentTile) {
        var tile = featureKeysGroupedByTileKey[i];
        (0, _lodash.forEach)(tile.featureKeys, function (featureKey) {
          renderedFeatureKeys.add(featureKey);
        });
        i++;
      } // Iterate over current tile's features to find which features are rendered already


      (0, _lodash.forEach)(features, function (feature) {
        // TODO feature.id
        var featureKey = feature.properties[fidColumnName];

        if (featureKey && renderedFeatureKeys.has(featureKey)) {
          featureKeysToOmit.push(featureKey);
        }
      });
      return {
        v: featureKeysToOmit.length ? featureKeysToOmit : null
      };
    }();

    if (_typeof(_ret) === "object") return _ret.v;
  } else {
    return null;
  }
}
/**
 * Return true, if previous feature keys are the same as the next
 * @param prev {Array} previous arguments
 * @param next {Array} next arguments
 * @return {boolean}
 */


function checkIdentity(prev, next) {
  var prevKeys = prev[0];
  var nextKeys = next[0];

  if (!prevKeys && !nextKeys) {
    return true;
  } else if (!prevKeys || !nextKeys) {
    return false;
  } else {
    //performance suggestion
    // return prevKeys.sort().join(',') === nextKeys.sort().join(',')
    return (0, _lodash.isEqual)(prevKeys.sort(), nextKeys.sort());
  }
}

var Tile = /*#__PURE__*/function (_React$PureComponent) {
  _inherits(Tile, _React$PureComponent);

  var _super = _createSuper(Tile);

  function Tile(props) {
    var _this;

    _classCallCheck(this, Tile);

    _this = _super.call(this, props);
    _this.getFeatureKeysToOmit = (0, _memoizeOne["default"])(getFeatureKeysToOmit); // return memoized feature keys, if nothing changed and not render IndexedVectorLayer again

    _this.checkIdentity = (0, _memoizeOne["default"])(function (keys) {
      return keys;
    }, checkIdentity);
    return _this;
  }

  _createClass(Tile, [{
    key: "render",
    value: function render() {
      var _this$props = this.props,
          tileKey = _this$props.tileKey,
          featureKeysGroupedByTileKey = _this$props.featureKeysGroupedByTileKey,
          component = _this$props.component,
          props = _objectWithoutProperties(_this$props, ["tileKey", "featureKeysGroupedByTileKey", "component"]);

      var omittedFeatureKeys = this.getFeatureKeysToOmit(featureKeysGroupedByTileKey, tileKey, props.features, props.fidColumnName);

      if (props.renderingTechnique === 'canvas') {
        return /*#__PURE__*/_react["default"].createElement(_CanvasVectorLayer["default"], _extends({}, props, {
          key: tileKey,
          uniqueLayerKey: tileKey,
          omittedFeatureKeys: this.checkIdentity(omittedFeatureKeys)
        }));
      } else {
        return /*#__PURE__*/_react["default"].createElement(_IndexedVectorLayer["default"], _extends({}, props, {
          component: _SvgVectorLayer["default"],
          key: tileKey,
          uniqueLayerKey: tileKey,
          omittedFeatureKeys: this.checkIdentity(omittedFeatureKeys),
          renderAsGeoJson: true // TODO always render as GeoJson for now

        }));
      }
    }
  }]);

  return Tile;
}(_react["default"].PureComponent);

Tile.propTypes = {
  tileKey: _propTypes["default"].string,
  features: _propTypes["default"].array,
  fidColumnName: _propTypes["default"].string,
  level: _propTypes["default"].number,
  tile: _propTypes["default"].oneOfType([_propTypes["default"].array, _propTypes["default"].string]),
  featureKeysGroupedByTileKey: _propTypes["default"].array // a collection of all tiles and their features for each tile in the layer

};
var _default = Tile;
exports["default"] = _default;