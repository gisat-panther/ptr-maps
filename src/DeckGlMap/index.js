import React from 'react';
import chroma from 'chroma-js';
import {
	forIn as _forIn,
	isEmpty as _isEmpty,
	includes as _includes,
} from 'lodash';
import ReactResizeDetector from 'react-resize-detector';
import DeckGL from '@deck.gl/react';
import {BitmapLayer, GeoJsonLayer} from '@deck.gl/layers';
import {TileLayer} from '@deck.gl/geo-layers';
import {MapView} from '@deck.gl/core';
import viewport from '../utils/viewport';
import utils from './utils';
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
		this.getFeatureOutlineColor = this.getFeatureOutlineColor.bind(this);
		this.getFeatureOutlineWidth = this.getFeatureOutlineWidth.bind(this);
		this.getPointSize = this.getPointSize.bind(this);
		this.onResize = this.onResize.bind(this);
		this.onViewStateChange = this.onViewStateChange.bind(this);
	}

	onViewStateChange(views) {
		// TODO zoom to cursor
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

	onLayerClick(mapKey, data) {
		if (this.props.onLayerClick) {
			this.props.onLayerClick(this.props.mapKey, data.layer.props.layerKey, [
				data.object.id ||
					data.object.properties[data.layer.props.fidColumnName],
			]);
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

	getDefaultStyle(feature) {
		const {hovered, hoverable, selected, selectable, style, fidColumnName} =
			this.props.layers[0].options;
		const fid = feature.id || feature.properties[fidColumnName];

		const defaultStyle = helpers.getDefaultStyleObject(feature, style);

		let isSelected, selectedStyle;
		if (selected && fid) {
			_forIn(selected, (selection, key) => {
				if (selection.keys && _includes(selection.keys, fid)) {
					isSelected = true;
					selectedStyle = {
						...defaultStyle,
						...helpers.getSelectedStyleObject(selection.style),
					};
				}
			});
		}

		return selectedStyle || defaultStyle;
	}

	getFeatureFill(feature) {
		const defaultStyle = this.getDefaultStyle(feature);
		if (defaultStyle) {
			let color = chroma(defaultStyle.fill).rgb();
			if (defaultStyle.fillOpacity || defaultStyle.fillOpacity === 0) {
				color.push(Math.floor(defaultStyle.fillOpacity * 255));
			}
			return color;
		} else {
			return [255, 255, 255, 200];
		}
	}

	getFeatureOutlineColor(feature) {
		const defaultStyle = this.getDefaultStyle(feature);
		if (defaultStyle) {
			let color = chroma(defaultStyle.outlineColor).rgb();
			if (defaultStyle.outlineOpacity || defaultStyle.outlineOpacity === 0) {
				color.push(Math.floor(defaultStyle.outlineOpacity * 255));
			}
			return color;
		} else {
			return [100, 100, 100, 200];
		}
	}

	getPointSize(feature) {
		const defaultStyle = this.getDefaultStyle(feature);
		return defaultStyle?.size || 10;
	}

	getFeatureOutlineWidth(feature) {
		const defaultStyle = this.getDefaultStyle(feature);
		return defaultStyle?.outlineWidth || 0;
	}

	getVectorLayer(layer) {
		return new GeoJsonLayer({
			id: 'geojson-layer',
			layerKey: layer.key || layer.layerKey,
			fidColumnName: layer.options.fidColumnName,
			data: layer.options.features,
			pickable: true,
			stroked: true,
			filled: true,
			extruded: false,
			pointType: 'circle',
			lineWidthUnits: 'pixels',
			getFillColor: this.getFeatureFill,
			getLineColor: this.getFeatureOutlineColor,
			getPointRadius: this.getPointSize,
			onClick: this.onLayerClick.bind(this, this.props.mapKey),
			getLineWidth: this.getFeatureOutlineWidth,
			updateTriggers: {
				getFillColor: [layer.options],
				getLineColor: [layer.options],
				getLineWidth: [layer.options],
			},
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
