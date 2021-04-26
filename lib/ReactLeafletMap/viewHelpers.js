"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _ptrCore = require("@gisatcz/ptr-core");

var _ptrUtils = require("@gisatcz/ptr-utils");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function getLeafletViewFromViewParams(view, width, height) {
  var completeView = _objectSpread(_objectSpread({}, _ptrCore.mapConstants.defaultMapView), view);

  return {
    zoom: _ptrUtils.map.view.getZoomLevelFromBoxRange(completeView.boxRange, width, height),
    center: {
      lat: completeView.center.lat,
      lng: completeView.center.lon
    }
  };
}

function getLeafletViewportFromViewParams(view, width, height) {
  var leafletView = getLeafletViewFromViewParams(view, width, height);
  return {
    zoom: leafletView.zoom,
    center: [leafletView.center.lat, leafletView.center.lng]
  };
}

function update(map, view, width, height) {
  var stateCenter = map.getCenter();
  var stateZoom = map.getZoom();
  var leafletUpdate = getLeafletViewFromViewParams(view, width, height);

  if (stateCenter.lat !== leafletUpdate.center.lat || stateCenter.lng !== leafletUpdate.center.lng || stateZoom !== leafletUpdate.zoom) {
    map.setView(leafletUpdate.center || stateCenter, leafletUpdate.zoom || stateZoom);
  }
}

var _default = {
  getLeafletViewportFromViewParams: getLeafletViewportFromViewParams,
  update: update
};
exports["default"] = _default;