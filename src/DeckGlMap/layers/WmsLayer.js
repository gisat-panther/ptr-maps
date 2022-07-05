import {CompositeLayer} from '@deck.gl/core';
import {TileLayer} from '@deck.gl/geo-layers';
import {BitmapLayer} from '@deck.gl/layers';
import {load} from '@loaders.gl/core';
import SphericalMercator from '@mapbox/sphericalmercator';

const DEFAULT_TILE_SIZE = 256;

class WmsLayer extends CompositeLayer {
	renderLayers() {
		return [this.renderWmsLayer()];
	}

	renderWmsLayer() {
		const {options, opacity, key} = this.props;
		if (!options) {
			throw new Error('WmsLayer: options are not defined!');
		}
		const {url, params} = options;
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

		return new TileLayer({
			id,
			opacity,
			tileSize,
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
				});
			},
		});
	}
}

export default WmsLayer;
