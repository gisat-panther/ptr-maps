import {useState, useCallback, useRef} from 'react';
import {readPixelsToArray} from '@luma.gl/core';
import PropTypes from 'prop-types';
import {isArray as _isArray, isEmpty as _isEmpty} from 'lodash';
import ReactResizeDetector from 'react-resize-detector';
import DeckGL from '@deck.gl/react';
import {Layer, MapView} from '@deck.gl/core';
import viewport from '../utils/viewport';
import viewHelpers from './helpers/view';
import styleHelpers from './helpers/style';
import TiledLayer from './layers/TiledLayer';
import VectorLayer from './layers/VectorLayer';
import WmsLayer from './layers/WmsLayer';
import {_WMSLayer as SingleTileWmsLayer} from '@deck.gl/geo-layers';

import './style.scss';
import DeckTooltip from './DeckTooltip';

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

	const [box, setBox] = useState({width: null, height: null});
	const [stateView, setStateView] = useState();
	const [tooltipData, setTooltipData] = useState({
		vector: [],
		raster: [],
		event: null,
	});

	const onHover = useCallback(
		event => {
			if (deckRef?.current?.pickMultipleObjects) {
				const hoveredItems = deckRef?.current?.pickMultipleObjects(event);
				const vectorHoveredItems = [];
				const rasterHoveredItems = [];
				hoveredItems.forEach(item => {
					if (item.layer instanceof VectorLayer) {
						//add to vector items
						vectorHoveredItems.push(item);
					} else if (item.layer instanceof WmsLayer) {
						//add to raster items
						//this is path fot tile layer
						const image =
							item?.tile?.layers?.[0]?.props?.tile?.layers?.[0]?.props?.image;
						item.pixelColor = readPixelsToArray(image, {
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
	const onVectorLayerClick = (layerKey, featureKeys, position) => {
		if (onLayerClick) {
			onLayerClick(mapKey, layerKey, featureKeys, position);
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
			});
		} else {
			return new WmsLayer({
				...layer,
				id: layer.key,
				onClick: onRasterLayerClick,
			});
		}
	};

	/**
	 * Return vector layer
	 * TODO it supports only points and polygons currently
	 * @param layer {Object} layer data
	 * @returns {VectorLayer}
	 */
	const getVectorLayer = layer => {
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

		let props = {
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
		};

		return new VectorLayer(props);
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
			switch (layer.type) {
				case 'wmts':
					return getTileLayer(layer);
				case 'wms':
					return getWmsLayer(layer);
				case 'vector':
				case 'tiledVector':
				case 'tiled-vector':
					return getVectorLayer(layer);
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
			<div className="ptr-deckGl-map ptr-map" onClick={() => onClick(mapKey)}>
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
					onHover={onHover}
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
