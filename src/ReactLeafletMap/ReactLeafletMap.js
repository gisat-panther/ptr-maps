import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {mapConstants} from '@gisatcz/ptr-core';
import PropTypes from 'prop-types';
import {isArray as _isArray} from 'lodash';
import {MapContainer, Pane, TileLayer, WMSTileLayer} from 'react-leaflet';
import L from 'leaflet';
import Proj from 'proj4leaflet';

import viewHelpers from './helpers/view';
import constants from '../constants';

import MapViewController from './MapViewController';

const backgroundLayerStartingZindex = constants.defaultLeafletPaneZindex + 1;
const layersStartingZindex = constants.defaultLeafletPaneZindex + 101;

/**
 * Get Proj CRS definition
 * @param code {string} EPSG:code
 * @returns {Proj.CRS|*}
 */
function getCRS(code) {
	switch (code) {
		case 'EPSG:4326':
			return L.CRS.EPSG4326;
		case 'EPSG:5514':
			return new Proj.CRS('EPSG:5514', constants.projDefinitions.epsg5514, {
				resolutions: [
					102400, 51200, 25600, 12800, 6400, 3200, 1600, 800, 400, 200, 100, 50,
					25, 12.5, 6.25, 3.125, 1.5625, 0.78125, 0.390625,
				],
			});
		default:
			return L.CRS.EPSG3857;
	}
}

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
			case 'wms':
				return getWmsLayer(layer, i);
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
 * @param i {number} index of layer if the list
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
 * Return WMS layer
 * @param layer {Object} Panther Layer definition
 * @param i {number} index of layer if the list
 * @returns {JSX.Element} WMSTileLayer https://react-leaflet.js.org/docs/api-components/#wmstilelayer
 */
function getWmsLayer(layer, i) {
	const {options, opacity, key} = layer;

	const layers = options?.params?.layers || '';
	const crs = options?.params?.crs ? getCRS(options.params.crs) : null;
	const imageFormat = options?.params?.imageFormat || 'image/png';
	const reservedParamsKeys = [
		'layers',
		'crs',
		'imageFormat',
		'pane',
		'maxZoom',
		'styles',
	];
	const restParameters =
		(options?.params &&
			Object.entries(options.params).reduce((acc, [key, value]) => {
				if (reservedParamsKeys.includes(key)) {
					return acc;
				} else {
					acc[key] = value;
					return acc;
				}
			}, {})) ||
		{};

	return (
		<WMSTileLayer
			key={key || i}
			url={options.url}
			crs={crs}
			// singleTile={o.singleTile === true} TODO single tile layer
			params={{
				layers: layers,
				opacity: opacity >= 0 ? opacity : 1,
				transparent: true,
				format: imageFormat,
				...restParameters,
			}}
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

const ReactLeafletMap = ({
	backgroundLayer,
	height,
	layers,
	mapKey,
	view,
	width,
	onClick,
	onViewChange,
}) => {
	const [map, setMap] = useState(null);
	const {zoom, center} = viewHelpers.getLeafletViewportFromViewParams(
		view,
		width,
		height
	);

	useMapClick(map, onClick, width, height);

	let mapLayers =
		layers &&
		layers.map((layer, i) => (
			<Pane
				name={layer.key}
				key={layer.key || i}
				style={{zIndex: layersStartingZindex + i}}
			>
				{getLayerByType(layer, i, layersStartingZindex + i, zoom)}
			</Pane>
		));

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
					style={{zIndex: backgroundLayerStartingZindex}}
					name="backgroundLayers"
				>
					{getBackgroundLayers(backgroundLayer)}
				</Pane>
				{mapLayers}
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
	layers: PropTypes.array,
	mapKey: PropTypes.string,
	view: PropTypes.object,
	width: PropTypes.number,

	onClick: PropTypes.func,
	onViewChange: PropTypes.func,
};

export default ReactLeafletMap;
