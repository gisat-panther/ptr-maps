"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _lodash = require("lodash");

var _helpers = require("@turf/helpers");

var _nearestPoint = _interopRequireDefault(require("@turf/nearest-point"));

var _booleanPointInPolygon = _interopRequireDefault(require("@turf/boolean-point-in-polygon"));

var _ptrCore = require("@gisatcz/ptr-core");

var _helpers2 = _interopRequireDefault(require("../SvgVectorLayer/helpers"));

var _genericCanvasLayer = require("./genericCanvasLayer");

var _shapes = _interopRequireDefault(require("./shapes/shapes"));

var _polygons = _interopRequireDefault(require("./shapes/polygons"));

var _lines = _interopRequireDefault(require("./shapes/lines"));

var L = _interopRequireWildcard(require("leaflet"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var LeafletCanvasLayer = _genericCanvasLayer.CanvasLayer.extend({
  onLayerDidMount: function onLayerDidMount() {
    this.customEvents = {
      click: this.onLayerClick
    };

    this._map.on(this.customEvents, this);
  },
  onLayerWillUnmount: function onLayerWillUnmount() {
    this._map.off(this.customEvents, this);
  },
  boundsToQuery: function boundsToQuery(bounds) {
    return {
      lat: bounds.getSouthWest().lat,
      lng: bounds.getSouthWest().lng,
      width: bounds.getNorthEast().lat - bounds.getSouthWest().lat,
      height: bounds.getNorthEast().lng - bounds.getSouthWest().lng
    };
  },
  isPointInsideBounds: function isPointInsideBounds(lat, lng, bounds) {
    return lat >= bounds.lat && lat <= bounds.lat + bounds.width && lng >= bounds.lng && lng <= bounds.lng + bounds.height;
  },
  onLayerClick: function onLayerClick(e) {
    var _this = this;

    if (this.props.selectable) {
      var pointsInsideBounds = [];
      var selectedPolygons = [];
      var mousePoint = e.containerPoint;
      var self = this; // TODO breakable loop?

      if ((0, _lodash.isArray)(this.features)) {
        this.features.forEach(function (feature) {
          var type = feature.original.geometry.type;

          if (type === 'Point') {
            var radius = feature.defaultStyle.size;
            var LatLngBounds = L.latLngBounds(_this._map.containerPointToLatLng(mousePoint.add(L.point(radius, radius))), _this._map.containerPointToLatLng(mousePoint.subtract(L.point(radius, radius))));

            var BoundingBox = _this.boundsToQuery(LatLngBounds);

            var coordinates = feature.original.geometry.coordinates;
            var lat = coordinates[1];
            var lng = coordinates[0];

            if (self.isPointInsideBounds(lat, lng, BoundingBox)) {
              pointsInsideBounds.push(feature.original);
            }
          } else if (type === 'Polygon' || type === 'MultiPolygon') {
            var point = _this._map.containerPointToLatLng(L.point(mousePoint.x, mousePoint.y));

            var pointFeature = (0, _helpers.point)([point.lng, point.lat]);
            var insidePolygon = (0, _booleanPointInPolygon["default"])(pointFeature, feature.original.geometry);

            if (insidePolygon) {
              selectedPolygons.push(feature);
            }
          }
        }); // select single point

        if (pointsInsideBounds.length) {
          var position = this._map.containerPointToLatLng(mousePoint);

          var nearest = (0, _nearestPoint["default"])((0, _helpers.point)([position.lng, position.lat]), {
            type: 'FeatureCollection',
            features: pointsInsideBounds
          });
          self.props.onClick(self.props.layerKey, [nearest.properties[self.props.fidColumnName]]);
        } else if (selectedPolygons.length) {
          self.props.onClick(self.props.layerKey, [selectedPolygons[0].original.properties[self.props.fidColumnName]]);
        } // TODO select single line

      }
    }
  },
  setProps: function setProps(data) {
    this.props = data;
    this.features = this.prepareFeatures(data.features);
    this.needRedraw();
  },
  prepareFeatures: function prepareFeatures(features) {
    var props = this.props;
    var pointFeatures = [];
    var polygonFeatures = [];
    var lineFeatures = [];
    (0, _lodash.forEach)(features, function (feature) {
      var type = feature && feature.geometry && feature.geometry.type;
      var fid = feature.id || props.fidColumnName && feature.properties[props.fidColumnName];

      var defaultStyle = _helpers2["default"].getDefaultStyleObject(feature, props.style);

      var preparedFeature = {
        original: feature,
        defaultStyle: defaultStyle,
        fid: fid
      };

      if (props.selected && fid) {
        (0, _lodash.forIn)(props.selected, function (selection, key) {
          if (selection.keys && (0, _lodash.includes)(selection.keys, fid)) {
            preparedFeature.selected = true;
            preparedFeature.selectedStyle = _objectSpread(_objectSpread({}, defaultStyle), _helpers2["default"].getSelectedStyleObject(selection.style));
          }
        });
      } // TODO add support for multipoints and multilines


      if (type === 'Point') {
        pointFeatures.push(preparedFeature);
      } else if (type === 'Polygon' || type === 'MultiPolygon') {
        polygonFeatures.push(preparedFeature);
      } else if (type === 'LineString') {
        lineFeatures.push(preparedFeature);
      }
    }); // TODO what if diferrent geometry types in one layer?

    if (pointFeatures.length) {
      return (0, _lodash.orderBy)(pointFeatures, ['defaultStyle.size', 'fid'], ['desc', 'asc']);
    } else if (polygonFeatures.length) {
      if (props.selected) {
        return (0, _lodash.orderBy)(polygonFeatures, ['selected'], ['desc']);
      } else {
        return polygonFeatures;
      }
    } else if (lineFeatures.length) {
      if (props.selected) {
        return (0, _lodash.orderBy)(lineFeatures, ['selected'], ['desc']);
      } else {
        return lineFeatures;
      }
    } else {
      return null;
    }
  },
  onDrawLayer: function onDrawLayer(params) {
    var context = params.canvas.getContext('2d');
    context.clearRect(0, 0, params.canvas.width, params.canvas.height);

    if (this.features) {
      // clear whole layer
      context.drawImage(this.renderOffScreen(params), 0, 0);
    }
  },
  renderOffScreen: function renderOffScreen(params) {
    var pixelSizeInMeters = null;
    var offScreenCanvas = document.createElement('canvas');
    offScreenCanvas.width = params.canvas.width;
    offScreenCanvas.height = params.canvas.height;
    var context = offScreenCanvas.getContext('2d');

    if (!params.layer.props.pointAsMarker) {
      pixelSizeInMeters = _ptrCore.mapConstants.getPixelSizeInLevelsForLatitude(_ptrCore.mapConstants.pixelSizeInLevels, 0)[params.zoom];
    } // redraw all features


    for (var i = 0; i < this.features.length; i++) {
      var _this$props$omittedFe;

      var feature = this.features[i];
      var omitFeature = ((_this$props$omittedFe = this.props.omittedFeatureKeys) === null || _this$props$omittedFe === void 0 ? void 0 : _this$props$omittedFe.length) && (0, _lodash.includes)(this.props.omittedFeatureKeys, feature.fid);

      if (!omitFeature) {
        this.drawFeature(context, params.layer, params.canvas, feature, pixelSizeInMeters);
      }
    }

    return offScreenCanvas;
  },

  /**
   * @param ctx {Object} Canvas context
   * @param layer {Object}
   * @param canvas {Object}
   * @param feature {Object} Feature data
   * @param pixelSizeInMeters {number | null}
   */
  drawFeature: function drawFeature(ctx, layer, canvas, feature, pixelSizeInMeters) {
    var _this2 = this;

    var geometry = feature.original.geometry;
    var type = geometry.type; // TODO multipoints multilines

    if (type === 'Point') {
      var coordinates = geometry.coordinates;

      var center = layer._map.latLngToContainerPoint([coordinates[1], coordinates[0]]);

      if (center.x >= 0 && center.y >= 0 && center.x <= canvas.width && center.y <= canvas.height) {
        var style = feature.defaultStyle;

        if (feature.selected) {
          style = feature.selectedStyle;
        }

        _shapes["default"].draw(ctx, center, style, pixelSizeInMeters);
      }
    } else if (type === 'Polygon' || type === 'MultiPolygon') {
      var _coordinates = null;
      var _style = feature.defaultStyle;

      if (feature.selected) {
        _style = feature.selectedStyle;
      }

      if (type === 'Polygon') {
        _coordinates = this.getPolygonCoordinates(geometry.coordinates, layer);

        _polygons["default"].drawPolygon(ctx, _coordinates, _style);
      } else {
        _coordinates = geometry.coordinates.map(function (polygon) {
          return _this2.getPolygonCoordinates(polygon, layer);
        });

        _polygons["default"].drawMultiPolygon(ctx, _coordinates, _style);
      }
    } else if (type === 'LineString') {
      var _coordinates2 = null;
      var _style2 = feature.defaultStyle;

      if (feature.selected) {
        _style2 = feature.selectedStyle;
      }

      _coordinates2 = this.getLineCoordinates(geometry.coordinates, layer);

      _lines["default"].drawLine(ctx, _coordinates2, _style2);
    }
  },
  getPolygonCoordinates: function getPolygonCoordinates(polygon, layer) {
    var _this3 = this;

    return polygon.map(function (linearRing) {
      return _this3.getLineCoordinates(linearRing, layer);
    });
  },
  getLineCoordinates: function getLineCoordinates(line, layer) {
    return line.map(function (coordinates) {
      // TODO do not add the same points again?
      return layer._map.latLngToContainerPoint([coordinates[1], coordinates[0]]);
    });
  }
});

var _default = LeafletCanvasLayer;
exports["default"] = _default;