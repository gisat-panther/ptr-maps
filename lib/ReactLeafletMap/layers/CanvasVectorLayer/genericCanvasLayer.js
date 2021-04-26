"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.CanvasLayer = void 0;

var L = _interopRequireWildcard(require("leaflet"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

/*
  Generic  Canvas Layer for leaflet 0.7 and 1.0-rc, 1.2, 1.3
  copyright Stanislav Sumbera,  2016-2018, sumbera.com , license MIT
  originally created and motivated by L.CanvasOverlay  available here: https://gist.github.com/Sumbera/11114288

  also thanks to contributors: heyyeyheman,andern,nikiv3, anyoneelse ?
  enjoy !
*/
// -- L.DomUtil.setTransform from leaflet 1.0.0 to work on 0.0.7
//------------------------------------------------------------------------------
L.DomUtil.setTransform = L.DomUtil.setTransform || function (el, offset, scale) {
  var pos = offset || new L.Point(0, 0);
  el.style[L.DomUtil.TRANSFORM] = (L.Browser.ie3d ? 'translate(' + pos.x + 'px,' + pos.y + 'px)' : 'translate3d(' + pos.x + 'px,' + pos.y + 'px,0)') + (scale ? ' scale(' + scale + ')' : '');
}; // -- support for both  0.0.7 and 1.0.0 rc2 leaflet


var CanvasLayer = (L.Layer ? L.Layer : L.Class).extend({
  // -- initialized is called on prototype
  initialize: function initialize(options) {
    this._paneName = options.paneName;
    this._paneZindex = options.paneZindex;
    this._map = null;
    this._canvas = null;
    this._frame = null;
    this._delegate = null;
    L.setOptions(this, options);
  },
  delegate: function delegate(del) {
    this._delegate = del;
    return this;
  },
  needRedraw: function needRedraw() {
    if (!this._frame) {
      this._frame = L.Util.requestAnimFrame(this.drawLayer, this);
    }

    return this;
  },
  //-------------------------------------------------------------
  _onLayerDidResize: function _onLayerDidResize(resizeEvent) {
    this._canvas.width = resizeEvent.newSize.x;
    this._canvas.height = resizeEvent.newSize.y;
  },
  //-------------------------------------------------------------
  _onLayerDidMove: function _onLayerDidMove(e) {
    var _this$_topLeft;

    var topLeft = this._map.containerPointToLayerPoint([0, 0]);

    if (topLeft.x !== ((_this$_topLeft = this._topLeft) === null || _this$_topLeft === void 0 ? void 0 : _this$_topLeft.x) || topLeft.y !== this._topLeft.y) {
      this._topLeft = topLeft;
      L.DomUtil.setPosition(this._canvas, topLeft);
      this.drawLayer();
    }
  },
  _onLayerDidZoom: function _onLayerDidZoom(e) {
    if (this.props.type !== 'tiledVector') {
      var topLeft = this._map.containerPointToLayerPoint([0, 0]);

      L.DomUtil.setPosition(this._canvas, topLeft);
      this.needRedraw();
    }
  },
  //-------------------------------------------------------------
  getEvents: function getEvents() {
    var events = {
      resize: this._onLayerDidResize,
      moveend: this._onLayerDidMove,
      zoom: this._onLayerDidZoom
    };

    if (this._map.options.zoomAnimation && L.Browser.any3d) {
      events.zoomanim = this._animateZoom;
    }

    return events;
  },
  //-------------------------------------------------------------
  onAdd: function onAdd(map) {
    this._map = map;
    this._canvas = L.DomUtil.create('canvas', 'leaflet-layer');
    this.tiles = {};

    var size = this._map.getSize();

    this._canvas.width = size.x;
    this._canvas.height = size.y;
    var animated = this._map.options.zoomAnimation && L.Browser.any3d;
    L.DomUtil.addClass(this._canvas, 'leaflet-zoom-' + (animated ? 'animated' : 'hide'));

    var topLeft = this._map.containerPointToLayerPoint([0, 0]);

    L.DomUtil.setPosition(this._canvas, topLeft);

    var pane = this._map.getPane(this._paneName);

    if (!pane) {
      pane = this._map.createPane(this._paneName);
      pane.style.zIndex = this._paneZindex;
    }

    pane.appendChild(this._canvas);
    map.on(this.getEvents(), this);
    var del = this._delegate || this;
    del.onLayerDidMount && del.onLayerDidMount(); // -- callback

    this.needRedraw();
  },
  //-------------------------------------------------------------
  onRemove: function onRemove(map) {
    var del = this._delegate || this;
    del.onLayerWillUnmount && del.onLayerWillUnmount(); // -- callback

    if (this._frame) {
      L.Util.cancelAnimFrame(this._frame);
    }

    map.getPane(this._paneName).removeChild(this._canvas);
    map.off(this.getEvents(), this);
    this._canvas = null;
  },
  //------------------------------------------------------------
  addTo: function addTo(map) {
    map.addLayer(this);
    return this;
  },
  // --------------------------------------------------------------------------------
  LatLonToMercator: function LatLonToMercator(latlon) {
    return {
      x: latlon.lng * 6378137 * Math.PI / 180,
      y: Math.log(Math.tan((90 + latlon.lat) * Math.PI / 360)) * 6378137
    };
  },
  //------------------------------------------------------------------------------
  drawLayer: function drawLayer() {
    if (this._map) {
      var size = this._map.getSize();

      var bounds = this._map.getBounds();

      var zoom = this._map.getZoom();

      var center = this.LatLonToMercator(this._map.getCenter());
      var corner = this.LatLonToMercator(this._map.containerPointToLatLng(this._map.getSize()));
      var del = this._delegate || this;
      del.onDrawLayer && del.onDrawLayer({
        layer: this,
        canvas: this._canvas,
        bounds: bounds,
        size: size,
        zoom: zoom,
        center: center,
        corner: corner
      });
      this._frame = null;
    }
  },
  // -- L.DomUtil.setTransform from leaflet 1.0.0 to work on 0.0.7
  //------------------------------------------------------------------------------
  _setTransform: function _setTransform(el, offset, scale) {
    var pos = offset || new L.Point(0, 0);
    el.style[L.DomUtil.TRANSFORM] = (L.Browser.ie3d ? 'translate(' + pos.x + 'px,' + pos.y + 'px)' : 'translate3d(' + pos.x + 'px,' + pos.y + 'px,0)') + (scale ? ' scale(' + scale + ')' : '');
  },
  //------------------------------------------------------------------------------
  _animateZoom: function _animateZoom(e) {
    var scale = this._map.getZoomScale(e.zoom); // -- different calc of animation zoom  in leaflet 1.0.3 thanks @peterkarabinovic, @jduggan1


    var offset = L.Layer ? this._map._latLngBoundsToNewLayerBounds(this._map.getBounds(), e.zoom, e.center).min : this._map._getCenterOffset(e.center)._multiplyBy(-scale).subtract(this._map._getMapPanePos());
    L.DomUtil.setTransform(this._canvas, offset, scale);
  }
});
exports.CanvasLayer = CanvasLayer;

var _default = function _default(options) {
  return new CanvasLayer(options);
};

exports["default"] = _default;