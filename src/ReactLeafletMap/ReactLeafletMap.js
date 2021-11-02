import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {mapConstants} from '@gisatcz/ptr-core';
import PropTypes from 'prop-types';
import {isArray as _isArray} from 'lodash';
import {MapContainer, Pane, TileLayer} from 'react-leaflet';

import viewHelpers from './helpers/view';
import constants from '../constants';

import MapViewController from './MapViewController';
import viewport from '../utils/viewport';

/**
 * Return one or multiple layer as an array (depending on number of data sources)
 * @param backgroundLayer {Object} Panther Layer definition
 * @returns {(JSX.Element|null)[]}
 */
function getBackgroundLayers(backgroundLayer) {
	const backgroundLayersSource = _isArray(backgroundLayer)
		? backgroundLayer
		: [backgroundLayer];
	return (
		backgroundLayersSource &&
		backgroundLayersSource.map((layer, i) => getLayerByType(layer, i))
	);
}

/**
 * Return layer by given layer.type
 * @param layer {Object} Panther Layer definition
 * @param layer.type {string} defined type of layer
 * @param i {number} index of layer if there are several data sources for one layer
 * @param zIndex
 * @param zoom
 * @returns {JSX.Element|null}
 */
function getLayerByType(layer, i, zIndex, zoom) {
	if (layer && layer.type) {
		switch (layer.type) {
			case 'wmts':
				return getTileLayer(layer, i);
			default:
				return null;
		}
	} else {
		return null;
	}
}

/**
 * Return TileLayer
 * @param layer {Object} Panther Layer definition
 * @param i {number} index of layer if there are several data sources for one layer
 * @returns {JSX.Element} TileLayer https://react-leaflet.js.org/docs/api-components/#tilelayer
 */
function getTileLayer(layer, i) {
	let {url, ...restOptions} = layer.options;

	// fix for backward compatibility
	if (layer.options.urls) {
		url = layer.options.urls[0];
	}

	return (
		<TileLayer
			key={layer.key || i}
			url={url}
			{...restOptions}
			maxZoom={mapConstants.defaultLevelsRange[1]}
		/>
	);
}

/**
 * Custom hook which handles click in map
 * @param map {L.Map}
 * @param onClick {function} on click callback
 * @param width {number} width of the map component
 * @param height {number} width of the map component
 */
function useMapClick(map, onClick, width, height) {
	const onMapClick = useCallback(() => {
		if (onClick) {
			const view = viewHelpers.getPantherViewFromLeafletViewParams(
				{
					zoom: map.getZoom(),
					center: map.getCenter(),
				},
				width,
				height
			);
			onClick(view);
		}
	}, [map, onClick, width, height]);

	useEffect(() => {
		map && map.on('click', onMapClick);
		return () => {
			map && map.off('click', onMapClick);
		};
	}, [map, onMapClick]);
}

/**
 * Custom hook which call actions when map was resized
 * @param map {L.Map}
 * @param onResize {function} on resize callback
 * @param width {number} width of the map component
 * @param height {number} width of the map component
 */
function useResize(map, onResize, width, height) {
	useEffect(() => {
		map && map.invalidateSize();
		if (onResize) {
			setTimeout(() => {
				onResize(
					viewport.roundDimension(width),
					viewport.roundDimension(height)
				);
			}, 10);
		}
	}, [map, onResize, width, height]);
}

const ReactLeafletMap = ({
	backgroundLayer,
	height,
	mapKey,
	view,
	width,
	onClick,
	onResize,
	onViewChange,
}) => {
	const [map, setMap] = useState(null);
	const {zoom, center} = viewHelpers.getLeafletViewportFromViewParams(
		view,
		width,
		height
	);

	useMapClick(map, onClick, width, height);
	useResize(map, onResize, width, height);

	return (
		<>
			<MapContainer
				attributionControl={false}
				className="ptr-map ptr-ReactLeafletMap"
				center={center}
				zoom={zoom}
				zoomControl={false}
				whenCreated={setMap}
			>
				<Pane
					style={{zIndex: constants.defaultLeafletPaneZindex + 101}}
					name="backgroundLayers"
				>
					{getBackgroundLayers(backgroundLayer)}
				</Pane>
			</MapContainer>
			{map ? (
				<MapViewController
					map={map}
					zoom={zoom}
					center={center}
					width={width}
					height={height}
					onViewChange={onViewChange}
				/>
			) : null}
		</>
	);
};

ReactLeafletMap.propTypes = {
	backgroundLayer: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
	height: PropTypes.number,
	mapKey: PropTypes.string,
	view: PropTypes.object,
	width: PropTypes.number,

	onClick: PropTypes.func,
	onResize: PropTypes.func,
	onViewChange: PropTypes.func,
};

export default ReactLeafletMap;
