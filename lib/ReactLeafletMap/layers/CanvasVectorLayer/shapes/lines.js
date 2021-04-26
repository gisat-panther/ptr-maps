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
function drawLine(context, coordinates, style) {
  context.beginPath();
  var start = coordinates[0];
  var rest = coordinates.slice(1);
  context.moveTo(Math.floor(start.x), Math.floor(start.y));
  rest.forEach(function (point) {
    context.lineTo(Math.floor(point.x), Math.floor(point.y));
  });

  _helpers["default"].setLineStyle(context, style);
}

var _default = {
  drawLine: drawLine
};
exports["default"] = _default;