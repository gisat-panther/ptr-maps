"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _webworldwindEsa = _interopRequireDefault(require("webworldwind-esa"));

var _VectorLayer = _interopRequireDefault(require("./VectorLayer"));

var _WikimediaLayer = _interopRequireDefault(require("./WikimediaLayer"));

var _WmsLayer = _interopRequireDefault(require("./WmsLayer"));

var _WmtsLayer = _interopRequireDefault(require("./WmtsLayer"));

var _LargeDataLayer = _interopRequireDefault(require("./LargeDataLayerSource/LargeDataLayer"));

var _lodash = require("lodash");

var _ptrUtils = require("@gisatcz/ptr-utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function getLayerByType(layerDefinition, wwd, onHover, onClick, pointAsMarker) {
  if (layerDefinition.type) {
    switch (layerDefinition.type) {
      case 'worldwind':
        switch (layerDefinition.options.layer) {
          case 'bingAerial':
            return new _webworldwindEsa["default"].BingAerialLayer(null);

          case 'bluemarble':
            return new _webworldwindEsa["default"].BMNGLayer();

          case 'wikimedia':
            return new _WikimediaLayer["default"]({
              attribution: "Wikimedia maps - Map data \xA9 OpenStreetMap contributors",
              sourceObject: {
                host: 'maps.wikimedia.org',
                path: 'osm-intl',
                protocol: 'https'
              }
            });

          default:
            return null;
        }

      case 'wmts':
        return new _WmtsLayer["default"](layerDefinition);

      case 'wms':
        return new _WmsLayer["default"](layerDefinition);

      case 'vector':
        return getVectorLayer(layerDefinition, wwd, onHover, onClick, pointAsMarker);

      default:
        return null;
    }
  } else {
    return null;
  }
}

function getVectorLayer(layerDefinition, wwd, onHover, onClick, pointAsMarker) {
  var url = layerDefinition.options && layerDefinition.options.url;
  var numOfFeatures = layerDefinition.options && layerDefinition.options.features && layerDefinition.options.features.length;
  var key = layerDefinition.key || 'Vector layer';
  var layerKey = layerDefinition.layerKey || key;

  var options = _objectSpread(_objectSpread({}, layerDefinition.options), {}, {
    key: key,
    layerKey: layerKey,
    onHover: onHover,
    onClick: onClick
  }); // TODO better deciding


  if (url || pointAsMarker) {
    options.pointHoverBuffer = _ptrUtils.mapStyle.DEFAULT_SIZE; // in px TODO pass pointHoverBuffer

    return new _LargeDataLayer["default"](wwd, options, layerDefinition);
  } else {
    return new _VectorLayer["default"](layerDefinition, options);
  }
}

function updateVectorLayer(layerDefinition, wwd, onHover, onClick) {
  var mapLayer = null;
  var layerKey = layerDefinition.layerKey;
  var worldWindLayer = (0, _lodash.find)(wwd.layers, function (lay) {
    return lay.pantherProps && lay.pantherProps.layerKey && lay.pantherProps.layerKey === layerKey;
  });

  if (!worldWindLayer) {
    mapLayer = getLayerByType(layerDefinition, wwd, onHover, onClick);
  } else {
    var prevFeatures = worldWindLayer.pantherProps.features;
    var nextFeatures = layerDefinition.options.features;

    if (prevFeatures === nextFeatures) {
      mapLayer = worldWindLayer; // TODO still needed?
      // let prevHoveredKeys = worldWindLayer.pantherProps.hovered && worldWindLayer.pantherProps.hovered.keys;
      // let nextHoveredKeys = layerDefinition.options.hovered && layerDefinition.options.hovered.keys;
      // if (prevHoveredKeys !== nextHoveredKeys) {
      // 	worldWindLayer.updateHoveredKeys(nextHoveredKeys);
      // }
    } else {
      worldWindLayer.removeListeners();
      mapLayer = getLayerByType(layerDefinition, wwd, onHover, onClick);
    }
  }

  return mapLayer;
}

var _default = {
  getLayerByType: getLayerByType,
  updateVectorLayer: updateVectorLayer
};
exports["default"] = _default;