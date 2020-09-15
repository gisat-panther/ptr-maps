import {mapConstants} from '@gisatcz/ptr-core';
import {map as mapUtils} from '@gisatcz/ptr-utils';

function getLeafletViewFromViewParams(view, width, height) {
	const completeView = {...mapConstants.defaultMapView, ...view}

	return {
		zoom: mapUtils.view.getZoomLevelFromBoxRange(completeView.boxRange, width, height),
		center: {
			lat: completeView.center.lat,
			lng: completeView.center.lon
		}
	};
}

function getLeafletViewportFromViewParams(view, width, height) {
	const leafletView = getLeafletViewFromViewParams(view, width, height);

	return {
		zoom: leafletView.zoom,
		center: [leafletView.center.lat, leafletView.center.lng]
	};
}

function update(map, view, width, height) {
	let stateCenter = map.getCenter();
	let stateZoom = map.getZoom();

	let leafletUpdate = getLeafletViewFromViewParams(view, width, height);

	if (stateCenter.lat !== leafletUpdate.center.lat || stateCenter.lng !== leafletUpdate.center.lng || stateZoom !== leafletUpdate.zoom){
		map.setView(leafletUpdate.center || stateCenter, leafletUpdate.zoom || stateZoom);
	}
}

export default {
	getLeafletViewportFromViewParams,
	update
}