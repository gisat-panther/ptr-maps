"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

/**
 * Round one viewport dimension (width or height)
 * @param dimension {number} original dimension (width or height)
 * @return {number} Rounded dimension
 */
var roundDimension = function roundDimension(dimension) {
  return Math.ceil(dimension);
};

var _default = {
  roundDimension: roundDimension
};
exports["default"] = _default;