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


export default {
    getBoxRangeFromWorldWindRange,
    getWorldWindRangeFromBoxRange,
}