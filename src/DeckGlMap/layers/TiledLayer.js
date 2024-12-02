import {flatten as _flatten} from 'lodash';
import {CompositeLayer} from '@deck.gl/core';
import {TileLayer} from '@deck.gl/geo-layers';
import {BitmapLayer} from '@deck.gl/layers';
import {_TerrainExtension as TerrainExtension} from '@deck.gl/extensions';
import {mapConstants} from '@gisatcz/ptr-core';

class TiledLayer extends CompositeLayer {
	renderLayers() {
		return [this.renderTiledLayer()];
	}

	getValidUrlTemplates(url) {
		const invalidTemplateSegment = '{s}';
		if (url.includes(invalidTemplateSegment)) {
			let subDomainNames = ['a', 'b', 'c'];
			let urls = [];
			subDomainNames.forEach(subDomainName => {
				const validUrl = url.replace(invalidTemplateSegment, subDomainName);
				urls.push(validUrl);
			});

			return urls;
		} else {
			return url;
		}
	}

	renderTiledLayer() {
		const {options, opacity, key, zRange} = this.props;
		const {url, urls, minNativeZoom, maxNativeZoom, tileSize, clampToTerrain} =
			options;

		let finalUrls = urls
			? _flatten(urls.map(url => this.getValidUrlTemplates(url)))
			: this.getValidUrlTemplates(url);

		return new TileLayer({
			id: `${key}-tileLayer`,
			opacity: opacity || opacity === 0 ? opacity : 1,
			data: finalUrls,
			minZoom: minNativeZoom || mapConstants.defaultLevelsRange[0],
			maxZoom: maxNativeZoom || mapConstants.defaultLevelsRange[1],
			tileSize: tileSize || 256,
			extensions: clampToTerrain ? [new TerrainExtension()] : [],
			zRange,
			...(clampToTerrain?.terrainDrawMode
				? {terrainDrawMode: clampToTerrain.terrainDrawMode}
				: {}),

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

export default TiledLayer;
