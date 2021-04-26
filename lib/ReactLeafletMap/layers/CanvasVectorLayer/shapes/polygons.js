"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _helpers = _interopRequireDefault(require("./helpers"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

/**
 * Draw shape to the given canvas
 * @param context {Object} canvas context
 * @param coordinates {Array}
 * @param style {Object} Panther style definition
 */
function drawPolygon(context, coordinates, style) {
  context.beginPath();
  coordinates.forEach(function (linearRing) {
    var start = linearRing[0];
    var rest = linearRing.slice(1);
    context.moveTo(Math.floor(start.x), Math.floor(start.y));
    rest.forEach(function (point) {
      context.lineTo(Math.floor(point.x), Math.floor(point.y));
    });
    context.closePath();
  });

  _helpers["default"].setPolygonStyle(context, style);
}

function drawMultiPolygon(context, coordinates, style) {
  coordinates.map(function (polygon) {
    return drawPolygon(context, polygon, style);
  });
}

var _default = {
  drawPolygon: drawPolygon,
  drawMultiPolygon: drawMultiPolygon
};
exports["default"] = _default;