import React, {useCallback, useEffect} from 'react';
import PropTypes from 'prop-types';
import {map as mapUtils} from '@gisatcz/ptr-utils';

const MapViewController = ({
	map,
	zoom,
	center,
	width,
	height,
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
		const currentCenter = map.getCenter();
		const {lat: currentLat, lng: currentLon} = currentCenter;

		if (onViewChange && (currentLat !== lat || currentLon !== lon)) {
			onViewChange({center: {lat: currentLat, lon: currentLon}});
		}
	}, [map, lat, lon]);

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
	width: PropTypes.number,
	zoom: PropTypes.number,

	onViewChange: PropTypes.func,
};

export default MapViewController;
