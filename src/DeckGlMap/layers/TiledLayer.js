import {CompositeLayer} from '@deck.gl/core';
import {TileLayer} from '@deck.gl/geo-layers';
import {BitmapLayer} from '@deck.gl/layers';

class TiledLayer extends CompositeLayer {
	renderLayers() {
		return [this.renderTiledLayer()];
	}

	renderTiledLayer() {
		return new TileLayer({
			data: this.props.options.url,
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
}

export default TiledLayer;
