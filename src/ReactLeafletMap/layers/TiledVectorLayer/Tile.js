import {useRef} from 'react';
import {
	findIndex as _findIndex,
	forEach as _forEach,
	isEqual as _isEqual,
} from 'lodash';
import PropTypes from 'prop-types';
import memoize from 'moize';

import IndexedVectorLayer from '../IndexedVectorLayer';
import CanvasVectorLayer from '../CanvasVectorLayer';
import SvgVectorLayer from '../SvgVectorLayer';

/**
 * @param featureKeysGroupedByTileKey {Array} A collection of feature keys by tile key
 * @param tileKey {String} unique tile identifier
 * @param features {Array} List of current tile's features
 * @param fidColumnName {String}
 * @return {[]|null} List of feature keys to omit
 */
export function getFeatureKeysToOmit(
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

/**
 * Return true, if previous feature keys are the same as the next
 * @param prev {Array} previous arguments
 * @param next {Array} next arguments
 * @return {boolean}
 */
function checkIdentity(prev, next) {
	const prevKeys = prev[0];
	const nextKeys = next[0];

	if (!prevKeys && !nextKeys) {
		return true;
	} else if (!prevKeys || !nextKeys) {
		return false;
	} else {
		//performance suggestion
		// return prevKeys.sort().join(',') === nextKeys.sort().join(',')
		return _isEqual(prevKeys.sort(), nextKeys.sort());
	}
}

const Tile = ({
	tileKey,
	featureKeysGroupedByTileKey,
	renderingTechnique,
	level,
	tile,
	view,
	zoom,
	width,
	height,
	crs,
	boxRangeRange,
	features,
	style,
	mapKey,
	layerKey,
	onClick,
	opacity,
	resources,
	type,
	zIndex,
	fidColumnName,
	hovered,
	hoverable,
	hoveredStyleDefinition,
	pointAsMarker,
	selectable,
	selected,
}) => {
	const getFeatureKeysToOmitMemoized = useRef(memoize(getFeatureKeysToOmit));
	const checkIdentityMemoized = useRef(memoize(keys => keys, checkIdentity));

	// const {tileKey, featureKeysGroupedByTileKey, component, ...props} =
	// 	this.props;
	const omittedFeatureKeys = getFeatureKeysToOmitMemoized.current(
		featureKeysGroupedByTileKey,
		tileKey,
		features,
		fidColumnName
	);

	if (renderingTechnique === 'canvas') {
		return (
			<CanvasVectorLayer
				{...{
					features,
					fidColumnName,
					level,
					tile,
				}}
				key={tileKey}
				uniqueLayerKey={tileKey}
				omittedFeatureKeys={checkIdentityMemoized.current(omittedFeatureKeys)}
			/>
		);
	} else {
		return (
			<IndexedVectorLayer
				{...{
					view,
					zoom,
					width,
					height,
					crs,
					boxRangeRange,
					features,
					style,
					mapKey,
					layerKey,
					onClick,
					opacity,
					resources,
					type,
					zIndex,
					fidColumnName,
					hovered,
					hoverable,
					hoveredStyleDefinition,
					pointAsMarker,
					selectable,
					selected,
				}}
				component={SvgVectorLayer}
				key={tileKey}
				uniqueLayerKey={tileKey}
				omittedFeatureKeys={checkIdentityMemoized.current(omittedFeatureKeys)}
			/>
		);
	}
};

Tile.propTypes = {
	tileKey: PropTypes.string,
	features: PropTypes.array,
	fidColumnName: PropTypes.string,
	level: PropTypes.number,
	tile: PropTypes.oneOfType([PropTypes.array, PropTypes.string]),
	featureKeysGroupedByTileKey: PropTypes.array, // a collection of all tiles and their features for each tile in the layer
	renderingTechnique: PropTypes.string,
	view: PropTypes.object,
	zoom: PropTypes.number,
	component: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
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
	resources: PropTypes.object,
	type: PropTypes.string,
	zIndex: PropTypes.number,
	hovered: PropTypes.object,
	hoverable: PropTypes.bool,
	hoveredStyleDefinition: PropTypes.object,
	pointAsMarker: PropTypes.bool,
	selectable: PropTypes.bool,
	selected: PropTypes.object,
};

export default Tile;
