import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {mapConstants} from '@gisatcz/ptr-core';
import {map as mapUtils} from '@gisatcz/ptr-utils';
import PropTypes from 'prop-types';
import {isArray as _isArray, isNumber as _isNumber, isEqual as _isEqual} from 'lodash';
import {MapContainer, MapConsumer, TileLayer} from 'react-leaflet';
import L from 'leaflet';

import viewHelpers from './helpers/view';
import paneHelpers from './helpers/pane';
import projectionHelpers from './helpers/projection';
import constants from '../constants';

import MapViewController from './MapViewController';
import CogLayer from './layers/CogLayer';
import VectorLayer from './layers/VectorLayer';
import WmsLayer from './layers/WmsLayer';
import TileGridLayer from './layers/TileGridLayer';
import MapPane from './MapPane';

const backgroundLayerStartingZindex = constants.defaultLeafletPaneZindex + 1;
const layersStartingZindex = constants.defaultLeafletPaneZindex + 101;

/**
 * Return one or multiple layer as an array (depending on number of data sources)
 * @param mapKey {string}
 * @param backgroundLayer {Object} Panther Layer definition
 * @param crs {string} EPSG:code
 * @returns {(JSX.Element|null)[]}
 */
function getBackgroundLayers(mapKey, backgroundLayer, crs) {
	const backgroundLayersSource = _isArray(backgroundLayer)
		? backgroundLayer
		: [backgroundLayer];
	return (
		backgroundLayersSource &&
		backgroundLayersSource.map((layer, i) =>
			getLayerByType(mapKey, layer, i, crs)
		)
	);
}

/**
 * Return layer by given layer.type
 * @param mapKey {string}
 * @param layer {Object} Panther Layer definition
 * @param layer.type {string} defined type of layer
 * @param i {number} index of layer if there are several data sources for one layer
 * @param zIndex {number}
 * @param crs {string} EPSG:code
 * @param zoom {number}
 * @param onLayerClick {function}
 * @param view {Object} Panther map view
 * @param width {number} map width
 * @param height {number} map width
 * @param resources {Object} additional map resources (e.g. icons)
 * @returns {JSX.Element|null}
 */
function getLayerByType(
	mapKey,
	layer,
	i,
	crs,
	zIndex,
	zoom,
	onLayerClick,
	view,
	width,
	height,
	resources
) {
	if (layer && layer.type) {
		switch (layer.type) {
			case 'wmts':
				return getTileLayer(layer, i);
			case 'wms':
				return getWmsLayer(layer, i, crs);
			case 'cog':
				return getCogLayer(mapKey, layer, i, zIndex);
			case 'vector':
			case 'tiledVector':
			case 'tiled-vector':
				return getVectorLayer(
					mapKey,
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
			case 'tile-grid':
				return getTileGridLayer(layer, i, zIndex, zoom, view);
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
 * @param crs {string} EPSG:code
 * @returns {JSX.Element} WMSTileLayer https://react-leaflet.js.org/docs/api-components/#wmstilelayer
 */
function getWmsLayer(layer, i, crs) {
	const {options, opacity, key} = layer;
	return (
		<WmsLayer
			key={key || i}
			layerKey={key || i}
			options={options}
			opacity={opacity}
			crs={crs}
		/>
	);
}

/**
 * Return Cloud optimized GeoTiff layer
 * @param mapKey {string}
 * @param layer {Object} Panther Layer definition
 * @param i {number} index of layer if the list
 * @param zIndex {number}
 * @returns {JSX.Element}
 */
function getCogLayer(mapKey, layer, i, zIndex) {
	const paneKey = paneHelpers.getKey(mapKey, layer, i);
	return (
		<MapConsumer>
			{map => (
				<CogLayer
					key={layer.key || i}
					layerKey={layer.layerKey || layer.key}
					uniqueLayerKey={layer.key || i}
					paneName={paneKey}
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
 * @param mapKey {string}
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
	mapKey,
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
			mapKey={mapKey}
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

function getTileGridLayer(layer, i, zIndex, zoom, view) {
	return (
		<TileGridLayer
			key={layer.key || i}
			layerKey={layer.layerKey || layer.key}
			uniqueLayerKey={layer.key || i}
			view={view}
			options={layer.options}
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
	debugTileGrid,
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

	const [internalMapState, setInternalMapState] = useState({
		view,
		zoom,
		center,
	});

	// adjust boxRange onMount
	useEffect(() => {
		const calculatedBoxRange = mapUtils.view.getBoxRangeFromZoomLevel(
			zoom,
			width,
			height
		);
		if (calculatedBoxRange !== view.boxRange) {
			if (onViewChange) {
				onViewChange({boxRange: calculatedBoxRange});
			}
		}
	}, []);

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

	const onViewChangeInternal = view => {
		const update = {};

		if (onViewChange && typeof onViewChange === 'function') {
			onViewChange(view);
		}

		if (view.boxRange) {
			const {zoom} =
				viewHelpers.getLeafletViewportFromViewParams(view, width, height);

			update.zoom = zoom;
		}

	
		if (view.center) {
			const {center} =
				viewHelpers.getLeafletViewportFromViewParams(view, width, height);

			update.center = center;
		}

		if(view) {
			update.view = {
				...internalMapState.view,
				...view,
			}
		}

		const newMapState = {
			...internalMapState,
			...(update.view ? {view: update.view} : {}),
			...(update.center ? {center: update.center} : {}),
			...(_isNumber(update.zoom) ? {zoom: update.zoom} : {}),
		}
		setInternalMapState(newMapState);
	};

	let mapLayers =
		layers &&
		layers.map((layer, i) => {
			const paneKey = paneHelpers.getKey(mapKey, layer, i);
			return (
				<MapPane
					name={paneKey}
					key={paneKey}
					zIndex={layersStartingZindex + i}
					map={map}
				>
					{getLayerByType(
						mapKey,
						layer,
						i,
						crs,
						layersStartingZindex + i,
						internalMapState.zoom,
						onMapLayerClick,
						internalMapState.view,
						width,
						height,
						resources
					)}
				</MapPane>
			);
		});


	//
	// Add debug grid layer on under all "layers" or at the top
	//
	if (debugTileGrid) {
		const bottom = debugTileGrid?.bottom;
		const zIndex = bottom ? 0 : (mapLayers?.length || 0) + 1;
		const tileGridLayer = (
			<MapPane
				key={'tilegrid'}
				zIndex={layersStartingZindex + zIndex - 1}
				name={'tilegrid'}
				map={map}
			>
				{getLayerByType(
					mapKey,
					{
						type: 'tile-grid',
						key: 'tilegrid',
						layerKey: 'tilegridlayerkey',
						options: {
							viewport: {
								width: width,
								height: height,
							},
						},
					},
					0,
					crs,
					layersStartingZindex + zIndex - 1,
					internalMapState.zoom,
					null,
					internalMapState.view)}
			</MapPane>
		);

		if (bottom) {
			mapLayers = mapLayers ? [tileGridLayer, ...mapLayers] : [tileGridLayer];
		} else {
			mapLayers = mapLayers ? [...mapLayers, tileGridLayer] : [tileGridLayer];
		}
	}


	return (
		<>
			<MapContainer
				attributionControl={false}
				className="ptr-map ptr-ReactLeafletMap"
				center={internalMapState.center}
				zoom={internalMapState.zoom}
				maxZoom={maxZoom}
				minZoom={minZoom}
				zoomControl={false}
				whenCreated={setMap}
				crs={projectionHelpers.getCRS(crs)}
			>
				<MapPane
					zIndex={backgroundLayerStartingZindex}
					name={paneHelpers.getKey(mapKey, 'backgroundLayers')}
				>
					{getBackgroundLayers(mapKey, backgroundLayer, crs)}
				</MapPane>
				{mapLayers}
			</MapContainer>
			{map ? (
				<MapViewController
					map={map}
					zoom={internalMapState.zoom}
					center={internalMapState.center}
					width={width}
					height={height}
					viewLimits={viewLimits}
					onViewChange={onViewChangeInternal}
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
