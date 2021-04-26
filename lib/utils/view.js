"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _lodash = require("lodash");

/**
 * Convert Web World Wind range to Panther boxRange
 * @param range {WorldWind.Navigator.range}
 * @param width {number} map width
 * @param height {number} map height
 * @return {number|*} Panther view box range
 */
function getBoxRangeFromWorldWindRange(range, width, height) {
  if (width && width >= height) {
    return range * height / width;
  } else {
    return range;
  }
}
/**
 * Convert Panther boxRange to Web World Wind range
 * @param boxRange {number} Panther view boxRange
 * @param width {number} map width
 * @param height {number} map height
 * @return {number|*} WorldWind navigator range
 */


function getWorldWindRangeFromBoxRange(boxRange, width, height) {
  if (width && width >= height) {
    return boxRange * width / height;
  } else {
    return boxRange;
  }
}
/**
 * Check if given boxRange is inside defined range. Lower limit is excluded, upper limit is included.
 * @param boxRange {number} map view boxRange
 * @param range {Array} boxRangeRange
 * @return {boolean}
 */


function isBoxRangeInRange(boxRange, range) {
  if ((0, _lodash.isArray)(range)) {
    // both limits defined by number
    var fitsInLimits = boxRange > range[0] && boxRange <= range[1]; // without lower limit

    var noLowerLimitLessThanUpper = !range[0] && boxRange <= range[1]; // without upper limit

    var noUpperLimitMoreThanLower = boxRange > range[0] && !range[1];
    return fitsInLimits || noLowerLimitLessThanUpper || noUpperLimitMoreThanLower;
  } else {
    return false;
  }
}
/**
 * It compares center coordinates with limits. If given center is outside limit, adjusted center will be returned
 * @param center {{lat: number, lon: number}}
 * @param limit {{minLat: number, maxLat: number, minLon: number, maxLon: number}}
 * @return {{lat: number, lon: number}}
 */


function getCenterWhichFitsLimits(center, limit) {
  if (!limit) {
    return center;
  } else {
    var updatedLat = null;
    var updatedLon = null;
    var givenLat = center.lat;
    var givenLon = center.lon;
    var maxLat = limit.maxLat;
    var maxLon = limit.maxLon;
    var minLat = limit.minLat;
    var minLon = limit.minLon;

    if (givenLat >= maxLat) {
      updatedLat = maxLat;
    }

    if (givenLat <= minLat) {
      updatedLat = minLat;
    }

    if (givenLon >= maxLon) {
      updatedLon = maxLon;
    }

    if (givenLon <= minLon) {
      updatedLon = minLon;
    } // Don't mutate, if center fits limits


    if (!updatedLon && !updatedLat) {
      return center;
    } else {
      return {
        lat: updatedLat || center.lat,
        lon: updatedLon || center.lon
      };
    }
  }
}

var _default = {
  getBoxRangeFromWorldWindRange: getBoxRangeFromWorldWindRange,
  getCenterWhichFitsLimits: getCenterWhichFitsLimits,
  getWorldWindRangeFromBoxRange: getWorldWindRangeFromBoxRange,
  isBoxRangeInRange: isBoxRangeInRange
};
exports["default"] = _default;