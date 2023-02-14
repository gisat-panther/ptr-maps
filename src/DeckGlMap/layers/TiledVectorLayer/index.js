import {CompositeLayer} from '@deck.gl/core';
import {getFeaturesGroupedByTileKey} from '../../../ReactLeafletMap/layers/TiledVectorLayer';
import Tile from './Tile';

class TiledVectorLayer extends CompositeLayer {
	constructor(props) {
		super(props);
		this.getTileLayer = this.getTileLayer.bind(this);
		this.getTilesLayers = this.getTilesLayers.bind(this);
	}

	getTileLayer(tile, data) {
		return new Tile(
			this.getSubLayerProps({
				features: tile.features,
				...this.props,
				key: tile.key,
				tileKey: tile.key,
				featureKeysGroupedByTileKey: data.groupedFeatureKeys,
				fidColumnName: this.props?.options?.fidColumnName,
			})
		);
	}

	getTilesLayers() {
		const tiles = this.props?.options?.tiles;
		const fidColumnName = this.props?.options?.fidColumnName;
		const selected = this.props?.selected;
		const uniqueLayerKey = this.props?.uniqueLayerKey;
		const data = getFeaturesGroupedByTileKey(
			uniqueLayerKey,
			tiles,
			fidColumnName,
			selected
		);
		return data?.groupedFeatures?.map(t => this.getTileLayer(t, data));
	}

	renderLayers() {
		const tilesLayers = this.getTilesLayers();
		return [tilesLayers];
	}
}

export default TiledVectorLayer;
