import React, {useCallback, useEffect} from 'react';
import PropTypes from 'prop-types';
import {map as mapUtils} from '@gisatcz/ptr-utils';

const MapViewController = ({
	map,
	mapKey,
	zoom,
	center,
	width,
	height,
	onViewChange,
}) => {
	const [lat, lon] = center;

	useEffect(() => {
		const currentZoom = map.getZoom();
		const currentCenter = map.getCenter();
		const {lat: currentLat, lng: currentLon} = currentCenter;

		if (lat !== currentLat || lon !== currentLon || zoom !== currentZoom) {
			console.log(mapKey, 'view changed from outside');
			const zoomToSet = currentZoom !== zoom ? zoom : currentZoom;
			map.setView({lat, lng: lon}, zoomToSet);
		}
	}, [zoom, lat, lon]);

	const onZoom = useCallback(() => {
		const currentZoom = map.getZoom();
		if (onViewChange && currentZoom !== zoom) {
			const currentCenter = map.getCenter();
			console.log(mapKey, 'onZoom', 'center', currentCenter);
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
	}, [map, zoom]);

	const onMove = useCallback(() => {
		const currentCenter = map.getCenter();
		const {lat: currentLat, lng: currentLon} = currentCenter;

		if (onViewChange && (currentLat !== lat || currentLon !== lon)) {
			console.log(mapKey, 'onMove', 'center', currentCenter);
			onViewChange({center: {lat: currentLat, lon: currentLon}});
		}
	}, [map, center]);

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
	onViewChange: PropTypes.func,
	map: PropTypes.object,
	width: PropTypes.number,
	zoom: PropTypes.number,
};

export default MapViewController;
