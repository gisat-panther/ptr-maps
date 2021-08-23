import React from 'react';
import PropTypes from 'prop-types';
import {isEmpty as _isEmpty} from 'lodash';
import ReactResizeDetector from 'react-resize-detector';
import DeckGL from '@deck.gl/react';
import {MapView} from '@deck.gl/core';
import viewport from '../utils/viewport';
import viewHelpers from './helpers/view';
import styleHelpers from './helpers/style';
import TiledLayer from './layers/TiledLayer';
import VectorLayer from './layers/VectorLayer';

import './style.scss';

class DeckGlMap extends React.PureComponent {
	static propTypes = {
		view: PropTypes.object,
		viewLimits: PropTypes.object,
	};

	static getDerivedStateFromProps(props, state) {
		let changes = {};

		if (props.view && state.view !== props.view) {
			changes.view = props.view;
		}

		if (
			(props.viewport?.width && props.viewport.width !== state.width) ||
			(props.viewport?.height && props.viewport.height !== state.height)
		) {
			changes.height = props.viewport.height;
			changes.width = props.viewport.width;
		}

		return _isEmpty(changes) ? null : changes;
	}

	constructor(props) {
		super(props);

		this.state = {
			view: null,
			tooltipData: null,
		};

		this.onVectorLayerClick = this.onVectorLayerClick.bind(this);
		this.onVectorLayerHover = this.onVectorLayerHover.bind(this);
		this.onResize = this.onResize.bind(this);
		this.onViewStateChange = this.onViewStateChange.bind(this);
	}

	onViewStateChange(views) {
		let change = {};
		const prevView = views.oldViewState;
		const nextView = views.viewState;

		if (prevView && prevView.zoom !== nextView.zoom) {
			change.boxRange = viewHelpers.getBoxRangeFromZoomLevel(
				nextView.zoom,
				this.state.width,
				this.state.height
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
			if (this.props.onViewChange) {
				this.props.onViewChange(change);
			}
			// just presentational map
			else {
				this.setState({
					view: {...this.state.view, ...change},
				});
			}
		}
	}

	/**
	 * @param width {number}
	 * @param height {number}
	 */
	onResize(width, height) {
		height = viewport.roundDimension(height);
		width = viewport.roundDimension(width);

		if (this.props.onResize) {
			this.props.onResize(width, height);
		}

		this.setState({
			width,
			height,
		});
	}

	/**
	 * @param layerKey {string}
	 * @param featureKeys {Array}
	 */
	onVectorLayerClick(layerKey, featureKeys) {
		if (this.props.onLayerClick) {
			this.props.onLayerClick(this.props.mapKey, layerKey, featureKeys);
		}
	}

	/**
	 * @param layerKey {string}
	 * @param featureKey {string}
	 * @param feature {Object}
	 * @param x {number}
	 * @param y {number}
	 */
	onVectorLayerHover(layerKey, featureKey, feature, x, y) {
		if (this.props.Tooltip) {
			this.setState({
				tooltipData: {
					mapKey: this.props.mapKey,
					layerKey,
					featureKey,
					feature,
					x,
					y,
				},
			});
		}
	}

	/**
	 * Return layer by type
	 * @param layer {Object} layer data
	 * @returns {TiledLayer|VectorLayer|null}
	 */
	getLayerByType(layer) {
		if (layer && layer.type) {
			switch (layer.type) {
				case 'wmts':
					return this.getTileLayer(layer);
				case 'vector':
					return this.getVectorLayer(layer);
				default:
					return null;
			}
		} else {
			return null;
		}
	}

	/**
	 * Return tiled (WMTS) layer
	 * @param layer {Object} layer data
	 * @returns {TiledLayer}
	 */
	getTileLayer(layer) {
		return new TiledLayer({
			...layer,
			id: layer.key,
		});
	}

	/**
	 * Return vector layer
	 * TODO it supports only points currently
	 * @param layer {Object} layer data
	 * @returns {VectorLayer}
	 */
	getVectorLayer(layer) {
		const {key, layerKey, options, ...restProps} = layer;
		let {features, style, pointAsMarker, ...restOptions} = options;

		const renderAsRules = styleHelpers.getRenderAsRulesByBoxRange(
			options.renderAs,
			this.props.view?.boxRange
		);

		// Check options for renderAsRules
		// TODO add other options
		style = renderAsRules?.options?.style || style;
		pointAsMarker = renderAsRules?.options?.hasOwnProperty('pointAsMarker')
			? renderAsRules.options.pointAsMarker
			: options.pointAsMarker;

		let props = {
			...restProps,
			options,
			id: layer.key,
			key: layer.key,
			layerKey: layer.layerKey || layer.key,
			onClick: this.onVectorLayerClick,
			onHover: this.onVectorLayerHover,
			styleForDeck: styleHelpers.getStylesDefinitionForDeck(style),
			pointAsMarker,
		};

		return new VectorLayer(props);
	}

	render() {
		return (
			<>
				<ReactResizeDetector
					handleHeight
					handleWidth
					onResize={this.onResize}
					refreshMode="debounce"
					refreshRate={500}
				/>
				{this.state.width && this.state.height ? this.renderMap() : null}
			</>
		);
	}

	renderMap() {
		let view = viewHelpers.getDeckViewFromPantherViewParams(
			this.state.view,
			this.state.width,
			this.state.height,
			this.props.viewLimits
		);
		const {backgroundLayer, layers, Tooltip} = this.props;

		const finalBackgroundLayer = this.getLayerByType(backgroundLayer);
		const finalLayers = layers.map(layer => this.getLayerByType(layer));

		return (
			<>
				<DeckGL
					onViewStateChange={this.onViewStateChange}
					views={new MapView({repeat: true})}
					viewState={view}
					layers={[finalBackgroundLayer, ...finalLayers]}
					controller={true}
				/>
				{Tooltip && this.state.tooltipData?.featureKey
					? React.createElement(Tooltip, {...this.state.tooltipData})
					: null}
			</>
		);
	}
}

export default DeckGlMap;
