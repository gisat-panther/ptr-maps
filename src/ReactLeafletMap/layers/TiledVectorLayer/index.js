import {useRef} from 'react';
import {
	forEach as _forEach,
	forIn as _forIn,
	includes as _includes,
	isEmpty as _isEmpty,
	uniq as _uniq,
} from 'lodash';
import PropTypes from 'prop-types';
import memoize from 'memoize-one';

import Tile from './Tile';

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

const TiledVectorLayer = ({
	fidColumnName,
	tiles,
	layerKey,
	selected,
	uniqueLayerKey,
}) => {
	const getFeaturesGroupedByTileKeyMemoized = useRef(
		memoize(getFeaturesGroupedByTileKey)
	);

	const data = getFeaturesGroupedByTileKeyMemoized.current(
		uniqueLayerKey,
		tiles,
		fidColumnName,
		selected
	);

	if (data.groupedFeatures?.length) {
		return data.groupedFeatures.map(tile => {
			return (
				<Tile
					layerKey={layerKey}
					selected={selected}
					uniqueLayerKey={uniqueLayerKey}
					key={tile.key}
					tileKey={tile.key}
					features={tile.features}
					level={tile.level}
					tile={tile.tile}
					featureKeysGroupedByTileKey={data.groupedFeatureKeys}
					withSelectedFeaturesOnly={tile.withSelectedFeaturesOnly}
				/>
			);
		});
	} else {
		return null;
	}
};

TiledVectorLayer.propTypes = {
	fidColumnName: PropTypes.string,
	tiles: PropTypes.array,
	layerKey: PropTypes.string,
	uniqueLayerKey: PropTypes.string,
	selected: PropTypes.bool,
};
export default TiledVectorLayer;
