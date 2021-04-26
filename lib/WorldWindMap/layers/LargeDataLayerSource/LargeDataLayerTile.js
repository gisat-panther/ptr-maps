"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _ptrUtils = require("@gisatcz/ptr-utils");

var _lodash = require("lodash");

var _canvasShapes = _interopRequireDefault(require("./canvasShapes"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var LargeDataLayerTile = /*#__PURE__*/function () {
  function LargeDataLayerTile(data, options, style, fidColumnName, selected, hovered) {
    _classCallCheck(this, LargeDataLayerTile);

    this._data = data;
    this._style = style;
    this._fidColumnName = fidColumnName;
    this._hovered = hovered; // todo here?

    if (this._hovered && this._hovered.keys) {
      this._hoveredStyle = _ptrUtils.mapStyle.getStyleObject(null, this._hovered.style, true); // todo add default
    }

    if (selected && !(0, _lodash.isEmpty)(selected)) {
      var sel = [];
      (0, _lodash.forIn)(selected, function (selectedDef) {
        if (selectedDef && !(0, _lodash.isEmpty)(selectedDef)) {
          sel.push({
            keys: selectedDef.keys,
            style: _ptrUtils.mapStyle.getStyleObject(null, selectedDef.style, true) // todo add default

          });
        }
      });
      this._selected = sel.length ? sel : null;
    }

    this._sector = options.sector;
    this._canvas = this.createCanvas(options.width, options.height);
    this._width = options.width;
    this._height = options.height;
    var tileCenterLatitude = (this._sector.maxLatitude + this._sector.minLatitude) * (Math.PI / 180) / 2;
    this._latitudeFactor = 1 / Math.cos(Math.abs(tileCenterLatitude));
  }
  /**
   * Returns the drawn HeatMapTile in the form of URL.
   * @return {String} Data URL of the tile.
   */


  _createClass(LargeDataLayerTile, [{
    key: "url",
    value: function url() {
      return this.draw().toDataURL();
    }
    /**
     * Returns the whole Canvas. It is then possible to use further. This one is actually used in the
     * HeatMapLayer mechanism so if you want to provide some custom implementation of Canvas creation in your tile,
     * change this method.
     * @return {HTMLCanvasElement} Canvas Element representing the drawn tile.
     */

  }, {
    key: "canvas",
    value: function canvas() {
      return this.draw();
    }
    /**
     * Draws the shapes on the canvas.
     * @returns {HTMLCanvasElement}
     */

  }, {
    key: "draw",
    value: function draw() {
      var _this = this;

      var ctx = this._canvas.getContext('2d');

      var hovered = [];
      var selected = [];

      for (var i = 0; i < this._data.length; i++) {
        var dataPoint = this._data[i];
        var attributes = dataPoint.data;
        var isHovered = this.isHovered(attributes);
        var isSelected = this.isSelected(attributes);

        if (isSelected) {
          selected.push(dataPoint);
        } else if (isHovered) {
          hovered.push(dataPoint);
        } else {
          this.shape(ctx, dataPoint);
        }
      } // draw hovered


      hovered.forEach(function (dataPoint) {
        _this.shape(ctx, dataPoint, true);
      }); // draw selected

      selected.forEach(function (dataPoint) {
        _this.shape(ctx, dataPoint, false, true);
      });
      return this._canvas;
    }
  }, {
    key: "isHovered",
    value: function isHovered(attributes) {
      if (this._hovered && this._hovered.keys) {
        return this._hovered.keys.indexOf(attributes[this._fidColumnName]) !== -1;
      }
    }
  }, {
    key: "isSelected",
    value: function isSelected(attributes) {
      var _this2 = this;

      var isSelected = false;

      if (this._selected) {
        this._selected.forEach(function (selection) {
          var selected = selection.keys.indexOf(attributes[_this2._fidColumnName]) !== -1;

          if (selected) {
            isSelected = true;
          }
        });
      }

      return isSelected;
    }
  }, {
    key: "shape",
    value: function shape(context, data, hovered, selected) {
      var _this3 = this;

      var attributes = data.data;

      var style = _ptrUtils.mapStyle.getStyleObject(attributes, this._style); // apply hovered style, if feature is hovered


      if (hovered) {
        style = _objectSpread(_objectSpread({}, style), this._hoveredStyle);
      } // TODO optimize looping through selections two times
      // apply selected style, if feature is selected


      if (selected) {
        this._selected.forEach(function (selection) {
          var selected = selection.keys.indexOf(attributes[_this3._fidColumnName]) !== -1;

          if (selected) {
            style = _objectSpread(_objectSpread({}, style), selection.style);
          }
        });
      }

      if (style.shape) {
        if (style.shape === 'circle-with-arrow') {
          this.circleWithArrow(context, data, style);
        } else if (style.shape === 'circle') {
          this.point(context, data, style);
        } else if (style.shape === 'square') {
          this.square(context, data, style);
        } else if (style.shape === 'diamond') {
          this.diamond(context, data, style);
        } else if (style.shape === 'triangle') {
          this.triangle(context, data, style);
        } else {
          this.point(context, data, style);
        }
      } else {
        this.point(context, data, style);
      }
    }
  }, {
    key: "point",
    value: function point(context, data, style) {
      var radius = this.getSize(style) / 2;
      var center = this.getCenterCoordinates(data);
      var cy = radius;
      var cx = radius * this._latitudeFactor;

      _canvasShapes["default"].ellipse(context, center[0], center[1], cx, cy, style);
    }
  }, {
    key: "square",
    value: function square(context, data, style) {
      var size = this.getSize(style);
      var center = this.getCenterCoordinates(data);
      var dx = size * this._latitudeFactor;

      _canvasShapes["default"].rectangle(context, center[0] - dx / 2, center[1] - size / 2, dx, size, style);
    }
  }, {
    key: "diamond",
    value: function diamond(context, data, style) {
      var edgeLength = this.getSize(style);
      var diagonalLength = Math.sqrt(2) * edgeLength; // center coordinates

      var center = this.getCenterCoordinates(data);
      var dx = diagonalLength * this._latitudeFactor;
      var nodes = [[center[0] - dx / 2, center[1]], [center[0], center[1] - diagonalLength / 2], [center[0] + dx / 2, center[1]], [center[0], center[1] + diagonalLength / 2], [center[0] - dx / 2, center[1]]];

      _canvasShapes["default"].path(context, nodes, style);
    }
  }, {
    key: "triangle",
    value: function triangle(context, data, style) {
      var edgeLength = this.getSize(style);
      var ty = Math.sqrt(Math.pow(edgeLength, 2) - Math.pow(edgeLength / 2, 2)); // center coordinates

      var center = this.getCenterCoordinates(data);
      var dx = edgeLength * this._latitudeFactor;
      var nodes = [[center[0] - dx / 2, center[1] + ty / 3], [center[0], center[1] - 2 * ty / 3], [center[0] + dx / 2, center[1] + ty / 3], [center[0] - dx / 2, center[1] + ty / 3]];

      _canvasShapes["default"].path(context, nodes, style);
    }
  }, {
    key: "circleWithArrow",
    value: function circleWithArrow(context, data, style) {
      var radius = this.getSize(style) / 2;
      var direction = style.arrowDirection || 1;
      var center = this.getCenterCoordinates(data);
      var ry = radius;
      var rx = radius * this._latitudeFactor;

      _canvasShapes["default"].ellipse(context, center[0], center[1], rx, ry, style);

      var x0 = center[0] + direction * rx;
      var y0 = center[1];
      var x1 = x0 + direction * style.arrowLength;
      var y1 = y0;

      _canvasShapes["default"].arrow(context, x0, y0, x1, y1, style.arrowColor, style.arrowWidth);
    }
  }, {
    key: "getSize",
    value: function getSize(style) {
      if (style.size) {
        return style.size;
      } else if (style.volume) {
        if (style.shape === 'triangle') {
          return Math.sqrt(style.volume / 2);
        } else if (style.shape === 'square' || style.shape === 'diamond') {
          return Math.sqrt(style.volume);
        } else {
          return Math.sqrt(style.volume / Math.PI);
        }
      } else {
        return _ptrUtils.mapStyle.DEFAULT_SIZE;
      }
    }
  }, {
    key: "getCenterCoordinates",
    value: function getCenterCoordinates(data) {
      return [this.longitudeInSector(data, this._sector, this._width), this._height - this.latitudeInSector(data, this._sector, this._height)];
    }
    /**
     * Creates canvas element of given size.
     * @protected
     * @param width {Number} Width of the canvas in pixels
     * @param height {Number} Height of the canvas in pixels
     * @returns {HTMLCanvasElement} Created the canvas
     */

  }, {
    key: "createCanvas",
    value: function createCanvas(width, height) {
      var canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      return canvas;
    }
    /**
     * Calculates position in pixels of the point based on its latitude.
     * @param dataPoint {Object} Location to transform
     * @param sector {Sector} Sector to which transform
     * @param height {Number} Height of the tile to draw to.
     * @private
     * @returns {Number} Position on the height in pixels.
     */

  }, {
    key: "latitudeInSector",
    value: function latitudeInSector(dataPoint, sector, height) {
      var sizeOfArea = sector.maxLatitude - sector.minLatitude;
      var locationInArea = dataPoint.y - 90 - sector.minLatitude;
      return Math.ceil(locationInArea / sizeOfArea * height);
    }
    /**
     * Calculates position in pixels of the point based on its longitude.
     * @param dataPoint {Object} Location to transform
     * @param sector {Sector} Sector to which transform
     * @param width {Number} Width of the tile to draw to.
     * @private
     * @returns {Number} Position on the width in pixels.
     */

  }, {
    key: "longitudeInSector",
    value: function longitudeInSector(dataPoint, sector, width) {
      var sizeOfArea = sector.maxLongitude - sector.minLongitude;
      var locationInArea = dataPoint.x - 180 - sector.minLongitude;
      return Math.ceil(locationInArea / sizeOfArea * width);
    }
  }]);

  return LargeDataLayerTile;
}();

var _default = LargeDataLayerTile;
exports["default"] = _default;