import {mapConstants} from '@gisatcz/ptr-core';
import {map as mapUtils} from '@gisatcz/ptr-utils';

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

function getPantherViewFromLeafletViewParams(view, width, height) {
	return {
		boxRange: mapUtils.view.getBoxRangeFromZoomLevel(view.zoom, width, height),
		center: {
			lat: view.center.lat,
			lon: view.center.lng,
		},
	};
}

function getLeafletViewportFromViewParams(view, width, height) {
	const leafletView = getLeafletViewFromViewParams(view, width, height);

	return {
		zoom: leafletView.zoom,
		center: [leafletView.center.lat, leafletView.center.lng],
	};
}

function update(map, view, width, height) {
	let stateCenter = map.getCenter();
	let stateZoom = map.getZoom();

	let leafletUpdate = getLeafletViewFromViewParams(view, width, height);

	if (
		stateCenter.lat !== leafletUpdate.center.lat ||
		stateCenter.lng !== leafletUpdate.center.lng ||
		stateZoom !== leafletUpdate.zoom
	) {
		map.setView(
			leafletUpdate.center || stateCenter,
			leafletUpdate.zoom || stateZoom
		);
	}
}

function getLimitedCenter(limits, lat, lon) {
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
	getPantherViewFromLeafletViewParams,
	getLimitedCenter,
	update,
};
