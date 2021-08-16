import {mapConstants} from '@gisatcz/ptr-core';
import {map as mapUtils} from '@gisatcz/ptr-utils';

function getBoxRangeFromZoomLevel(level, width, height) {
	const lowerLevel = Math.floor(level);
	const upperLevel = Math.ceil(level);
	const lowerPxSize = mapUtils.view.getPixelSizeFromZoomLevel(lowerLevel);
	const upperPxSize = mapUtils.view.getPixelSizeFromZoomLevel(upperLevel);
	const pxSize =
		(lowerPxSize - upperPxSize) * (upperLevel - level) + upperPxSize;

	return mapUtils.view.getMapViewportRange(width, height) * pxSize;
}

function getZoomLevelFromBoxRange(boxRange, width, height) {
	return getZoomLevelFromPixelSize(
		(boxRange - 1) / mapUtils.view.getMapViewportRange(width, height)
	);
}

function getZoomLevelFromPixelSize(pxSize) {
	const levels = mapConstants.pixelSizeInLevels;
	let lowerLevel = 0;
	while (pxSize <= levels[lowerLevel + 1] && lowerLevel < levels.length) {
		lowerLevel++;
	}

	const upperLevel = lowerLevel + 1;
	const lowerLevelPxSize = levels[lowerLevel];
	const upperLevelPxSize = levels[upperLevel];

	const level =
		upperLevel -
		(pxSize - upperLevelPxSize) / (lowerLevelPxSize - upperLevelPxSize);

	return level;
}

function getDeckViewFromPantherViewParams(view, width, height) {
	const completeView = {...mapConstants.defaultMapView, ...view};

	return {
		latitude: completeView.center.lat,
		longitude: completeView.center.lon,
		zoom: getZoomLevelFromBoxRange(completeView.boxRange, width, height),
	};
}

export default {
	getBoxRangeFromZoomLevel,
	getDeckViewFromPantherViewParams,
};
