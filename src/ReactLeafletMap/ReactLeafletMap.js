import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {mapConstants} from '@gisatcz/ptr-core';
import {map as mapUtils} from '@gisatcz/ptr-utils';
import PropTypes from 'prop-types';
import {isArray as _isArray} from 'lodash';
import {MapContainer, MapConsumer, Pane, TileLayer} from 'react-leaflet';
import L from 'leaflet';

import viewHelpers from './helpers/view';
import constants from '../constants';

import MapViewController from './MapViewController';
import CogLayer from './layers/CogLayer';
import VectorLayer from './layers/VectorLayer';
import WmsLayer from './layers/WmsLayer';

const backgroundLayerStartingZindex = constants.defaultLeafletPaneZindex + 1;
const layersStartingZindex = constants.defaultLeafletPaneZindex + 101;

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
 * @param zIndex {number}
 * @param zoom {number}
 * @param onLayerClick {function}
 * @param view {Object} Panther map view
 * @param width {number} map width
 * @param height {number} map width
 * @param crs {string} EPSG:code
 * @param resources {Object} additional map resources (e.g. icons)
 * @returns {JSX.Element|null}
 */
function getLayerByType(
	layer,
	i,
	zIndex,
	zoom,
	onLayerClick,
	view,
	width,
	height,
	crs,
	resources
) {
	if (layer && layer.type) {
		switch (layer.type) {
			case 'wmts':
				return getTileLayer(layer, i);
			case 'wms':
				return getWmsLayer(layer, i);
			case 'cog':
				return getCogLayer(layer, i, zIndex);
			case 'vector':
			case 'tiledVector':
			case 'tiled-vector':
				return getVectorLayer(
					layer,
					i,
					zIndex,
					zoom,
					onLayerClick,
					view,
					width,
					height,
					crs,
					resources
				);
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
	return <WmsLayer layerKey={key || i} options={options} opacity={opacity} />;
}

/**
 * Return Cloud optimized GeoTiff layer
 * @param layer {Object} Panther Layer definition
 * @param i {number} index of layer if the list
 * @param zIndex {number}
 * @returns {JSX.Element}
 */
function getCogLayer(layer, i, zIndex) {
	return (
		<MapConsumer>
			{map => (
				<CogLayer
					key={layer.key || i}
					layerKey={layer.layerKey || layer.key}
					uniqueLayerKey={layer.key || i}
					paneName={layer.key}
					zIndex={zIndex}
					map={map}
					{...layer}
				/>
			)}
		</MapConsumer>
	);
}

/**
 * Return vector layer
 * @param layer {Object} Panther Layer definition
 * @param i {number} index of layer if the list
 * @param zIndex {number}
 * @param zoom {number}
 * @param onLayerClick {function}
 * @param view {Object} Panther map view
 * @param width {number} map width
 * @param height {number} map width
 * @param crs {string} EPSG:code
 * @param resources {Object} additional map resources (e.g. icons)
 * @returns {JSX.Element}
 */
function getVectorLayer(
	layer,
	i,
	zIndex,
	zoom,
	onLayerClick,
	view,
	width,
	height,
	crs,
	resources
) {
	return (
		<VectorLayer
			key={layer.key || i}
			layerKey={layer.layerKey || layer.key}
			uniqueLayerKey={layer.key || i}
			resources={resources}
			onClick={onLayerClick}
			opacity={layer.opacity || 1}
			options={layer.options}
			type={layer.type}
			view={view}
			width={width}
			height={height}
			crs={crs}
			zoom={zoom}
			zIndex={zIndex}
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
 * Custom hook executed once on mount
 */
function useFixTileGap() {
	useEffect(() => {
		// Hack for ugly 1px tile borders in Chrome
		// Version of Leaflet package in dependencies should match version used by react-leaflet
		let originalInitTile = L.GridLayer.prototype._initTile;
		L.GridLayer.include({
			_initTile: function (tile) {
				originalInitTile.call(this, tile);
				const tileSize = this.getTileSize();
				tile.style.width = tileSize.x + 1 + 'px';
				tile.style.height = tileSize.y + 1 + 'px';
			},
		});
	}, []);
}

/**
 * Custom hook invalidating map instance internal size if component size changed
 * @param map {L.Map}
 * @param width {number} width of the map component
 * @param height {number} width of the map component
 */
function useInvalidateMapInstanceSize(map, width, height) {
	useEffect(() => {
		map && map.invalidateSize();
	}, [map, width, height]);
}

/**
 * Get minZoom and maxZoom
 * @param width {number} width of the map component
 * @param height {number} width of the map component
 * @param viewLimits {Object} Panther view limits
 * @returns {[maxZoom, minZoom]}
 */
function getZoomLimits(width, height, viewLimits) {
	let minZoom = mapConstants.defaultLevelsRange[0];
	let maxZoom = mapConstants.defaultLevelsRange[1];
	if (viewLimits?.boxRangeRange) {
		if (viewLimits.boxRangeRange[1]) {
			minZoom = mapUtils.view.getZoomLevelFromBoxRange(
				viewLimits.boxRangeRange[1],
				width,
				height
			);
		}

		if (viewLimits.boxRangeRange[0]) {
			maxZoom = mapUtils.view.getZoomLevelFromBoxRange(
				viewLimits.boxRangeRange[0],
				width,
				height
			);
		}
	}

	return [maxZoom, minZoom];
}

const ReactLeafletMap = ({
	backgroundLayer,
	crs,
	height,
	layers,
	mapKey,
	resources,
	view,
	viewLimits,
	width,
	onClick,
	onLayerClick,
	onViewChange,
}) => {
	const [map, setMap] = useState(null);
	const {zoom, center} = viewHelpers.getLeafletViewportFromViewParams(
		view,
		width,
		height
	);

	// Custom hooks
	useFixTileGap();
	useMapClick(map, onClick, width, height);
	useInvalidateMapInstanceSize(map, width, height);

	// Callbacks
	const onMapLayerClick = useCallback(
		(layerKey, featureKeys) => {
			if (onLayerClick) {
				onLayerClick(mapKey, layerKey, featureKeys);
			}
		},
		[mapKey, onLayerClick]
	);

	// Memos
	const [maxZoom, minZoom] = useMemo(
		() => getZoomLimits(width, height, viewLimits),
		[width, height, viewLimits]
	);

	let mapLayers =
		layers &&
		layers.map((layer, i) => (
			<Pane
				name={layer.key}
				key={layer.key || i}
				style={{zIndex: layersStartingZindex + i}}
			>
				{getLayerByType(
					layer,
					i,
					layersStartingZindex + i,
					zoom,
					onMapLayerClick,
					view,
					width,
					height,
					crs,
					resources
				)}
			</Pane>
		));

	return (
		<>
			<MapContainer
				attributionControl={false}
				className="ptr-map ptr-ReactLeafletMap"
				center={center}
				zoom={zoom}
				maxZoom={maxZoom}
				minZoom={minZoom}
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
	crs: PropTypes.string,
	height: PropTypes.number,
	layers: PropTypes.array,
	mapKey: PropTypes.string,
	resources: PropTypes.object,
	view: PropTypes.object,
	viewLimits: PropTypes.object,
	width: PropTypes.number,

	onClick: PropTypes.func,
	onLayerClick: PropTypes.func,
	onViewChange: PropTypes.func,
};

export default ReactLeafletMap;
