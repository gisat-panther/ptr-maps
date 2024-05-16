import {useCallback, useRef, useState} from 'react';
import PropTypes from 'prop-types';
import {isArray as _isArray, isEmpty as _isEmpty} from 'lodash';
import ReactResizeDetector from 'react-resize-detector';
import DeckGL from '@deck.gl/react';
import {Layer, MapView} from '@deck.gl/core';
import {mapConstants} from '@gisatcz/ptr-core';
import viewport from '../utils/viewport';
import viewHelpers from './helpers/view';
import styleHelpers from './helpers/style';
import TiledLayer from './layers/TiledLayer';
import VectorLayer from './layers/VectorLayer';
import MVTLayer from './layers/MVTLayer';
import WmsLayer from './layers/WmsLayer';
import {_WMSLayer as SingleTileWmsLayer} from '@deck.gl/geo-layers';
import {_TerrainExtension as TerrainExtension} from '@deck.gl/extensions';
import geolib from '@gisatcz/deckgl-geolib';

import './style.scss';
import DeckTooltip from './DeckTooltip';

const CogBitmapLayer = geolib.CogBitmapLayer;
const CogTerrainLayer = geolib.CogTerrainLayer;

const defaultGetCursor = ({isDragging}) => (isDragging ? 'grabbing' : 'grab');

const DeckGlMap = ({
	activeSelectionKey,
	getCursor,
	onResize,
	onViewChange,
	onZoomEnd,
	onPanEnd,
	viewLimits,
	view,
	onClick = () => {},
	onHover = () => {},
	onLayerClick,
	mapKey,
	backgroundLayer,
	layers,
	Tooltip,
	tooltipProps,
	controller,
}) => {
	const deckRef = useRef();

	const prevViewRef = useRef(null);
	const nextViewRef = useRef(null);
	const zoomingTimeoutRef = useRef(null);

	// Array of [minAltitude, maxAltitude] which are used for terrain layer
	const zRangeRef = useRef(null);

	const [box, setBox] = useState({width: null, height: null});
	const [stateView, setStateView] = useState();
	const [tooltipData, setTooltipData] = useState({
		vector: [],
		raster: [],
		event: null,
	});

	const onAfterRender = useCallback(() => {
		const lastRenderedLayers =
			deckRef?.current?.deck?.layerManager?._lastRenderedLayers;

		lastRenderedLayers?.forEach(l => {
			const zRange = l?.state.zRange;
			if (
				(zRange !== null &&
					zRange !== undefined &&
					zRangeRef.current === null) ||
				zRange?.[0] < zRangeRef.current?.[0] ||
				zRange?.[1] + 100 > zRangeRef.current?.[1]
			) {
				// save maximum and minimum zRange from layers rendered layers
				// add "safety coefficient" to prevent zRange from going out of bounds in some layers (like MVT)
				zRangeRef.current = [zRange[0], zRange[1] + 100];
			}
		});
	});

	const onMapHover = useCallback(
		event => {
			if (deckRef?.current?.pickMultipleObjects) {
				const hoveredItems = deckRef?.current?.pickMultipleObjects(event);
				const vectorHoveredItems = [];
				const rasterHoveredItems = [];
				hoveredItems.forEach(item => {
					if (
						item.layer instanceof VectorLayer ||
						item.layer.displayTooltip === true
					) {
						//add to vector items
						vectorHoveredItems.push(item);
					} else if (item.layer instanceof WmsLayer) {
						//add to raster items
						const {device} = item.layer.context;
						const image =
							item?.tile?.layers?.[0]?.props?.tile?.layers?.[0]?.props?.image;
						item.pixelColor = device.readPixelsToArrayWebGL(image, {
							sourceX: event?.bitmap?.pixel?.[0],
							sourceY: event?.bitmap?.pixel?.[1],
							sourceWidth: 1,
							sourceHeight: 1,
						});
						rasterHoveredItems.push(item);
					}
				});

				if (Tooltip) {
					setTooltipData({
						vector: vectorHoveredItems,
						raster: rasterHoveredItems,
						event,
					});
				}

				if (typeof onHover === 'function') {
					onHover({
						vector: vectorHoveredItems,
						raster: rasterHoveredItems,
						event,
					});
				}
			}
		},
		[deckRef.current]
	);

	const getViewChange = (prevView, nextView) => {
		let change = {};

		if (prevView && prevView.zoom !== nextView.zoom) {
			change.boxRange = viewHelpers.getBoxRangeFromZoomLevel(
				nextView.zoom,
				box.width,
				box.height
			);
		}

		if (
			prevView &&
			(prevView.longitude !== nextView.longitude ||
				prevView.latitude !== nextView.latitude)
		) {
			change.center = {
				lat: nextView.latitude,
				lon: nextView.longitude,
			};
		}

		if (prevView && prevView.bearing !== nextView.bearing) {
			change.bearing = nextView.bearing;
		}

		if (prevView && prevView.pitch !== nextView.pitch) {
			change.pitch = nextView.pitch;
		}
		return change;
	};

	const onViewStateChange = views => {
		const prevView = views.oldViewState;
		const nextView = views.viewState;

		if (views.interactionState.isZooming) {
			prevViewRef.current = prevView;
			nextViewRef.current = nextView;
			window.clearTimeout(zoomingTimeoutRef.current);
			zoomingTimeoutRef.current = window.setTimeout(() => {
				if (typeof onZoomEnd === 'function') {
					const change = getViewChange(prevView, nextView);
					onZoomEnd(change);
				}
			}, 100);
		}

		// Type of transition
		// views.interactionState.inTransition
		const change = getViewChange(prevView, nextView);
		if (!_isEmpty(change)) {
			if (onViewChange) {
				onViewChange(change);
			}
			// just presentational map
			else {
				setStateView({...view, ...stateView, ...change});
			}
		}
	};

	/**
	 * @param width {number}
	 * @param height {number}
	 */
	const onResizeHandler = useCallback((width, height) => {
		const updateHeight = viewport.roundDimension(height);
		const updateWidth = viewport.roundDimension(width);

		if (onResize) {
			onResize(updateWidth, updateHeight);
		}
		setBox({
			width: updateWidth,
			height: updateHeight,
		});
	});

	/**
	 * @param layerKey {string}
	 * @param featureKeys {Array}
	 * @param position {{x: Number, y: Number}}
	 */
	const onVectorLayerClick = (layerKey, featureKeys, position, object) => {
		if (onLayerClick) {
			onLayerClick(mapKey, layerKey, featureKeys, position, object);
		}
	};

	/**
	 * @param layerKey {string}
	 * @param info {Object}
	 * @param event {Object}
	 */
	const onRasterLayerClick = (layerKey, info, event) => {
		if (onLayerClick) {
			onLayerClick(
				mapKey,
				layerKey,
				null,
				{x: info.x, y: info.y},
				{event, info}
			);
		}
	};

	/**
	 * Return tiled (WMTS) layer
	 * @param layer {Object} layer data
	 * @returns {TiledLayer}
	 */
	const getTileLayer = layer => {
		return new TiledLayer({
			...layer,
			id: layer.key,
			zRange: zRangeRef.current,
		});
	};

	/**
	 * Return WMS layer
	 * @param layer {Object} layer data
	 * @returns {WmsLayer}
	 */
	const getWmsLayer = layer => {
		if (layer.options?.singleTile) {
			return new SingleTileWmsLayer({
				data: `${layer.options.url}?SERVICE=WMS&REQUEST=GetMap&version=1.3.0&STYLES=&CRS=EPSG:3857&FORMAT=image/png&WIDTH={width}&HEIGHT={height}&BBOX={east},{north},{west},{south}&LAYERS={layers}&TRANSPARENT=true`,
				serviceType: 'template',
				layers: layer.options.params.layers,
				//pickable in experimental dont work
				pickable: layer.options.pickable === true || false,
				extensions: layer.options.clampToTerrain
					? [new TerrainExtension()]
					: [],
				...(layer.options?.clampToTerrain?.terrainDrawMode
					? {terrainDrawMode: layer.options.clampToTerrain.terrainDrawMode}
					: {}),
			});
		} else {
			return new WmsLayer({
				...layer,
				id: layer.key,
				onClick: onRasterLayerClick,
				clampToTerrain: layer.options.clampToTerrain,
				extensions: layer.options.clampToTerrain
					? [new TerrainExtension()]
					: [],
				...(layer.options?.clampToTerrain?.terrainDrawMode
					? {terrainDrawMode: layer.options.clampToTerrain.terrainDrawMode}
					: {}),
			});
		}
	};

	/**
	 * It prepares common props used in Vector and MVT layer.
	 * @param {Object} layer
	 * @returns {Object} props
	 */
	const getVectorLayerProps = layer => {
		// eslint-disable-next-line no-unused-vars
		const {key, layerKey, options, ...restProps} = layer;
		// eslint-disable-next-line no-unused-vars
		let {features, style, hoverable, pointAsMarker, ...restOptions} = options;

		const renderAsRules = styleHelpers.getRenderAsRulesByBoxRange(
			options.renderAs,
			view?.boxRange
		);

		// Check options for renderAsRules
		// TODO add other options
		style = renderAsRules?.options?.style || style;
		pointAsMarker = Object.hasOwn(renderAsRules?.options || {}, 'pointAsMarker')
			? renderAsRules.options.pointAsMarker
			: options.pointAsMarker;

		const styleForDeck = styleHelpers.getStylesDefinitionForDeck(style, key);

		const props = {
			...restProps,
			options,
			id: layer.key,
			key: layer.key,
			layerKey: layer.layerKey || layer.key,
			onClick: onVectorLayerClick,
			autoHighlight: hoverable,
			styleForDeck,
			pointAsMarker,
			uniqueLayerKey: layer.key,
			activeSelectionKey,
			minZoom: options.minZoom || mapConstants.defaultLevelsRange[0],
			maxZoom: options.maxZoom || mapConstants.defaultLevelsRange[1],
		};
		return props;
	};

	/**
	 * Return MVT layer
	 * @param layer {Object} layer data
	 * @returns {MVTLayer}
	 */
	const getMVTLayer = layer => {
		let {
			options: {url, fidColumnName},
		} = layer;

		const props = getVectorLayerProps(layer);
		return new MVTLayer({
			...props,
			data: url,
			fidColumnName,
			pickable: false,
			onClick: onVectorLayerClick,
			zRange: zRangeRef.current,
		});
	};

	/**
	 * Return vector layer
	 * TODO it supports only points and polygons currently
	 * @param layer {Object} layer data
	 * @returns {VectorLayer}
	 */
	const getVectorLayer = layer => {
		const props = getVectorLayerProps(layer);

		return new VectorLayer(props);
	};

	/**
	 * Return COG bitmap layer
	 * @param layer {Object} layer data
	 * @returns {CogBitmapLayer}
	 */
	const getCogBitmapLayer = layer => {
		const {key, options} = layer;

		const {url, ...restOptions} = options;

		return new CogBitmapLayer(key, url, {
			...restOptions,
			onClick: onRasterLayerClick, //TODO add support for click in library
		});
	};

	/**
	 * Return COG bitmap layer
	 * @param layer {Object} layer data
	 * @param layer.options {Object} layer options
	 * @param layer.options.url {string} url of COGTiff
	 * @param layer.options.type {string} rendering type [terrain]
	 * @param layer.options.multiplier {number} Multiplier of heights
	 * @param layer.options.useChannel {number} which channel from COG will be rendered
	 * @returns {CogBitmapLayer}
	 */
	const getCogTerrainLayer = layer => {
		const {key, options} = layer;

		const {url, terrainOptions, ...restOptions} = options;
		return new CogTerrainLayer({
			id: key,
			elevationData: url,
			onClick: onRasterLayerClick,
			...restOptions,
			terrainOptions: {
				...terrainOptions,
			},
		});
	};

	/**
	 * Return layer by type
	 * @param layer {Object} layer data
	 * @returns {TiledLayer|VectorLayer|WmsLayer|null}
	 */
	const getLayerByType = layer => {
		if (layer && layer instanceof Layer) {
			return layer;
		} else if (layer && layer.type) {
			//memoize result by layer
			switch (layer.type) {
				case 'wmts':
					return getTileLayer(layer);
				case 'wms':
					return getWmsLayer(layer);
				case 'vector':
				case 'tiledVector':
				case 'tiled-vector':
					return getVectorLayer(layer);
				case 'cogBitmap':
					return getCogBitmapLayer(layer);
				case 'cogTerrain':
					return getCogTerrainLayer(layer);
				case 'mvt':
					return getMVTLayer(layer);
				default:
					return null;
			}
		} else {
			return null;
		}
	};

	const renderTooltip = () => {
		tooltipData.mapKey = mapKey;
		if (tooltipData?.vector?.length || tooltipData?.raster?.length) {
			return (
				<DeckTooltip
					Tooltip={Tooltip}
					data={tooltipData}
					mapWidth={box?.width}
					mapHeight={box?.height}
					mapKey={mapKey}
					{...tooltipProps}
				/>
			);
		}
	};

	const renderMap = () => {
		const renderView = onViewChange || !stateView ? view : stateView;

		let deckView = viewHelpers.getDeckViewFromPantherViewParams(
			renderView,
			box.width,
			box.height,
			viewLimits
		);

		const backgroundLayersSource = _isArray(backgroundLayer)
			? backgroundLayer
			: [backgroundLayer];
		const finalBackgroundLayers =
			backgroundLayersSource &&
			backgroundLayersSource.map(layer => getLayerByType(layer));
		const finalLayers = layers
			? layers.map(layer => getLayerByType(layer))
			: [];

		return (
			<div className="ptr-deckGl-map ptr-map">
				<DeckGL
					getCursor={getCursor || defaultGetCursor}
					ref={deckRef}
					onViewStateChange={onViewStateChange}
					{...(typeof onPanEnd === 'function' ? {onDragEnd: onPanEnd} : {})}
					views={new MapView({repeat: true})}
					viewState={deckView}
					layers={[...finalBackgroundLayers, ...finalLayers]}
					// Description of controller property
					// https://deck.gl/docs/api-reference/core/deck#controller
					controller={
						controller || controller === false
							? controller
							: {
									dragRotate: false,
							  }
					}
					onHover={onMapHover}
					onClick={(info, event) => {
						onClick(mapKey, {info, event});
					}}
					onAfterRender={onAfterRender}
				/>
				{Tooltip && tooltipData ? renderTooltip() : null}
			</div>
		);
	};

	return (
		<>
			<ReactResizeDetector
				handleHeight
				handleWidth
				onResize={onResizeHandler}
				refreshMode="debounce"
				refreshRate={500}
			/>
			{box.width && box.height ? renderMap() : null}
		</>
	);
};

DeckGlMap.propTypes = {
	activeSelectionKey: PropTypes.string,
	onResize: PropTypes.func,
	onViewChange: PropTypes.func,
	viewLimits: PropTypes.object,
	view: PropTypes.object,
	onClick: PropTypes.func,
	onHover: PropTypes.func,
	onLayerClick: PropTypes.func,
	onZoomEnd: PropTypes.func,
	onPanEnd: PropTypes.func,
	mapKey: PropTypes.string,
	backgroundLayer: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
	layers: PropTypes.array,
	Tooltip: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
	tooltipProps: PropTypes.object,
	getCursor: PropTypes.func,
	controller: PropTypes.oneOfType([PropTypes.bool, PropTypes.object]),
};

export default DeckGlMap;
