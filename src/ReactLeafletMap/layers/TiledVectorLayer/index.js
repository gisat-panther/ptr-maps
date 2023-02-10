import {useRef} from 'react';
import {
	forEach as _forEach,
	forIn as _forIn,
	includes as _includes,
	isEmpty as _isEmpty,
	uniq as _uniq,
} from 'lodash';
import PropTypes from 'prop-types';
import memoize from 'moize';

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
	renderingTechnique,
	view,
	zoom,
	width,
	height,
	crs,
	boxRangeRange,
	style,
	mapKey,
	onClick,
	opacity,
	resources,
	type,
	zIndex,
	hovered,
	hoverable,
	hoveredStyleDefinition,
	pointAsMarker,
	selectable,
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
					key={tile.key}
					tileKey={tile.key}
					featureKeysGroupedByTileKey={data.groupedFeatureKeys}
					renderingTechnique={renderingTechnique}
					level={tile.level}
					tile={tile.tile}
					features={tile.features}
					withSelectedFeaturesOnly={tile.withSelectedFeaturesOnly}
					view={view}
					zoom={zoom}
					width={width}
					height={height}
					crs={crs}
					boxRangeRange={boxRangeRange}
					style={style}
					mapKey={mapKey}
					layerKey={layerKey}
					uniqueLayerKey={uniqueLayerKey}
					onClick={onClick}
					opacity={opacity}
					resources={resources}
					type={type}
					zIndex={zIndex}
					fidColumnName={fidColumnName}
					hovered={hovered}
					hoverable={hoverable}
					hoveredStyleDefinition={hoveredStyleDefinition}
					pointAsMarker={pointAsMarker}
					selectable={selectable}
					selected={selected}
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
	selected: PropTypes.object,
	view: PropTypes.object,
	zoom: PropTypes.number,
	width: PropTypes.number,
	height: PropTypes.number,
	crs: PropTypes.string,
	boxRangeRange: PropTypes.array,
	style: PropTypes.object,
	mapKey: PropTypes.string,
	onClick: PropTypes.func,
	opacity: PropTypes.number,
	resources: PropTypes.object,
	type: PropTypes.string,
	zIndex: PropTypes.number,
	hovered: PropTypes.object,
	hoverable: PropTypes.bool,
	hoveredStyleDefinition: PropTypes.object,
	pointAsMarker: PropTypes.bool,
	selectable: PropTypes.bool,
	renderingTechnique: PropTypes.string,
};
export default TiledVectorLayer;
