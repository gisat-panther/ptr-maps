import constants from "../constants";

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
 * @param boxRange {number} Panther view boxRange
 * @param width {number} map width
 * @param height {number} map height
 * @return {number} Zoom level
 */
function getZoomLevelFromBoxRange(boxRange, width, height) {
    // remove 1 from box range to prevent rounding issues
    return getZoomLevelFromPixelSize((boxRange - 1)/Math.min(width, height));
}

/**
 * @param level {number} zoom level
 * @return {number} Size of 1 px in meters
 */
function getPixelSizeFromZoomLevel(level) {
    return constants.pixelSizeInLevels[level];
}

/**
 * Calculate zoom level from pixel size in meters. It returns next lower (or the lowest) level
 * @param pxSize {number} pixel size in meters
 * @return {number} Zoom level
 */
function getZoomLevelFromPixelSize(pxSize) {
    const levels = constants.pixelSizeInLevels;

    let level = 0;
    while (pxSize <= levels[level + 1] && level < levels.length) {
        level++;
    }
    return level;
}

export default {
    getBoxRangeFromWorldWindRange,
    getBoxRangeFromZoomLevel,
    getPixelSizeFromZoomLevel,
    getWorldWindRangeFromBoxRange,
    getZoomLevelFromBoxRange,
    getZoomLevelFromPixelSize,
}