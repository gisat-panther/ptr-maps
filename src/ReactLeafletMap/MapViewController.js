import {useCallback, useEffect} from 'react';
import PropTypes from 'prop-types';
import {map as mapUtils} from '@gisatcz/ptr-utils';
import viewHelpers from './helpers/view';

const MapViewController = ({
	map,
	zoom,
	center,
	width,
	height,
	viewLimits,
	onViewChange,
}) => {
	const [lat, lon] = center;

	// if there is a change of map view props (outside of the map component), apply it only if it differs from the current map view
	useEffect(() => {
		const currentZoom = map.getZoom();
		const currentCenter = map.getCenter();
		const {lat: currentLat, lng: currentLon} = currentCenter;

		if (lat !== currentLat || lon !== currentLon || zoom !== currentZoom) {
			const zoomToSet = currentZoom !== zoom ? zoom : currentZoom;
			// TODO pass animation options as props
			map.setView({lat, lng: lon}, zoomToSet, {
				zoom: {animate: false},
				pan: {animate: false},
			});
		}
	}, [map, zoom, lat, lon]);

	// Call onViewChange if there was change in map zoom (e.g. by mouse wheel). It almost always takes place together with a change of position.
	const onZoom = useCallback(() => {
		const currentZoom = map.getZoom();
		if (onViewChange && currentZoom !== zoom) {
			const currentCenter = map.getCenter();
			const boxRange = mapUtils.view.getBoxRangeFromZoomLevel(
				currentZoom,
				width,
				height
			);
			onViewChange({
				boxRange,
				center: {lat: currentCenter.lat, lon: currentCenter.lng},
			});
		}
	}, [map, zoom, width, height]);

	// Call onViewChange if there was change in map center (e.g. by map dragging)
	const onMove = useCallback(() => {
		// get current map center
		const currentCenter = map.getCenter();
		let {lat: currentLat, lng: currentLon} = currentCenter;

		// check if current map center fits limits
		if (viewLimits?.center) {
			let centerChanged;
			const {lat: limitedLat, lon: limitedLon} =
				viewHelpers.getCenterWhichFitsLimits(
					viewLimits.center,
					currentLat,
					currentLon
				);
			if (currentLat !== limitedLat) {
				currentLat = limitedLat;
				centerChanged = true;
			}
			if (currentLon !== limitedLon) {
				currentLon = limitedLon;
				centerChanged = true;
			}

			// if current map center is out of limits, adjust it
			if (centerChanged) {
				const currentZoom = map.getZoom();
				map.setView({lat: currentLat, lng: currentLon}, currentZoom);
			}
		}

		// call onViewChange if current map center is different from center props
		if (onViewChange && (currentLat !== lat || currentLon !== lon)) {
			const currentZoom = map.getZoom();
			const boxRange = mapUtils.view.getBoxRangeFromZoomLevel(
				currentZoom,
				width,
				height
			);
			onViewChange({center: {lat: currentLat, lon: currentLon}, boxRange});
		}
	}, [map, zoom, width, height, lat, lon]);

	useEffect(() => {
		map.on('zoomend', onZoom);
		map.on('moveend', onMove);
		return () => {
			map.off('zoomend', onZoom);
			map.off('moveend', onMove);
		};
	}, [map, onZoom, onMove]);

	return null;
};

MapViewController.propTypes = {
	center: PropTypes.array,
	height: PropTypes.number,
	map: PropTypes.object,
	viewLimits: PropTypes.object,
	width: PropTypes.number,
	zoom: PropTypes.number,

	onViewChange: PropTypes.func,
};

export default MapViewController;
