"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _react = _interopRequireDefault(require("react"));

var _lodash = require("lodash");

var _propTypes = _interopRequireDefault(require("prop-types"));

var _memoizeOne = _interopRequireDefault(require("memoize-one"));

var _Tile = _interopRequireDefault(require("./Tile"));

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

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/**
 * @param uniqueLayerKey {string}
 * @param tile {Object}
 * @return {string}
 */
function getTileKey(uniqueLayerKey, tile) {
  return "".concat(uniqueLayerKey, "_").concat(tile.level, "_").concat(typeof tile.tile === 'string' ? tile.tile : JSON.stringify(tile.tile));
}
/**
 * @param uniqueLayerKey {string}
 * @param tiles {Array}
 * @param fidColumnName {string}
 * @param selections {Object}
 * @return {Object} groupedFeatures - a collection of features grouped by tile key, groupedFeaturesKeys - a collection of feature keys grouped by tile key
 */


function getFeaturesGroupedByTileKey(uniqueLayerKey, tiles, fidColumnName, selections) {
  var groupedFeatures = [];
  var groupedFeatureKeys = [];
  var selected = {};
  (0, _lodash.forEach)(tiles, function (tile) {
    // TODO pass featureKeys or filters
    var key = getTileKey(uniqueLayerKey, tile);
    var tileFeatureKeys = [];

    if (tile.features) {
      (0, _lodash.forEach)(tile.features, function (feature) {
        var fid = feature.id || feature.properties[fidColumnName];

        if (selections) {
          (0, _lodash.forIn)(selections, function (selection, selectionKey) {
            if (selection.keys && (0, _lodash.includes)(selection.keys, fid)) {
              var _selected$selectionKe;

              if ((_selected$selectionKe = selected[selectionKey]) !== null && _selected$selectionKe !== void 0 && _selected$selectionKe.features) {
                selected[selectionKey].features[fid] = feature;
                selected[selectionKey].featureKeys.push(fid);
              } else {
                selected[selectionKey] = {
                  features: _defineProperty({}, fid, feature),
                  featureKeys: [fid],
                  level: tile.level
                };
              }
            }
          });
        }

        tileFeatureKeys.push(fid);
      });
    }

    groupedFeatures.push(_objectSpread(_objectSpread({}, tile), {}, {
      key: key
    }));
    groupedFeatureKeys.push({
      key: key,
      featureKeys: tileFeatureKeys
    });
  });

  if (!(0, _lodash.isEmpty)(selected)) {
    (0, _lodash.forIn)(selected, function (selection, selectionKey) {
      var key = "".concat(uniqueLayerKey, "_").concat(selectionKey, "_").concat(selection.level);
      groupedFeatures.unshift({
        key: key,
        features: Object.values(selection.features),
        level: selection.level,
        withSelectedFeaturesOnly: true
      });
      groupedFeatureKeys.unshift({
        key: key,
        featureKeys: (0, _lodash.uniq)(selection.featureKeys)
      });
    });
  }

  return {
    groupedFeatures: groupedFeatures,
    groupedFeatureKeys: groupedFeatureKeys
  };
}

var TiledVectorLayer = /*#__PURE__*/function (_React$PureComponent) {
  _inherits(TiledVectorLayer, _React$PureComponent);

  var _super = _createSuper(TiledVectorLayer);

  function TiledVectorLayer(props) {
    var _this;

    _classCallCheck(this, TiledVectorLayer);

    _this = _super.call(this, props);
    _this.getFeaturesGroupedByTileKey = (0, _memoizeOne["default"])(getFeaturesGroupedByTileKey);
    return _this;
  }

  _createClass(TiledVectorLayer, [{
    key: "render",
    value: function render() {
      var _data$groupedFeatures;

      var _this$props = this.props,
          tiles = _this$props.tiles,
          props = _objectWithoutProperties(_this$props, ["tiles"]);

      var data = this.getFeaturesGroupedByTileKey(props.uniqueLayerKey, tiles, props.fidColumnName, props.selected);

      if ((_data$groupedFeatures = data.groupedFeatures) !== null && _data$groupedFeatures !== void 0 && _data$groupedFeatures.length) {
        return data.groupedFeatures.map(function (tile) {
          return /*#__PURE__*/_react["default"].createElement(_Tile["default"], _extends({}, props, {
            key: tile.key,
            tileKey: tile.key,
            features: tile.features,
            level: tile.level,
            tile: tile.tile,
            featureKeysGroupedByTileKey: data.groupedFeatureKeys,
            withSelectedFeaturesOnly: tile.withSelectedFeaturesOnly
          }));
        });
      } else {
        return null;
      }
    }
  }]);

  return TiledVectorLayer;
}(_react["default"].PureComponent);

TiledVectorLayer.propTypes = {
  fidColumnName: _propTypes["default"].string,
  tiles: _propTypes["default"].array,
  layerKey: _propTypes["default"].string,
  uniqueLayerKey: _propTypes["default"].string
};
var _default = TiledVectorLayer;
exports["default"] = _default;