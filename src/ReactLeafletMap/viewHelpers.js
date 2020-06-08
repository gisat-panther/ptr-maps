import viewUtils from '../utils/view';

const defaultView = {
	center: {
		lat: 50,
		lng: 15
	},
	zoom: 12
};

function getLeafletViewFromViewParams(view, width, height) {
	let leafletView = {...defaultView};

	if (view) {
		if (view.center) {
			if (view.center.lat || view.center.lat === 0) {
				leafletView.center.lat = view.center.lat;
			}

			if (view.center.lon || view.center.lon === 0) {
				leafletView.center.lng = view.center.lon;
			}
		}

		if (view.boxRange) {
			leafletView.zoom = viewUtils.getZoomLevelFromBoxRange(view.boxRange, width, height);
		}
	}

	return leafletView;
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