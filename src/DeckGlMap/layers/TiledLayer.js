import {flatten as _flatten} from 'lodash';
import {CompositeLayer} from '@deck.gl/core';
import {TileLayer} from '@deck.gl/geo-layers';
import {BitmapLayer} from '@deck.gl/layers';
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
		const {options, key} = this.props;
		const {url, urls, minNativeZoom, maxNativeZoom, tileSize} = options;

		let finalUrls = urls
			? _flatten(urls.map(url => this.getValidUrlTemplates(url)))
			: this.getValidUrlTemplates(url);

		return new TileLayer({
			id: `${key}-tileLayer`,
			data: finalUrls,
			minZoom: minNativeZoom || mapConstants.defaultLevelsRange[0],
			maxZoom: maxNativeZoom || mapConstants.defaultLevelsRange[1],
			tileSize: tileSize || 256,

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
