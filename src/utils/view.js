import {mapConstants} from "@gisatcz/ptr-core";

/**
 * Convert Web World Wind range to Panther boxRange
 * @param range {WorldWind.Navigator.range}
 * @param width {number} map width
 * @param height {number} map height
 * @return {number|*} Panther view box range
 */
function getBoxRangeFromWorldWindRange(range, width, height) {
    if (width && width >= height) {
        return range * height/width;
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
        return boxRange * width/height;
    } else {
        return boxRange;
    }
}

/**
 * @param level {number} zoom level
 * @param width {number} map width
 * @param height {number} map height
 * @return {number} Panther box range
 */
function getBoxRangeFromZoomLevel(level, width, height) {
    // remove 1 from box range to prevent rounding issues
    return (Math.min(width, height) * getPixelSizeFromZoomLevel(level)) - 1;
}

/**
 * @param level {number} zoom level
 * @return {number} Size of 1 px in meters
 */
function getPixelSizeFromZoomLevel(level) {
    return mapConstants.pixelSizeInLevels[level];
}

export default {
    getBoxRangeFromWorldWindRange,
    getBoxRangeFromZoomLevel,
    getPixelSizeFromZoomLevel,
    getWorldWindRangeFromBoxRange,
}