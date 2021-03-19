import React from 'react';
import _ from 'lodash';
import {Map, TileLayer, Pane} from 'react-leaflet';
import PropTypes from 'prop-types';
import L from 'leaflet';
import Proj from 'proj4leaflet';
import ReactResizeDetector from 'react-resize-detector';
import {mapConstants} from '@gisatcz/ptr-core';
import {map as mapUtils} from '@gisatcz/ptr-utils';

import viewUtils from '../utils/view';
import viewHelpers from './viewHelpers';
import VectorLayer from './layers/VectorLayer';
import WMSLayer from './layers/WMSLayer';
import TileGridLayer from './layers/TileGridLayer';
import constants from '../constants';
import viewport from '../utils/viewport';

import './style.scss';
import 'leaflet/dist/leaflet.css';

class ReactLeafletMap extends React.PureComponent {
	static propTypes = {
		backgroundLayer: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
		name: PropTypes.string,
		crs: PropTypes.string,
		layers: PropTypes.array,
		mapKey: PropTypes.string.isRequired,
		onClick: PropTypes.func,
		onLayerClick: PropTypes.func,
		onViewChange: PropTypes.func,
		resources: PropTypes.object,
		view: PropTypes.object,
		viewLimits: PropTypes.object,
		debugTileGrid: PropTypes.oneOfType([
			PropTypes.bool,
			PropTypes.shape({
				bottom: PropTypes.bool,
			}),
		]),
	};

	constructor(props) {
		super(props);

		this.state = {
			view: null,
			crs: this.getCRS(props.crs),
		};

		this.onClick = this.onClick.bind(this);
		this.onLayerClick = this.onLayerClick.bind(this);
		this.onViewportChanged = this.onViewportChanged.bind(this);
		this.onResize = this.onResize.bind(this);
	}

	componentDidMount() {
		// Hack for ugly 1px tile borders in Chrome
		// Version of Leaflet package in dependencies should match version used by react-leaflet
		let originalInitTile = L.GridLayer.prototype._initTile;
		L.GridLayer.include({
			_initTile: function (tile) {
				originalInitTile.call(this, tile);

				var tileSize = this.getTileSize();

				tile.style.width = tileSize.x + 1 + 'px';
				tile.style.height = tileSize.y + 1 + 'px';
			},
		});
	}

	getCRS(code) {
		switch (code) {
			case 'EPSG:4326':
				return L.CRS.EPSG4326;
			case 'EPSG:5514':
				return new Proj.CRS('EPSG:5514', constants.projDefinitions.epsg5514, {
					resolutions: [
						102400,
						51200,
						25600,
						12800,
						6400,
						3200,
						1600,
						800,
						400,
						200,
						100,
						50,
						25,
						12.5,
						6.25,
						3.125,
						1.5625,
						0.78125,
						0.390625,
					],
				});
			default:
				return L.CRS.EPSG3857;
		}
	}

	setZoomLevelsBounds(width, height) {
		const props = this.props;
		this.minZoom = mapConstants.defaultLevelsRange[0];
		this.maxZoom = mapConstants.defaultLevelsRange[1];
		if (props.viewLimits && props.viewLimits.boxRangeRange) {
			if (props.viewLimits.boxRangeRange[1]) {
				this.minZoom = mapUtils.view.getZoomLevelFromBoxRange(
					props.viewLimits.boxRangeRange[1],
					width,
					height
				);
			}

			if (props.viewLimits.boxRangeRange[0]) {
				this.maxZoom = mapUtils.view.getZoomLevelFromBoxRange(
					props.viewLimits.boxRangeRange[0],
					width,
					height
				);
			}
		}
	}

	onViewportChanged(viewport) {
		if (viewport) {
			let change = {};

			if (
				viewport.center &&
				(viewport.center[0] !== this.state.leafletView.center[0] ||
					viewport.center[1] !== this.state.leafletView.center[1])
			) {
				change.center = viewUtils.getCenterWhichFitsLimits(
					{
						lat: viewport.center[0],
						lon: viewport.center[1],
					},
					this.props.viewLimits?.center
				);
			}

			if (
				viewport.hasOwnProperty('zoom') &&
				Number.isFinite(viewport.zoom) &&
				viewport.zoom !== this.state.leafletView.zoom
			) {
				change.boxRange = mapUtils.view.getBoxRangeFromZoomLevel(
					viewport.zoom,
					this.state.width,
					this.state.height
				);
			}

			if (!_.isEmpty(change) && !this.hasResized()) {
				change = mapUtils.view.ensureViewIntegrity(change);

				if (this.props.viewLimits?.center) {
					/* Center coordinate values are compared by value. If the map view is changed from inside (by dragging) and the center gets out of the range, then the center coordinates are adjusted to those limits. However, if we move the map a bit again, these values will remain the same and the map component will not reredner. Therefore, it is necessary to make insignificant change in center coordinates values */
					change.center = {
						lat: change.center.lat + Math.random() / Math.pow(10, 13),
						lon: change.center.lon + Math.random() / Math.pow(10, 13),
					};
				}

				if (this.props.onViewChange) {
					this.props.onViewChange(change);
				}
				// just presentational map
				else {
					this.setState({
						view: {...this.props.view, ...this.state.view, ...change},
					});
				}
			}
		}
	}

	hasResized() {
		const {x, y} = this.leafletMap._size;

		// take into account only a significant change in size
		const widthChange = Math.abs(x - this.state.width) > 5;
		const heightChange = Math.abs(y - this.state.height) > 5;
		return widthChange || heightChange;
	}

	onResize(width, height) {
		height = viewport.roundDimension(height);
		width = viewport.roundDimension(width);

		if (this.leafletMap) {
			this.leafletMap.invalidateSize();
		}

		if (!this.maxZoom && !this.minZoom) {
			this.setZoomLevelsBounds(width, height);
		}

		this.setState({
			width,
			height,
			leafletView: viewHelpers.getLeafletViewportFromViewParams(
				this.state.view || this.props.view,
				this.state.width,
				this.state.height
			),
		});

		if (this.props.onResize) {
			this.props.onResize(width, height);
		}
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
		const leafletView = viewHelpers.getLeafletViewportFromViewParams(
			this.state.view || this.props.view,
			this.state.width,
			this.state.height
		);

		// fix for backward compatibility
		const backgroundLayersSource = _.isArray(this.props.backgroundLayer)
			? this.props.backgroundLayer
			: [this.props.backgroundLayer];
		const backgroundLayersZindex = constants.defaultLeafletPaneZindex + 1;
		const backgroundLayers =
			backgroundLayersSource &&
			backgroundLayersSource.map((layer, i) =>
				this.getLayerByType(layer, i, null, leafletView.zoom)
			);

		const baseLayersZindex = constants.defaultLeafletPaneZindex + 101;
		let layers =
			this.props.layers &&
			this.props.layers.map((layer, i) => (
				<Pane key={layer.key || i} style={{zIndex: baseLayersZindex + i}}>
					{this.getLayerByType(
						layer,
						i,
						baseLayersZindex + i,
						leafletView.zoom
					)}
				</Pane>
			));

		//
		// Add debug grid layer on under all "layers" or at the top
		//
		if (this.props.debugTileGrid) {
			const bottom = this.props.debugTileGrid?.bottom;
			const zIndex = bottom ? 0 : (layers?.length || 0) + 1;
			const tileGridLayer = (
				<Pane key={'tilegrid'} style={{zIndex: baseLayersZindex + zIndex - 1}}>
					{this.getLayerByType(
						{
							type: 'tile-grid',
							key: 'tilegrid',
							layerKey: 'tilegridlayerkey',
							options: {
								viewport: {
									width: this.state.width,
									height: this.state.height,
								},
							},
						},
						0,
						baseLayersZindex + zIndex - 1,
						leafletView.zoom
					)}
				</Pane>
			);

			if (bottom) {
				layers = layers ? [tileGridLayer, ...layers] : [tileGridLayer];
			} else {
				layers = layers ? [...layers, tileGridLayer] : [tileGridLayer];
			}
		}

		return (
			<Map
				id={this.props.mapKey}
				ref={map => {
					this.leafletMap = map && map.leafletElement;
				}}
				className="ptr-map ptr-leaflet-map"
				onViewportChanged={this.onViewportChanged}
				onClick={this.onClick}
				center={leafletView.center}
				zoom={leafletView.zoom}
				zoomControl={false}
				minZoom={this.minZoom} // non-dynamic prop
				maxZoom={this.maxZoom} // non-dynamic prop
				attributionControl={false}
				crs={this.state.crs}
				animate={false}
			>
				<Pane style={{zIndex: backgroundLayersZindex}}>{backgroundLayers}</Pane>
				{layers}
				{this.props.children}
			</Map>
		);
	}

	getLayerByType(layer, i, zIndex, zoom) {
		if (layer && layer.type) {
			switch (layer.type) {
				case 'wmts':
					return this.getTileLayer(layer, i);
				case 'wms':
					return this.getWmsTileLayer(layer, i);
				case 'vector':
				case 'tiledVector':
				case 'tiled-vector':
				case 'diagram':
					return this.getVectorLayer(layer, i, zIndex, zoom);
				case 'tile-grid':
					return this.getTileGridLayer(layer, i, zIndex, zoom);
				default:
					return null;
			}
		} else {
			return null;
		}
	}

	getVectorLayer(layer, i, zIndex, zoom) {
		return (
			<VectorLayer
				key={layer.key || i}
				layerKey={layer.layerKey || layer.key}
				uniqueLayerKey={layer.key || i}
				resources={this.props.resources}
				onClick={this.onLayerClick}
				opacity={layer.opacity || 1}
				options={layer.options}
				type={layer.type}
				view={this.state.view || this.props.view}
				width={this.state.width}
				height={this.state.height}
				crs={this.props.crs}
				zoom={zoom}
				zIndex={zIndex}
			/>
		);
	}

	getTileGridLayer(layer, i, zIndex, zoom) {
		return (
			<TileGridLayer
				key={layer.key || i}
				layerKey={layer.layerKey || layer.key}
				uniqueLayerKey={layer.key || i}
				view={this.state.view || this.props.view}
				options={layer.options}
				zoom={zoom}
				zIndex={zIndex}
			/>
		);
	}

	getTileLayer(layer, i) {
		let {url, ...restOptions} = layer.options;

		// fix for backward compatibility
		if (layer.options.urls) {
			url = layer.options.urls[0];
		}

		return <TileLayer key={layer.key || i} url={url} {...restOptions} />;
	}

	getWmsTileLayer(layer, i) {
		const o = layer.options;
		let layers = (o.params && o.params.layers) || '';
		let crs = (o.params && o.params.crs && this.getCRS(o.params.crs)) || null;
		let imageFormat = (o.params && o.params.imageFormat) || 'image/png';
		const reservedParamsKeys = [
			'layers',
			'crs',
			'imageFormat',
			'pane',
			'maxZoom',
			'styles',
		];
		let restParameters =
			(o.params &&
				Object.entries(o.params).reduce((acc, [key, value]) => {
					if (reservedParamsKeys.includes(key)) {
						return acc;
					} else {
						acc[key] = value;
						return acc;
					}
				}, {})) ||
			{};

		return (
			<WMSLayer
				key={layer.key || i}
				url={o.url}
				crs={crs}
				singleTile={o.singleTile === true}
				params={{
					layers: layers,
					opacity: layer.opacity || 1,
					transparent: true,
					format: imageFormat,
					...restParameters,
				}}
			/>
		);
	}

	onLayerClick(layerKey, featureKeys) {
		if (this.props.onLayerClick) {
			this.props.onLayerClick(this.props.mapKey, layerKey, featureKeys);
		}
	}

	onClick() {
		if (this.props.onClick) {
			this.props.onClick(this.props.view);
		}
	}
}

export default ReactLeafletMap;
