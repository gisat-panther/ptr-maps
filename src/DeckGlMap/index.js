import React from 'react';
import chroma from 'chroma-js';
import {isEmpty as _isEmpty} from 'lodash';
import ReactResizeDetector from 'react-resize-detector';
import DeckGL from '@deck.gl/react';
import {BitmapLayer, GeoJsonLayer} from '@deck.gl/layers';
import {TileLayer} from '@deck.gl/geo-layers';
import {MapView} from '@deck.gl/core';
import viewport from '../utils/viewport';
import viewHelpers from '../ReactLeafletMap/viewHelpers';
import {map as mapUtils} from '@gisatcz/ptr-utils';
import helpers from '../ReactLeafletMap/layers/SvgVectorLayer/helpers';

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

		this.getFeatureFill = this.getFeatureFill.bind(this);
		this.onResize = this.onResize.bind(this);
		this.onViewStateChange = this.onViewStateChange.bind(this);
	}

	onViewStateChange(views) {
		// TODO zoom to cursor
		let change = {};
		const prevView = views.oldViewState;
		const nextView = views.viewState;

		if (prevView && prevView.zoom !== nextView.zoom) {
			let zoom =
				prevView.zoom > nextView.zoom
					? Math.floor(nextView.zoom)
					: Math.ceil(nextView.zoom);
			change.boxRange = mapUtils.view.getBoxRangeFromZoomLevel(
				zoom,
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

	getDeckView() {
		const leafletView = viewHelpers.getLeafletViewportFromViewParams(
			this.state.view,
			this.state.width,
			this.state.height
		);

		if (leafletView) {
			return {
				latitude: leafletView.center[0],
				longitude: leafletView.center[1],
				zoom: leafletView.zoom,
			};
		} else {
			return null;
		}
	}

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

	getTileLayer(layer) {
		return new TileLayer({
			data: layer.options.url,
			minZoom: 0,
			maxZoom: 19,
			tileSize: 256,

			renderSubLayers: props => {
				const {
					bbox: {west, south, east, north},
				} = props.tile;

				return new BitmapLayer(props, {
					data: null,
					image: props.data,
					bounds: [west, south, east, north],
				});
			},
		});
	}

	getFeatureFill(feature) {
		const style = this.props.layers[0].options.style;
		const defaultStyle = helpers.getDefaultStyleObject(feature, style);
		if (defaultStyle) {
			let color = chroma(defaultStyle.fill).rgb();
			if (defaultStyle.fillOpacity || defaultStyle.fillOpacity === 0) {
				color.push(Math.floor(defaultStyle.fillOpacity * 255));
			}
			return color;
		} else {
			return [255, 255, 255, 255];
		}
	}

	getVectorLayer(layer) {
		return new GeoJsonLayer({
			id: 'geojson-layer',
			data: layer.options.features,
			pickable: true,
			stroked: false,
			filled: true,
			extruded: false,
			pointType: 'circle',
			getFillColor: this.getFeatureFill,
			getLineColor: [100, 100, 100, 255],
			getPointRadius: 60,
			getLineWidth: 3,
			pointRadiusMinPixels: 1,
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
		const view = this.getDeckView();
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
