"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var L = _interopRequireWildcard(require("leaflet"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

/*!
 * leaflet.wms.js
 * A collection of Leaflet utilities for working with Web Mapping services.
 * (c) 2014-2016, Houston Engineering, Inc.
 * MIT License
 */
// Module object
var wms = {}; // Quick shim for Object.keys()

if (!('keys' in Object)) {
  Object.keys = function (obj) {
    var result = [];

    for (var i in obj) {
      if (obj.hasOwnProperty(i)) {
        result.push(i);
      }
    }

    return result;
  };
}
/*
 * wms.Source
 * The Source object manages a single WMS connection.  Multiple "layers" can be
 * created with the getLayer function, but a single request will be sent for
 * each image update.  Can be used in non-tiled "overlay" mode (default), or
 * tiled mode, via an internal wms.Overlay or wms.TileLayer, respectively.
 */


wms.Source = L.Layer.extend({
  options: {
    untiled: true,
    identify: true
  },
  initialize: function initialize(url, options) {
    L.setOptions(this, options);

    if (this.options.tiled) {
      this.options.untiled = false;
    }

    this._url = url;
    this._subLayers = {};
    this._overlay = this.createOverlay(this.options.untiled);
  },
  createOverlay: function createOverlay(untiled) {
    // Create overlay with all options other than untiled & identify
    var overlayOptions = {};

    for (var opt in this.options) {
      if (opt != 'untiled' && opt != 'identify') {
        overlayOptions[opt] = this.options[opt];
      }
    }

    if (untiled) {
      return wms.overlay(this._url, overlayOptions);
    } else {
      return wms.tileLayer(this._url, overlayOptions);
    }
  },
  onAdd: function onAdd() {
    this.refreshOverlay();
  },
  setParams: function setParams(params) {
    // L.extend(this.wmsParams, params);
    // this.update();
    this._overlay.setParams(params);
  },
  onRemove: function onRemove() {
    var subLayers = Object.keys(this._subLayers).join(',');

    if (!this._map) {
      return;
    }

    if (subLayers) {
      this._overlay.remove();
    }
  },
  getEvents: function getEvents() {
    if (this.options.identify) {
      return {
        click: this.identify
      };
    } else {
      return {};
    }
  },
  setOpacity: function setOpacity(opacity) {
    this.options.opacity = opacity;

    if (this._overlay) {
      this._overlay.setOpacity(opacity);
    }
  },
  bringToBack: function bringToBack() {
    this.options.isBack = true;

    if (this._overlay) {
      this._overlay.bringToBack();
    }
  },
  bringToFront: function bringToFront() {
    this.options.isBack = false;

    if (this._overlay) {
      this._overlay.bringToFront();
    }
  },
  getLayer: function getLayer(name) {
    return wms.layer(this, name);
  },
  addSubLayer: function addSubLayer(name) {
    this._subLayers[name] = true;
    this.refreshOverlay();
  },
  removeSubLayer: function removeSubLayer(name) {
    delete this._subLayers[name];
    this.refreshOverlay();
  },
  refreshOverlay: function refreshOverlay() {
    var subLayers = Object.keys(this._subLayers).join(',');

    if (!this._map) {
      return;
    }

    if (!subLayers) {
      this._overlay.remove();
    } else {
      this._overlay.setParams({
        layers: subLayers
      });

      this._overlay.addTo(this._map);
    }
  },
  identify: function identify(evt) {
    // Identify map features in response to map clicks. To customize this
    // behavior, create a class extending wms.Source and override one or
    // more of the following hook functions.
    var layers = this.getIdentifyLayers();

    if (!layers.length) {
      return;
    }

    this.getFeatureInfo(evt.containerPoint, evt.latlng, layers, this.showFeatureInfo);
  },
  getFeatureInfo: function getFeatureInfo(point, latlng, layers, callback) {
    // Request WMS GetFeatureInfo and call callback with results
    // (split from identify() to faciliate use outside of map events)
    var params = this.getFeatureInfoParams(point, layers),
        url = this._url + L.Util.getParamString(params, this._url);
    this.showWaiting();
    this.ajax(url, done);

    function done(result) {
      this.hideWaiting();
      var text = this.parseFeatureInfo(result, url);
      callback.call(this, latlng, text);
    }
  },
  ajax: function ajax(url, callback) {
    _ajax.call(this, url, callback);
  },
  getIdentifyLayers: function getIdentifyLayers() {
    // Hook to determine which layers to identify
    if (this.options.identifyLayers) return this.options.identifyLayers;
    return Object.keys(this._subLayers);
  },
  getFeatureInfoParams: function getFeatureInfoParams(point, layers) {
    // Hook to generate parameters for WMS service GetFeatureInfo request
    var wmsParams, overlay;

    if (this.options.untiled) {
      // Use existing overlay
      wmsParams = this._overlay.wmsParams;
    } else {
      // Create overlay instance to leverage updateWmsParams
      overlay = this.createOverlay(true);
      overlay.updateWmsParams(this._map);
      wmsParams = overlay.wmsParams;
      wmsParams.layers = layers.join(',');
    }

    var infoParams = {
      request: 'GetFeatureInfo',
      query_layers: layers.join(','),
      X: Math.round(point.x),
      Y: Math.round(point.y)
    };
    return L.extend({}, wmsParams, infoParams);
  },
  parseFeatureInfo: function parseFeatureInfo(result, url) {
    // Hook to handle parsing AJAX response
    if (result == 'error') {
      // AJAX failed, possibly due to CORS issues.
      // Try loading content in <iframe>.
      result = "<iframe src='" + url + "' style='border:none'>";
    }

    return result;
  },
  showFeatureInfo: function showFeatureInfo(latlng, info) {
    // Hook to handle displaying parsed AJAX response to the user
    if (!this._map) {
      return;
    }

    this._map.openPopup(info, latlng);
  },
  showWaiting: function showWaiting() {
    // Hook to customize AJAX wait animation
    if (!this._map) return;
    this._map._container.style.cursor = 'progress';
  },
  hideWaiting: function hideWaiting() {
    // Hook to remove AJAX wait animation
    if (!this._map) return;
    this._map._container.style.cursor = 'default';
  }
});

wms.source = function (url, options) {
  return new wms.Source(url, options);
};
/*
 * Layer
 * Leaflet "layer" with all actual rendering handled via an underlying Source
 * object.  Can be called directly with a URL to automatically create or reuse
 * an existing Source.  Note that the auto-source feature doesn't work well in
 * multi-map environments; so for best results, create a Source first and use
 * getLayer() to retrieve wms.Layer instances.
 */


wms.Layer = L.Layer.extend({
  initialize: function initialize(source, layerName, options) {
    L.setOptions(this, {
      pane: source.options.pane
    });

    if (!source.addSubLayer) {
      // Assume source is a URL
      source = wms.getSourceForUrl(source, options);
    }

    this._source = source;
    this._name = layerName;
  },
  onAdd: function onAdd() {
    if (!this._source._map) this._source.addTo(this._map);

    this._source.addSubLayer(this._name);
  },
  onRemove: function onRemove() {
    this._source.removeSubLayer(this._name);
  },
  setOpacity: function setOpacity(opacity) {
    this._source.setOpacity(opacity);
  },
  setParams: function setParams(params) {
    this._source.setParams(params);
  },
  bringToBack: function bringToBack() {
    this._source.bringToBack();
  },
  bringToFront: function bringToFront() {
    this._source.bringToFront();
  }
});

wms.layer = function (source, options) {
  return new wms.Layer(source, options);
}; // Cache of sources for use with wms.Layer auto-source option


var sources = {};

wms.getSourceForUrl = function (url, options) {
  if (!sources[url]) {
    sources[url] = wms.source(url, options);
  }

  return sources[url];
}; // Copy tiled WMS layer from leaflet core, in case we need to subclass it later


wms.TileLayer = L.TileLayer.WMS;
wms.tileLayer = L.tileLayer.wms;
/*
 * wms.Overlay:
 * "Single Tile" WMS image overlay that updates with map changes.
 * Portions of wms.Overlay are directly extracted from L.TileLayer.WMS.
 * See Leaflet license.
 */

wms.Overlay = L.Layer.extend({
  defaultWmsParams: {
    service: 'WMS',
    request: 'GetMap',
    version: '1.1.1',
    layers: '',
    styles: '',
    format: 'image/jpeg',
    transparent: false
  },
  options: {
    crs: null,
    uppercase: false,
    attribution: '',
    opacity: 1,
    isBack: false,
    minZoom: 0,
    maxZoom: 18
  },
  initialize: function initialize(url, options) {
    this._url = url; // Move WMS parameters to params object

    var params = {},
        opts = {};

    for (var opt in options) {
      if (opt in this.options) {
        opts[opt] = options[opt];
      } else {
        params[opt] = options[opt];
      }
    }

    L.setOptions(this, opts);
    this.wmsParams = L.extend({}, this.defaultWmsParams, params);
  },
  setParams: function setParams(params) {
    L.extend(this.wmsParams, params);
    this.update();
  },
  getAttribution: function getAttribution() {
    return this.options.attribution;
  },
  onAdd: function onAdd() {
    this.update();
  },
  onRemove: function onRemove(map) {
    if (this._currentOverlay) {
      map.removeLayer(this._currentOverlay);
      delete this._currentOverlay;
    }

    if (this._currentUrl) {
      delete this._currentUrl;
    }
  },
  getEvents: function getEvents() {
    return {
      moveend: this.update
    };
  },
  update: function update() {
    if (!this._map) {
      return;
    } // Determine image URL and whether it has changed since last update


    this.updateWmsParams();
    var url = this.getImageUrl();

    if (this._currentUrl == url) {
      return;
    }

    this._currentUrl = url; // Keep current image overlay in place until new one loads
    // (inspired by esri.leaflet)

    var bounds = this._map.getBounds();

    var overlay = L.imageOverlay(url, bounds, {
      opacity: 0,
      pane: this.options.pane
    });
    overlay.addTo(this._map);
    overlay.once('load', _swap, this);

    function _swap() {
      if (!this._map) {
        return;
      }

      if (overlay._url != this._currentUrl) {
        this._map.removeLayer(overlay);

        return;
      } else if (this._currentOverlay) {
        this._map.removeLayer(this._currentOverlay);
      }

      this._currentOverlay = overlay;
      overlay.setOpacity(this.options.opacity ? this.options.opacity : 1);

      if (this.options.isBack === true) {
        overlay.bringToBack();
      }

      if (this.options.isBack === false) {
        overlay.bringToFront();
      }
    }

    if (this._map.getZoom() < this.options.minZoom || this._map.getZoom() > this.options.maxZoom) {
      this._map.removeLayer(overlay);
    }
  },
  setOpacity: function setOpacity(opacity) {
    this.options.opacity = opacity;

    if (this._currentOverlay) {
      this._currentOverlay.setOpacity(opacity);
    }
  },
  bringToBack: function bringToBack() {
    this.options.isBack = true;

    if (this._currentOverlay) {
      this._currentOverlay.bringToBack();
    }
  },
  bringToFront: function bringToFront() {
    this.options.isBack = false;

    if (this._currentOverlay) {
      this._currentOverlay.bringToFront();
    }
  },
  // See L.TileLayer.WMS: onAdd() & getTileUrl()
  updateWmsParams: function updateWmsParams(map) {
    if (!map) {
      map = this._map;
    } // Compute WMS options


    var bounds = map.getBounds();
    var size = map.getSize();
    var wmsVersion = parseFloat(this.wmsParams.version);
    var crs = this.options.crs || map.options.crs;
    var projectionKey = wmsVersion >= 1.3 ? 'crs' : 'srs';
    var nw = crs.project(bounds.getNorthWest());
    var se = crs.project(bounds.getSouthEast()); // Assemble WMS parameter string

    var params = {
      width: size.x,
      height: size.y
    };
    params[projectionKey] = crs.code;
    params.bbox = (wmsVersion >= 1.3 && crs === L.CRS.EPSG4326 ? [se.y, nw.x, nw.y, se.x] : [nw.x, se.y, se.x, nw.y]).join(',');
    L.extend(this.wmsParams, params);
  },
  getImageUrl: function getImageUrl() {
    var uppercase = this.options.uppercase || false;
    var pstr = L.Util.getParamString(this.wmsParams, this._url, uppercase);
    return this._url + pstr;
  }
});

wms.overlay = function (url, options) {
  return new wms.Overlay(url, options);
}; // Simple AJAX helper (since we can't assume jQuery etc. are present)


function _ajax(url, callback) {
  var context = this,
      request = new XMLHttpRequest();
  request.onreadystatechange = change;
  request.open('GET', url);
  request.send();

  function change() {
    if (request.readyState === 4) {
      if (request.status === 200) {
        callback.call(context, request.responseText);
      } else {
        callback.call(context, 'error');
      }
    }
  }
}

var _default = wms;
exports["default"] = _default;