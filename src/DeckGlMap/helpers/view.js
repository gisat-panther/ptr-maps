import chroma from 'chroma-js';
import {mapConstants} from '@gisatcz/ptr-core';
import {map as mapUtils} from '@gisatcz/ptr-utils';

// TODO add tests
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

	return (
		upperLevel -
		(pxSize - upperLevelPxSize) / (lowerLevelPxSize - upperLevelPxSize)
	);
}

function getDeckViewFromPantherViewParams(view, width, height, viewLimits) {
	const completeView = {...mapConstants.defaultMapView, ...view};

	let minZoom = mapConstants.defaultLevelsRange[0];
	let maxZoom = mapConstants.defaultLevelsRange[1];

	if (viewLimits?.boxRangeRange) {
		if (viewLimits.boxRangeRange[1]) {
			minZoom = getZoomLevelFromBoxRange(
				viewLimits.boxRangeRange[1],
				width,
				height
			);
		}

		if (viewLimits.boxRangeRange[0]) {
			maxZoom = getZoomLevelFromBoxRange(
				viewLimits.boxRangeRange[0],
				width,
				height
			);
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
	getDeckViewFromPantherViewParams,
};
