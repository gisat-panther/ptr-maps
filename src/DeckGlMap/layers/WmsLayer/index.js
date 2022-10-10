import {CompositeLayer} from '@deck.gl/core';
import {TileLayer} from '@deck.gl/geo-layers';
import {BitmapLayer} from '@deck.gl/layers';
import {load} from '@loaders.gl/core';
import GL from '@luma.gl/constants';
import SphericalMercator from '@mapbox/sphericalmercator';
import {omit as _omit} from 'lodash';

const DEFAULT_TILE_SIZE = 256;

class WmsLayer extends CompositeLayer {
	constructor(props) {
		super(_omit(props, ['onClick', 'onHover']));
		this.originProps = props;
	}
	onHover(event, info) {
		if (typeof this.originProps.onHover === 'function') {
			this.originProps.onHover(this.props.key, event, info);
		}
	}

	onClick(event, info) {
		if (typeof this.originProps.onClick === 'function') {
			this.originProps.onClick(this.props.key, event, info);
		}
	}

	renderLayers() {
		return [this.renderWmsLayer()];
	}

	renderWmsLayer() {
		const {options, opacity, key} = this.props;
		if (!options) {
			throw new Error('WmsLayer: options are not defined!');
		}
		const {
			url,
			params,
			transparentColor = [0, 0, 0, 0],
			textureParameters = {
				[GL.TEXTURE_MIN_FILTER]: GL.LINEAR_MIPMAP_LINEAR,
				[GL.TEXTURE_MAG_FILTER]: GL.LINEAR,
				[GL.TEXTURE_WRAP_S]: GL.CLAMP_TO_EDGE,
				[GL.TEXTURE_WRAP_T]: GL.CLAMP_TO_EDGE,
			},
		} = options;
		if (!url) {
			throw new Error('WmsLayer: options.url is not defined!');
		}
		if (!params) {
			throw new Error('WmsLayer: options.params are not defined!');
		}
		const {layers, format, styles, version} = params;
		if (!layers) {
			throw new Error('WmsLayer: options.params.layers are not defined!');
		}

		const id = `${key}-wmsLayer`;
		const tileSize = params.tileSize || DEFAULT_TILE_SIZE;

		const conversion = new SphericalMercator({
			size: tileSize,
			antimeridian: true,
		});

		const pickable = options.pickable === true || false;

		return new TileLayer({
			id,
			opacity,
			tileSize,
			pickable,
			transparentColor,
			getTileData: tile => {
				let {x, y, z, index} = tile;
				x = x || index.x;
				y = y || index.y;
				z = z || index.z;
				// Conversion needed due to visualizations issues.
				const [west, south, east, north] = conversion.bbox(
					x,
					y,
					z,
					false,
					'900913'
				);

				const urlQueryStringParams = {
					bbox: [west, south, east, north].join(','),
					format: format || 'image/png',
					height: tileSize,
					layers,
					request: 'GetMap',
					service: 'WMS',
					styles: styles || '',
					width: tileSize,
					transparent: true,
				};

				if (Object.hasOwn(params, 'transparent')) {
					urlQueryStringParams.transparent = params.transparent;
				}

				if (version === '1.1.1') {
					urlQueryStringParams.srs = 'EPSG:3857';
					urlQueryStringParams.version = '1.1.1';
				} else {
					urlQueryStringParams.crs = 'EPSG:3857';
					urlQueryStringParams.version = '1.3.0';
				}

				const urlQueryString = Object.keys(urlQueryStringParams)
					.map(key => `${key}=${urlQueryStringParams[key]}`)
					.join('&');

				const finalUrl = url + '?' + urlQueryString;

				return load(finalUrl);
			},
			renderSubLayers: props => {
				const {
					bbox: {west, south, east, north},
				} = props.tile;

				return new BitmapLayer(props, {
					data: null,
					image: props.data,
					bounds: [west, south, east, north],
					textureParameters,
				});
			},
		});
	}
}

export default WmsLayer;
