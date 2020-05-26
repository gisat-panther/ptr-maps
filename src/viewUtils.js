import constants from './constants';

// TODO naive
/**
 * Convert box range to zoom level
 * @param view {Object}
 * @return {number} zoom level
 */
function getZoomLevelFromView(view) {
	let zoomLevel = Math.floor(Math.log(view.boxRange/constants.zoomCoefficient) / Math.log(2));

	if (zoomLevel > constants.numberOfLevels) {
		zoomLevel = constants.numberOfLevels;
	}

	return constants.numberOfLevels - zoomLevel;
}

function getBoxRangeFromZoomLevel(level) {
	return constants.zoomCoefficient*Math.pow(2, constants.numberOfLevels - level);
}

function getDefaultBoxRangeLimitsForLevelBasedMap(){
	return [getBoxRangeFromZoomLevel(constants.defaultLevelsRange[1]), getBoxRangeFromZoomLevel(constants.defaultLevelsRange[0])];
}

export default {
	getBoxRangeFromZoomLevel,
	getDefaultBoxRangeLimitsForLevelBasedMap,
	getZoomLevelFromView
}