import {mapConstants} from '@gisatcz/ptr-core';
import {map as mapUtils} from '@gisatcz/ptr-utils';

/**
 * Get map view used in Leaflet from Panther view parameters
 * @param view {Object} Panther map view
 * @param width {number} width of map in px
 * @param height {number} height of map in px
 * @returns {{center: {lng: number, lat: number}, zoom: number}}
 */
function getLeafletViewFromViewParams(view, width, height) {
	const completeView = {...mapConstants.defaultMapView, ...view};

	return {
		zoom: mapUtils.view.getZoomLevelFromBoxRange(
			completeView.boxRange,
			width,
			height
		),
		center: {
			lat: completeView.center.lat,
			lng: completeView.center.lon,
		},
	};
}

/**
 * @param view {Object} Panther map view
 * @param width {number} width of map in px
 * @param height {number} height of map in px
 * @returns {{center: number[], zoom: number}}
 */
function getLeafletViewportFromViewParams(view, width, height) {
	const leafletView = getLeafletViewFromViewParams(view, width, height);

	return {
		zoom: leafletView.zoom,
		center: [leafletView.center.lat, leafletView.center.lng],
	};
}

/**
 * Get Panther map view from parameters used in Leaflet
 * @param view {Object} Leaflet map view
 * @param width {number} width of map in px
 * @param height {number} height of map in px
 * @returns {{center: {lon, lat}, boxRange: number}} Panther map view
 */
function getPantherViewFromLeafletViewParams(view, width, height) {
	return {
		boxRange: mapUtils.view.getBoxRangeFromZoomLevel(view.zoom, width, height),
		center: {
			lat: view.center.lat,
			lon: view.center.lng,
		},
	};
}

/**
 * Get center which fits view limits
 * @param limits {Object} Center limits
 * @param lat {number}
 * @param lon {number}
 * @returns {{lon, lat}} Center which fits limits
 */
function getCenterWhichFitsLimits(limits, lat, lon) {
	let limitedCenter = {lat, lon};
	const {minLat, maxLat, minLon, maxLon} = limits;

	if (lat > maxLat) {
		limitedCenter.lat = maxLat;
	} else if (lat < minLat) {
		limitedCenter.lat = minLat;
	}

	if (lon > maxLon) {
		limitedCenter.lon = maxLon;
	} else if (lon < minLon) {
		limitedCenter.lon = minLon;
	}

	return limitedCenter;
}

export default {
	getLeafletViewportFromViewParams,
	getLeafletViewFromViewParams,
	getPantherViewFromLeafletViewParams,
	getCenterWhichFitsLimits,
};
