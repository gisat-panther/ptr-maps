import constants from './constants';

// TODO naive
/**
 * Convert box range to zoom level
 * @param view {Object}
 * @return {number} zoom level
 */
function getZoomLevelFromView(view) {
	let coeff = (constants.zoomCoefficient*Math.abs(Math.cos(Math.PI/180)));
	let zoomLevel = Math.floor(Math.log(view.boxRange/coeff) / Math.log(2));

	if (zoomLevel > constants.numberOfLevels) {
		zoomLevel = constants.numberOfLevels;
	}

	return constants.numberOfLevels - zoomLevel;
}

function getBoxRangeFromZoomLevel(level) {
	let coeff = (constants.zoomCoefficient*Math.abs(Math.cos(Math.PI/180)));
	return coeff*Math.pow(2, constants.numberOfLevels - level);
}

export default {
	getBoxRangeFromZoomLevel,
	getZoomLevelFromView
}