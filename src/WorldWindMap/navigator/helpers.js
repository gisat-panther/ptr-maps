import viewUtils from '../../utils/view';

function getChangedViewParams(prev, next) {
	let changed = {};

	// check for boxRange change, disregard if change is too small
	if (
		prev.boxRange !== next.boxRange &&
		Math.abs(prev.boxRange - next.boxRange) > 1
	) {
		changed.boxRange = next.boxRange;
	}

	if (prev.heading !== next.heading) {
		changed.heading = next.heading;
	}

	if (prev.tilt !== next.tilt) {
		changed.tilt = next.tilt;
	}

	if (prev.roll !== next.roll) {
		changed.roll = next.roll;
	}

	if (
		prev.center.lat !== next.center.lat ||
		prev.center.lon !== next.center.lon
	) {
		changed.center = {
			lat: next.center.lat,
			lon: next.center.lon,
		};
	}

	return changed;
}

/**
 * Update navigator of given World Window
 * @param wwd {WorldWindow}
 * @param view {Object}
 */
function update(wwd, view, width, height) {
	let state = wwd.navigator;
	let wwdUpdate = getWorldWindNavigatorFromViewParams(view, width, height);

	let shouldRedraw = false;

	if (wwdUpdate.range && state.range !== wwdUpdate.range) {
		state.range = wwdUpdate.range;
		shouldRedraw = true;
	}

	if (
		(wwdUpdate.tilt || wwdUpdate.tilt === 0) &&
		state.tilt !== wwdUpdate.tilt
	) {
		state.tilt = wwdUpdate.tilt;
		shouldRedraw = true;
	}

	if (
		(wwdUpdate.roll || wwdUpdate.roll === 0) &&
		state.roll !== wwdUpdate.roll
	) {
		state.roll = wwdUpdate.roll;
		shouldRedraw = true;
	}

	if (
		(wwdUpdate.heading || wwdUpdate.heading === 0) &&
		state.heading !== wwdUpdate.heading
	) {
		state.heading = wwdUpdate.heading;
		shouldRedraw = true;
	}

	if (
		wwdUpdate.lookAtLocation &&
		(wwdUpdate.lookAtLocation.latitude ||
			wwdUpdate.lookAtLocation.latitude === 0) &&
		state.lookAtLocation.latitude !== wwdUpdate.lookAtLocation.latitude
	) {
		state.lookAtLocation.latitude = wwdUpdate.lookAtLocation.latitude;
		shouldRedraw = true;
	}

	if (
		wwdUpdate.lookAtLocation &&
		(wwdUpdate.lookAtLocation.longitude ||
			wwdUpdate.lookAtLocation.longitude === 0) &&
		state.lookAtLocation.longitude !== wwdUpdate.lookAtLocation.longitude
	) {
		state.lookAtLocation.longitude = wwdUpdate.lookAtLocation.longitude;
		shouldRedraw = true;
	}

	// if (wwd.verticalExaggeration && wwdUpdate.elevation && wwd.verticalExaggeration !== wwdUpdate.elevation){
	// 	wwd.verticalExaggeration = wwdUpdate.elevation;
	// 	shouldRedraw = true;
	// }

	if (shouldRedraw) {
		wwd.redraw();
	}
}

/**
 * Convert view to World Wind Navigator params
 * @param view {Object}
 * @returns {WorldWind.Navigator}
 */
function getWorldWindNavigatorFromViewParams(view, width, height) {
	let {center, boxRange, ...navigator} = view;

	if (boxRange) {
		navigator.range = viewUtils.getWorldWindRangeFromBoxRange(
			boxRange,
			width,
			height
		);
	}

	if (center) {
		navigator.lookAtLocation = {};
		if (center.lat || center.lat === 0) {
			navigator.lookAtLocation.latitude = center.lat;
		}
		if (center.lon || center.lon === 0) {
			navigator.lookAtLocation.longitude = center.lon;
		}
	}

	return navigator;
}

function getViewParamsFromWorldWindNavigator(navigator, width, height) {
	let view = {};
	let {lookAtLocation, range} = navigator;

	if (range) {
		view.boxRange = viewUtils.getBoxRangeFromWorldWindRange(
			range,
			width,
			height
		);
	}

	if (lookAtLocation) {
		view.center = {};
		if (lookAtLocation.latitude) {
			view.center.lat = lookAtLocation.latitude;
		}
		if (lookAtLocation.longitude) {
			view.center.lon = lookAtLocation.longitude;
		}
	}

	if (navigator.heading || navigator.heading === 0) {
		view.heading = navigator.heading;
	}

	if (navigator.tilt || navigator.tilt === 0) {
		view.tilt = navigator.tilt;
	}

	if (navigator.roll || navigator.roll === 0) {
		view.roll = navigator.roll;
	}

	return view;
}

export default {
	getChangedViewParams,
	getViewParamsFromWorldWindNavigator,
	update,
};
