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
 * @param center {Object} center point of the shape
 * @param style {Object} Panther style definition
 * @param pixelSizeInMeters {number | null}
 */
function draw(context, center, style, pixelSizeInMeters) {
  // TODO add other shapes
  if (style.shape === 'square') {
    square(context, center, style, pixelSizeInMeters);
  } else {
    circle(context, center, style, pixelSizeInMeters);
  }
}

function square(context, center, style, pixelSizeInMeters) {
  var size = _helpers["default"].getSize(style.size, pixelSizeInMeters);

  var a = 2 * size; // side length

  context.beginPath();
  context.rect(center.x - a / 2, center.y - a / 2, a, a);

  _helpers["default"].setPolygonStyle(context, style);

  context.closePath();
}

function circle(context, center, style, pixelSizeInMeters) {
  context.beginPath();

  var size = _helpers["default"].getSize(style.size, pixelSizeInMeters);

  context.arc(Math.floor(center.x), Math.floor(center.y), size, 0, Math.PI * 2);

  _helpers["default"].setPolygonStyle(context, style);

  context.closePath();
}

var _default = {
  draw: draw
};
exports["default"] = _default;