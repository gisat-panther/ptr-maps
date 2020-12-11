import _ from 'lodash';

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
 * Check if given boxRange is inside defined range. Lower limit is excluded, upper limit is included.
 * @param boxRange {number} map view boxRange
 * @param range {Array} boxRangeRange
 * @return {boolean}
 */
function isBoxRangeInRange(boxRange, range) {
	if (_.isArray(range)) {
		// both limits defined by number
		const fitsInLimits = boxRange > range[0] && boxRange <= range[1];

		// without lower limit
		const noLowerLimitLessThanUpper = !range[0] && boxRange <= range[1];

		// without upper limit
		const noUpperLimitMoreThanLower = boxRange > range[0] && !range[1];

		return fitsInLimits || noLowerLimitLessThanUpper || noUpperLimitMoreThanLower;
	} else {
		return false;
	}
}


export default {
    getBoxRangeFromWorldWindRange,
    getWorldWindRangeFromBoxRange,
	isBoxRangeInRange
}