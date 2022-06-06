import {useState, createElement, useCallback} from 'react';
import PropTypes from 'prop-types';
import {isArray as _isArray, isEmpty as _isEmpty} from 'lodash';
import ReactResizeDetector from 'react-resize-detector';
import DeckGL from '@deck.gl/react';
import {MapView} from '@deck.gl/core';
import viewport from '../utils/viewport';
import viewHelpers from './helpers/view';
import styleHelpers from './helpers/style';
import TiledLayer from './layers/TiledLayer';
import VectorLayer from './layers/VectorLayer';
import WmsLayer from './layers/WmsLayer';

import './style.scss';

const DeckGlMap = ({
	onResize,
	onViewChange,
	viewLimits,
	view,
	onLayerClick,
	mapKey,
	backgroundLayer,
	layers,
	Tooltip,
}) => {
	const [box, setBox] = useState({width: null, height: null});
	const [stateView, setStateView] = useState();
	const [tooltipData, setTooltipData] = useState(null);

	const onViewStateChange = views => {
		let change = {};
		const prevView = views.oldViewState;
		const nextView = views.viewState;

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
	 */
	const onVectorLayerClick = (layerKey, featureKeys) => {
		if (onLayerClick) {
			onLayerClick(mapKey, layerKey, featureKeys);
		}
	};

	/**
	 * @param layerKey {string}
	 * @param featureKey {string}
	 * @param feature {Object}
	 * @param x {number}
	 * @param y {number}
	 */
	const onVectorLayerHover = (layerKey, featureKey, feature, x, y) => {
		if (Tooltip) {
			setTooltipData({
				mapKey,
				layerKey,
				featureKey,
				feature,
				x,
				y,
			});
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
			throw new Error('DeckGlMap: singleTile option not implemented yet!');
		} else {
			return new WmsLayer({
				...layer,
				id: layer.key,
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

		let props = {
			...restProps,
			options,
			id: layer.key,
			key: layer.key,
			layerKey: layer.layerKey || layer.key,
			onClick: onVectorLayerClick,
			onHover: onVectorLayerHover,
			autoHighlight: hoverable,
			styleForDeck: styleHelpers.getStylesDefinitionForDeck(style),
			pointAsMarker,
		};

		return new VectorLayer(props);
	};

	/**
	 * Return layer by type
	 * @param layer {Object} layer data
	 * @returns {TiledLayer|VectorLayer|WmsLayer|null}
	 */
	const getLayerByType = layer => {
		if (layer && layer.type) {
			switch (layer.type) {
				case 'wmts':
					return getTileLayer(layer);
				case 'wms':
					return getWmsLayer(layer);
				case 'vector':
					return getVectorLayer(layer);
				default:
					return null;
			}
		} else {
			return null;
		}
	};

	const renderTooltip = () => {
		const {x, y} = tooltipData;
		const style = {
			left: x,
			top: y,
		};

		return (
			<div className="ptr-deckGl-map-tooltip" style={style}>
				{createElement(Tooltip, {...tooltipData})}
			</div>
		);
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
					onViewStateChange={onViewStateChange}
					views={new MapView({repeat: true})}
					viewState={deckView}
					layers={[...finalBackgroundLayers, ...finalLayers]}
					controller={true}
				/>
				{Tooltip && tooltipData?.featureKey ? renderTooltip() : null}
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
	onResize: PropTypes.func,
	onViewChange: PropTypes.func,
	viewLimits: PropTypes.object,
	view: PropTypes.object,
	onLayerClick: PropTypes.func,
	mapKey: PropTypes.string,
	backgroundLayer: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
	layers: PropTypes.array,
	Tooltip: PropTypes.func,
};

export default DeckGlMap;
