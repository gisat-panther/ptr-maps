import {CompositeLayer} from '@deck.gl/core';
import {TileLayer} from '@deck.gl/geo-layers';
import {BitmapLayer} from '@deck.gl/layers';
import {mapConstants} from '@gisatcz/ptr-core';

class TiledLayer extends CompositeLayer {
	renderLayers() {
		return [this.renderTiledLayer()];
	}

	renderTiledLayer() {
		const {options} = this.props;
		const {url, minNativeZoom, maxNativeZoom, tileSize} = options;

		return new TileLayer({
			data: url,
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
