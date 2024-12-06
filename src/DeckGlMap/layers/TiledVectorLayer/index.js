import {CompositeLayer} from '@deck.gl/core';
import Tile from './Tile';
import {
	forEach as _forEach,
	forIn as _forIn,
	includes as _includes,
	isEmpty as _isEmpty,
	uniq as _uniq,
} from 'lodash';

/**
 * @param uniqueLayerKey {string}
 * @param tile {Object}
 * @return {string}
 */
function getTileKey(uniqueLayerKey, tile) {
	return `${uniqueLayerKey}_${tile.level}_${
		typeof tile.tile === 'string' ? tile.tile : JSON.stringify(tile.tile)
	}`;
}

/**
 * @param uniqueLayerKey {string}
 * @param tiles {Array}
 * @param fidColumnName {string}
 * @param selections {Object}
 * @return {Object} groupedFeatures - a collection of features grouped by tile key, groupedFeaturesKeys - a collection of feature keys grouped by tile key
 */
function getFeaturesGroupedByTileKey(
	uniqueLayerKey,
	tiles,
	fidColumnName,
	selections
) {
	let groupedFeatures = [];
	let groupedFeatureKeys = [];
	let selected = {};

	_forEach(tiles, tile => {
		// TODO pass featureKeys or filters
		const key = getTileKey(uniqueLayerKey, tile);
		let tileFeatureKeys = [];

		if (tile.features) {
			_forEach(tile.features, feature => {
				const fid = feature.id || feature.properties[fidColumnName];

				if (selections) {
					_forIn(selections, (selection, selectionKey) => {
						if (selection.keys && _includes(selection.keys, fid)) {
							if (selected[selectionKey]?.features) {
								selected[selectionKey].features[fid] = feature;
								selected[selectionKey].featureKeys.push(fid);
							} else {
								selected[selectionKey] = {
									features: {
										[fid]: feature,
									},
									featureKeys: [fid],
									level: tile.level,
								};
							}
						}
					});
				}

				tileFeatureKeys.push(fid);
			});
		}

		groupedFeatures.push({
			...tile,
			key,
		});

		groupedFeatureKeys.push({
			key,
			featureKeys: tileFeatureKeys,
		});
	});

	if (!_isEmpty(selected)) {
		_forIn(selected, (selection, selectionKey) => {
			const key = `${uniqueLayerKey}_${selectionKey}_${selection.level}`;
			groupedFeatures.unshift({
				key,
				features: Object.values(selection.features),
				level: selection.level,
				withSelectedFeaturesOnly: true,
			});

			groupedFeatureKeys.unshift({
				key,
				featureKeys: _uniq(selection.featureKeys),
			});
		});
	}

	return {groupedFeatures, groupedFeatureKeys};
}

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
