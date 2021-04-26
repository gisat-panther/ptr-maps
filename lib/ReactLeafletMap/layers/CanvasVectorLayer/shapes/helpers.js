"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _chromaJs = _interopRequireDefault(require("chroma-js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function setPolygonStyle(context, style) {
  if (style.fill) {
    context.fillStyle = style.fill;

    if (style.fillOpacity) {
      context.fillStyle = (0, _chromaJs["default"])(style.fill).alpha(style.fillOpacity).hex();
    }

    context.fill();
  }

  if (style.outlineColor && style.outlineWidth) {
    context.lineWidth = style.outlineWidth;
    context.strokeStyle = style.outlineColor;

    if (style.outlineOpacity) {
      context.strokeStyle = (0, _chromaJs["default"])(style.outlineColor).alpha(style.outlineOpacity).hex();
    }

    context.lineJoin = 'round';
    context.stroke();
  }
}

function setLineStyle(context, style) {
  if (style.outlineColor && style.outlineWidth) {
    context.lineWidth = style.outlineWidth;
    context.strokeStyle = style.outlineColor;

    if (style.outlineOpacity) {
      context.strokeStyle = (0, _chromaJs["default"])(style.outlineColor).alpha(style.outlineOpacity).hex();
    }

    context.lineJoin = 'round';
    context.lineCap = 'round';
    context.stroke();
  }
}

function getSize(definedSize, pixelSizeInMeters) {
  var size = pixelSizeInMeters ? definedSize / pixelSizeInMeters : definedSize;
  return size < 0.5 ? 0.5 : size;
}

var _default = {
  setLineStyle: setLineStyle,
  setPolygonStyle: setPolygonStyle,
  getSize: getSize
};
exports["default"] = _default;