"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _react = _interopRequireDefault(require("react"));

var _webworldwindEsa = _interopRequireDefault(require("webworldwind-esa"));

var _jsQuadtree = require("js-quadtree");

var _helpers = require("@turf/helpers");

var _nearestPoint = _interopRequireDefault(require("@turf/nearest-point"));

var _centroid = _interopRequireDefault(require("@turf/centroid"));

var _LargeDataLayerTile = _interopRequireDefault(require("./LargeDataLayerTile"));

var _lodash = require("lodash");

var _ptrUtils = require("@gisatcz/ptr-utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

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

var Location = _webworldwindEsa["default"].Location,
    REDRAW_EVENT_TYPE = _webworldwindEsa["default"].REDRAW_EVENT_TYPE,
    Sector = _webworldwindEsa["default"].Sector,
    SurfaceCircle = _webworldwindEsa["default"].SurfaceCircle,
    TiledImageLayer = _webworldwindEsa["default"].TiledImageLayer; // It supports GeoJSON as format with only points and maximum 1 000 000 points.
// Multipolygons are represented as points
// TODO: Highlight the selected points.

var LargeDataLayer = /*#__PURE__*/function (_TiledImageLayer) {
  _inherits(LargeDataLayer, _TiledImageLayer);

  var _super = _createSuper(LargeDataLayer);

  function LargeDataLayer(wwd, options, layer) {
    var _this;

    _classCallCheck(this, LargeDataLayer);

    _this = _super.call(this, new Sector(-90, 90, -180, 180), new Location(45, 45), 18, 'image/png', layer.key, 256, 256);
    _this.tileWidth = 256;
    _this.tileHeight = 256;
    _this.detailControl = 1;
    _this.wwd = wwd; // At the moment the URL must contain the GeoJSON.

    _this.processedTiles = {};
    _this.quadTree = new _jsQuadtree.QuadTree(new _jsQuadtree.Box(0, 0, 360, 180));
    _this.pantherProps = {
      features: options.features,
      fidColumnName: options.fidColumnName,
      hovered: _objectSpread({}, options.hovered),
      selected: _objectSpread({}, options.selected),
      key: layer.key,
      layerKey: layer.layerKey,
      onHover: options.onHover,
      onClick: options.onClick,
      pointHoverBuffer: options.pointHoverBuffer || _ptrUtils.mapStyle.DEFAULT_SIZE,
      style: options.style,
      wwd: wwd
    };

    if (_this.pantherProps.features) {
      _this.addFeatures(_this.pantherProps.features);
    } else {
      _this.loadData(options.url);
    }

    _this.onClick = _this.onClick.bind(_assertThisInitialized(_this), wwd);
    _this.onMouseMove = _this.onMouseMove.bind(_assertThisInitialized(_this), wwd);
    wwd.addEventListener('click', _this.onClick);
    wwd.addEventListener('mousemove', _this.onMouseMove);
    return _this;
  }

  _createClass(LargeDataLayer, [{
    key: "removeListeners",
    value: function removeListeners() {
      this.pantherProps.wwd.removeEventListener('click', this.onClick);
      this.pantherProps.wwd.removeEventListener('mousemove', this.onMouseMove);
    }
  }, {
    key: "loadData",
    value: function loadData(url) {
      var _this2 = this;

      fetch(url).then(function (data) {
        return data.json();
      }).then(function (file) {
        if (file.features.length > 1000000) {
          throw new Error('Too many features.');
        }

        _this2.addFeatures(file.features);
      });
    }
  }, {
    key: "addFeatures",
    value: function addFeatures(features) {
      var _this3 = this;

      features.forEach(function (feature) {
        var type = feature.geometry && feature.geometry.type;
        var point = null;

        var props = _objectSpread({}, feature.properties); // TODO support other geometry types


        if (type === 'Point') {
          props.centroid = feature.geometry.coordinates;
          point = new _jsQuadtree.Point(feature.geometry.coordinates[0] + 180, feature.geometry.coordinates[1] + 90, props);
        } else if (type === 'MultiPoint') {
          var coordinates = feature.geometry.coordinates[0];
          props.centroid = coordinates;
          point = new _jsQuadtree.Point(coordinates[0] + 180, coordinates[1] + 90, props);
        } else if (type === 'MultiPolygon') {
          var centroid = (0, _centroid["default"])(feature.geometry);
          props.centroid = centroid.geometry.coordinates;
          point = new _jsQuadtree.Point(centroid.geometry.coordinates[0] + 180, centroid.geometry.coordinates[1] + 90, props);
        }

        if (point) {
          _this3.quadTree.insert(point);
        }
      });
      this.refresh();
    }
  }, {
    key: "handleEvent",
    value: function handleEvent(wwd, event) {
      var x = event.touches && event.touches[0] && event.touches[0].clientX || event.clientX,
          y = event.touches && event.touches[0] && event.touches[0].clientY || event.clientY;
      var pageX = event.touches && event.touches[0] && event.touches[0].pageX || event.pageX;
      var pageY = event.touches && event.touches[0] && event.touches[0].pageY || event.pageY;
      var terrainObject = wwd.pickTerrain(wwd.canvasCoordinates(x, y)).terrainObject();
      var buffer = this.getPointHoverBuffer(wwd);

      if (terrainObject) {
        var position = terrainObject.position;
        var points = this.quadTree.query(new _jsQuadtree.Circle(position.longitude + 180, position.latitude + 90, buffer)); // find nearest

        if (points.length > 1) {
          var targetPoint = (0, _helpers.point)([position.longitude, position.latitude]);
          var features = points.map(function (point) {
            return (0, _helpers.point)([point.data.centroid[0], point.data.centroid[1]], _objectSpread({}, point));
          });
          var featureCollection = (0, _helpers.featureCollection)(features);
          var nearest = (0, _nearestPoint["default"])(targetPoint, featureCollection);
          points = [nearest.properties];
        }

        return {
          points: points,
          x: pageX,
          y: pageY
        };
      } else {
        return {
          points: [],
          x: pageX,
          y: pageY
        };
      }
    }
  }, {
    key: "onMouseMove",
    value: function onMouseMove(wwd, event) {
      this.onMouseMoveResult(this.handleEvent(wwd, event));
    }
  }, {
    key: "onClick",
    value: function onClick(wwd, event) {
      this.onClickResult(this.handleEvent(wwd, event));
    }
  }, {
    key: "onClickResult",
    value: function onClickResult(data) {
      var _this4 = this;

      if (this.pantherProps.onClick) {
        var gids = data.points.map(function (point) {
          return point.data[_this4.pantherProps.fidColumnName];
        });

        if (gids && gids.length) {
          this.pantherProps.onClick(this.pantherProps.layerKey, gids);
        }
      }
    }
  }, {
    key: "onMouseMoveResult",
    value: function onMouseMoveResult(data) {
      var _this5 = this;

      if (this.pantherProps.onHover) {
        var gids = (0, _lodash.compact)(data.points.map(function (point) {
          return point.data[_this5.pantherProps.fidColumnName];
        }));
        this.pantherProps.onHover(this.pantherProps.layerKey, gids, data.x, data.y, null, data.points, this.pantherProps.fidColumnName);
      }
    }
  }, {
    key: "retrieveTileImage",
    value: function retrieveTileImage(dc, tile, suppressRedraw) {
      this.processedTiles[tile.imagePath] = true;
      var sector = tile.sector;
      var extended = this.calculateExtendedSector(sector, 0.2, 0.2);
      var points = this.filterGeographically(extended.sector);

      if (points) {
        var imagePath = tile.imagePath,
            cache = dc.gpuResourceCache,
            layer = this;
        var canvas = this.createPointTile(points, {
          sector: sector,
          width: this.tileWidth,
          height: this.tileHeight
        }).canvas();
        var texture = layer.createTexture(dc, tile, canvas);
        layer.removeFromCurrentRetrievals(imagePath);

        if (texture) {
          cache.putResource(imagePath, texture, texture.size);
          layer.currentTilesInvalid = true;
          layer.absentResourceList.unmarkResourceAbsent(imagePath);

          if (!suppressRedraw) {
            // Send an event to request a redraw.
            var e = document.createEvent('Event');
            e.initEvent(REDRAW_EVENT_TYPE, true, true);
            window.dispatchEvent(e);
          }
        }
      }
    } // TODO Original implementation from @jbalhar
    // retrieveTileImage(dc, tile, suppressRedraw) {
    // 	// if(tile.level.levelNumber < 14 || this.processedTiles[tile.imagePath]){
    // 	// 	return;
    // 	// }
    // 	this.processedTiles[tile.imagePath] = true;
    //
    // 	const sector = tile.sector;
    // 	const extended = this.calculateExtendedSector(sector, 0.2, 0.2);
    // 	const extendedWidth = Math.ceil(extended.extensionFactorWidth * this.tileWidth);
    // 	const extendedHeight = Math.ceil(extended.extensionFactorHeight * this.tileHeight);
    //
    // 	const points = this.filterGeographically(extended.sector);
    //
    // 	if(points) {
    // 		var imagePath = tile.imagePath,
    // 			cache = dc.gpuResourceCache,
    // 			layer = this;
    //
    // 		var canvas = this.createPointTile(points, {
    // 			sector: extended.sector,
    //
    // 			width: this.tileWidth + 2 * extendedWidth,
    // 			height: this.tileHeight + 2 * extendedHeight
    // 		}).canvas();
    //
    // 		var result = document.createElement('canvas');
    // 		result.height = this.tileHeight;
    // 		result.width = this.tileWidth;
    // 		result.getContext('2d').putImageData(
    // 			canvas.getContext('2d').getImageData(extendedWidth, extendedHeight, this.tileWidth, this.tileHeight),
    // 			0, 0
    // 		);
    //
    // 		var texture = layer.createTexture(dc, tile, result);
    // 		layer.removeFromCurrentRetrievals(imagePath);
    //
    // 		if (texture) {
    // 			cache.putResource(imagePath, texture, texture.size);
    //
    // 			layer.currentTilesInvalid = true;
    // 			layer.absentResourceList.unmarkResourceAbsent(imagePath);
    //
    // 			if (!suppressRedraw) {
    // 				// Send an event to request a redraw.
    // 				const e = document.createEvent('Event');
    // 				e.initEvent(REDRAW_EVENT_TYPE, true, true);
    // 				window.dispatchEvent(e);
    // 			}
    // 		}
    // 	}
    // }

  }, {
    key: "filterGeographically",
    value: function filterGeographically(sector) {
      var width = sector.maxLongitude - sector.minLongitude;
      var height = sector.maxLatitude - sector.minLatitude;
      return this.quadTree.query(new _jsQuadtree.Box(sector.minLongitude + 180, sector.minLatitude + 90, width, height));
    }
  }, {
    key: "calculateExtendedSector",
    value: function calculateExtendedSector(sector, extensionFactorWidth, extensionFactorHeight) {
      var latitudeChange = (sector.maxLatitude - sector.minLatitude) * extensionFactorHeight;
      var longitudeChange = (sector.maxLongitude - sector.minLongitude) * extensionFactorWidth;
      return {
        sector: new Sector(sector.minLatitude - latitudeChange, sector.maxLatitude + latitudeChange, sector.minLongitude - longitudeChange, sector.maxLongitude + longitudeChange),
        extensionFactorHeight: extensionFactorHeight,
        extensionFactorWidth: extensionFactorWidth
      };
    }
  }, {
    key: "createPointTile",
    value: function createPointTile(data, options) {
      return new _LargeDataLayerTile["default"](data, options, this.pantherProps.style, this.pantherProps.fidColumnName, this.pantherProps.selected, this.pantherProps.hovered);
    }
  }, {
    key: "updateHoveredKeys",
    value: function updateHoveredKeys(hoveredKeys, x, y) {
      var _this6 = this;

      this.pantherProps.hovered.keys = hoveredKeys;
      var terrainObject = this.wwd.pickTerrain(this.wwd.canvasCoordinates(x, y)).terrainObject();

      if (terrainObject) {
        var lat = terrainObject.position.latitude;
        var lon = terrainObject.position.longitude;
        (0, _lodash.each)(this.currentTiles, function (tile) {
          var s = tile.sector;
          var prev = _this6.previousHoveredCoordinates;
          var latDiff = Math.abs(s.maxLatitude - s.minLatitude);
          var lonDiff = Math.abs(s.maxLongitude - s.minLongitude);
          var latBuffer = latDiff / 10;
          var lonBuffer = lonDiff / 10;
          var hovered = lat <= s.maxLatitude + latBuffer && lat >= s.minLatitude - latBuffer && lon <= s.maxLongitude + lonBuffer && lon >= s.minLongitude - lonBuffer;
          var previouslyHovered = prev && prev.lat <= s.maxLatitude + latBuffer && prev.lat >= s.minLatitude - latBuffer && prev.lon <= s.maxLongitude + lonBuffer && prev.lon >= s.minLongitude - lonBuffer;

          if (hovered || previouslyHovered) {
            _this6.retrieveTileImage(_this6.wwd.drawContext, tile, true);
          }
        });
        this.previousHoveredCoordinates = {
          lat: lat,
          lon: lon
        };
      }
    }
    /**
     * naive point hover buffer determination
     * @param wwd
     * @return {number} buffer in degrees
     */

  }, {
    key: "getPointHoverBuffer",
    value: function getPointHoverBuffer(wwd) {
      var canvasWidth = wwd.canvas.clientWidth;
      var range = wwd.navigator.range;
      var bufferInMeters = range / canvasWidth * this.pantherProps.pointHoverBuffer;
      return bufferInMeters * 0.00001;
    }
  }]);

  return LargeDataLayer;
}(TiledImageLayer);

var _default = LargeDataLayer;
exports["default"] = _default;