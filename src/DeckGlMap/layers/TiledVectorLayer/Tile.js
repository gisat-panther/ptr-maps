import PropTypes from 'prop-types';
import {forEach as _forEach, findIndex as _findIndex} from 'lodash';
import {CompositeLayer} from '@deck.gl/core';
import {_TerrainExtension as TerrainExtension} from '@deck.gl/extensions';

import VectorLayer from '../VectorLayer';

/**
 * @param featureKeysGroupedByTileKey {Array} A collection of feature keys by tile key
 * @param tileKey {String} unique tile identifier
 * @param features {Array} List of current tile's features
 * @param fidColumnName {String}
 * @return {[]|null} List of feature keys to omit
 */
function getFeatureKeysToOmit(
	featureKeysGroupedByTileKey,
	tileKey,
	features,
	fidColumnName
) {
	// Find the order of current tile among others
	const indexOfCurrentTile = _findIndex(featureKeysGroupedByTileKey, tile => {
		return tile.key === tileKey;
	});

	let i = 0;
	if (indexOfCurrentTile >= 0) {
		let featureKeysToOmit = [];
		let renderedFeatureKeys = new Set();

		// Iterate over sibling tiles that should be rendered earlier
		// TODO don't iterate through features in each tile again
		while (i < indexOfCurrentTile) {
			const tile = featureKeysGroupedByTileKey[i];
			_forEach(tile.featureKeys, featureKey => {
				renderedFeatureKeys.add(featureKey);
			});
			i++;
		}

		// Iterate over current tile's features to find which features are rendered already
		_forEach(features, feature => {
			const featureKey = feature.id || feature.properties[fidColumnName];
			if (featureKey && renderedFeatureKeys.has(featureKey)) {
				featureKeysToOmit.push(featureKey);
			}
		});

		return featureKeysToOmit.length ? featureKeysToOmit : null;
	} else {
		return null;
	}
}

class Tile extends CompositeLayer {
	renderLayers() {
		const {tileKey, featureKeysGroupedByTileKey} = this.props;
		const omittedFeatureKeys = getFeatureKeysToOmit(
			featureKeysGroupedByTileKey,
			tileKey,
			this.props.features,
			this.props.fidColumnName
		);
		return [
			new VectorLayer(
				this.getSubLayerProps({
					omittedFeatureKeys: omittedFeatureKeys,

					options: {...this.props.options, features: this.props.features},
					id: this.props.key,
					key: this.props.key,
					layerKey: this.props.layerKey || this.props.key,
					onClick: this.props.onVectorLayerClick,
					autoHighlight: this.props.hoverable,
					styleForDeck: this.props.styleForDeck,
					pointAsMarker: this.props.pointAsMarker,
					extensions: this.props?.options?.clampToTerrain
						? [new TerrainExtension()]
						: [],
					...(this.props?.options?.clampToTerrain?.terrainDrawMode
						? {
								terrainDrawMode:
									this.props.options.clampToTerrain.terrainDrawMode,
						  }
						: {}),
				})
			),
		];
	}
}
Tile.propTypes = {
	tileKey: PropTypes.string,
	features: PropTypes.array,
	fidColumnName: PropTypes.string,
	level: PropTypes.number,
	tile: PropTypes.oneOfType([PropTypes.array, PropTypes.string]),
	featureKeysGroupedByTileKey: PropTypes.array, // a collection of all tiles and their features for each tile in the layer
	view: PropTypes.object,
	zoom: PropTypes.number,
	width: PropTypes.number,
	height: PropTypes.number,
	crs: PropTypes.string,
	boxRangeRange: PropTypes.array,
	omittedFeatureKeys: PropTypes.array,
	style: PropTypes.object,
	mapKey: PropTypes.string,
	layerKey: PropTypes.string,
	uniqueLayerKey: PropTypes.string,
	onClick: PropTypes.func,
	opacity: PropTypes.number,
	type: PropTypes.string,
	zIndex: PropTypes.number,
	hovered: PropTypes.object,
	hoverable: PropTypes.bool,
	hoveredStyleDefinition: PropTypes.object,
	selectable: PropTypes.bool,
	selected: PropTypes.object,
};
export default Tile;
