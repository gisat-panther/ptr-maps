import React from 'react';
import chroma from 'chroma-js';
import {
	forIn as _forIn,
	isEmpty as _isEmpty,
	includes as _includes,
} from 'lodash';
import ReactResizeDetector from 'react-resize-detector';
import DeckGL from '@deck.gl/react';
import {MapView} from '@deck.gl/core';
import viewport from '../utils/viewport';
import utils from './utils';
import TiledLayer from './layers/TiledLayer';
import VectorLayer from './layers/VectorLayer';

class DeckGlMap extends React.PureComponent {
	static propTypes = {};

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
		};

		this.onVectorLayerClick = this.onVectorLayerClick.bind(this);
		this.onResize = this.onResize.bind(this);
		this.onViewStateChange = this.onViewStateChange.bind(this);
	}

	onViewStateChange(views) {
		let change = {};
		const prevView = views.oldViewState;
		const nextView = views.viewState;

		if (prevView && prevView.zoom !== nextView.zoom) {
			change.boxRange = utils.getBoxRangeFromZoomLevel(
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
			options: layer.options,
		});
	}

	/**
	 * Return vector layer
	 * TODO it supports only points currently
	 * @param layer {Object} layer data
	 * @returns {VectorLayer}
	 */
	getVectorLayer(layer) {
		return new VectorLayer({
			key: layer.key || layer.layerKey,
			layerKey: layer.key || layer.layerKey,
			options: layer.options,
			onClick: this.onVectorLayerClick,
		});
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
		const view = utils.getDeckViewFromPantherViewParams(
			this.state.view,
			this.state.width,
			this.state.height
		);
		const {backgroundLayer, layers} = this.props;

		const finalBackgroundLayer = this.getLayerByType(backgroundLayer);
		const finalLayers = layers.map(layer => this.getLayerByType(layer));

		return (
			<DeckGL
				onViewStateChange={this.onViewStateChange}
				views={new MapView({repeat: true})}
				viewState={view}
				layers={[finalBackgroundLayer, ...finalLayers]}
				controller={true}
			/>
		);
	}
}

export default DeckGlMap;
