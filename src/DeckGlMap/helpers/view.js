import {mapConstants} from '@gisatcz/ptr-core';
import {map as mapUtils} from '@gisatcz/ptr-utils';

// TODO add tests
/**
 * Return boxRange from zoom level and dimensions
 * @param level {number} Zoom level as decimal number
 * @param width {number} width of viewport in px
 * @param height {number} height of viewport in px
 * @returns {number} Panther's mapView.boxRange in meters
 */
function getBoxRangeFromZoomLevel(level, width, height) {
	level += 1; // TODO add 1 to meet the same view in Deck as in Leaflet
	const lowerLevel = Math.floor(level);
	const upperLevel = Math.ceil(level);
	const lowerPxSize = mapUtils.view.getPixelSizeFromZoomLevel(lowerLevel);
	const upperPxSize = mapUtils.view.getPixelSizeFromZoomLevel(upperLevel);
	const pxSize =
		(lowerPxSize - upperPxSize) * (upperLevel - level) + upperPxSize;

	return mapUtils.view.getMapViewportRange(width, height) * pxSize;
}

/**
 * Return zoom level from boxRange and dimensions
 * @param boxRange {number} Panther's mapView.boxRange in meters
 * @param width {number} width of viewport in px
 * @param height {number} height of viewport in px
 * @returns {number} Zoom level as decimal number
 */
function getZoomLevelFromBoxRange(boxRange, width, height) {
	return getZoomLevelFromPixelSize(
		(boxRange - 1) / mapUtils.view.getMapViewportRange(width, height)
	);
}

/**
 * Return zoom level (decimal number)
 * @param pxSize {number} Size of 1px in meters
 * @returns {number} Zoom level
 */
function getZoomLevelFromPixelSize(pxSize) {
	const levels = mapConstants.pixelSizeInLevels;
	let lowerLevel = 0;
	while (pxSize <= levels[lowerLevel + 1] && lowerLevel < levels.length) {
		lowerLevel++;
	}

	const upperLevel = lowerLevel + 1;
	const lowerLevelPxSize = levels[lowerLevel];
	const upperLevelPxSize = levels[upperLevel];
	if (upperLevel >= levels.length) {
		return lowerLevel;
	} else {
		let level =
			upperLevel -
			(pxSize - upperLevelPxSize) / (lowerLevelPxSize - upperLevelPxSize);

		level -= 1; // TODO remove 1 to meet the same view in Deck as in Leaflet

		return level >= 0 ? level : 0;
	}
}

/**
 * Return DeckGl map view state representation
 * @param view {Object} Panther's map view representation
 * @param width {number} width of viewport in px
 * @param height {number} height of viewport in px
 * @param viewLimits {Object} Panther's map view limits representation
 * @returns {{maxZoom: number, latitude: number, minZoom: number, zoom: number, longitude: number}}
 */
function getDeckViewFromPantherViewParams(view, width, height, viewLimits) {
	const completeView = {...mapConstants.defaultMapView, ...view};

	let minZoom = mapConstants.defaultLevelsRange[0];
	let maxZoom = mapConstants.defaultLevelsRange[1];

	if (viewLimits?.boxRangeRange) {
		if (viewLimits.boxRangeRange[1]) {
			const calculatedMinZoom = getZoomLevelFromBoxRange(
				viewLimits.boxRangeRange[1],
				width,
				height
			);

			if (calculatedMinZoom > minZoom) {
				minZoom = calculatedMinZoom;
			}
		}

		if (viewLimits.boxRangeRange[0]) {
			const calculatedMaxZoom = getZoomLevelFromBoxRange(
				viewLimits.boxRangeRange[0],
				width,
				height
			);

			if (calculatedMaxZoom < maxZoom) {
				maxZoom = calculatedMaxZoom;
			}
		}
	}

	return {
		latitude: completeView.center.lat,
		longitude: completeView.center.lon,
		zoom: getZoomLevelFromBoxRange(completeView.boxRange, width, height),
		minZoom,
		maxZoom,
	};
}

export default {
	getBoxRangeFromZoomLevel,
	getZoomLevelFromBoxRange,
	getZoomLevelFromPixelSize,
	getDeckViewFromPantherViewParams,
};
