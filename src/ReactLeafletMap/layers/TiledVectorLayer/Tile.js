import React from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import {withLeaflet} from "react-leaflet";
import memoize from "memoize-one";

import IndexedVectorLayer from "../IndexedVectorLayer";
import VectorLayer from "../VectorLayer";

/**
 * @param featureKeysGroupedByTileKey {Array} A collection of feature keys by tile key
 * @param tileKey {String} unique tile identifier
 * @param features {Array} List of current tile's features
 * @param fidColumnName {String}
 * @return {[]|null} List of feature keys to omit
 */
function getFeatureKeysToOmit(featureKeysGroupedByTileKey, tileKey, features, fidColumnName){
	// Find the order of current tile among others
	const indexOfCurrentTile = _.findIndex(featureKeysGroupedByTileKey, (tile) => {return tile.tileKey === tileKey});

	let i = 0;
	if (indexOfCurrentTile > 0) {
		let featureKeysToOmit = [];
		let renderedFeatureKeys = new Set();

		// Iterate over sibling tiles that should be rendered earlier
		// TODO don't iterate through features in each tile again
		while (i < indexOfCurrentTile) {
			const tile = featureKeysGroupedByTileKey[i];
			_.forEach(tile.featureKeys, featureKey => {
				renderedFeatureKeys.add(featureKey);
			});
			i++;
		}

		// Iterate over current tile's features to find which features are rendered already
		_.forEach(features, feature => {
			// TODO feature.id
			const featureKey = feature.properties[fidColumnName];
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
		return _.isEqual(prevKeys.sort(), nextKeys.sort());
	}
}

class Tile extends React.PureComponent {
	static propTypes = {
		tileKey: PropTypes.string,
		features: PropTypes.array,
		fidColumnName: PropTypes.string,
		level: PropTypes.number,
		tile: PropTypes.array,
		featureKeysGroupedByTileKey: PropTypes.array // a collection of all tiles and their features for each tile in the layer
	};

	constructor(props) {
		super(props);

		this.getFeatureKeysToOmit = memoize(getFeatureKeysToOmit);

		// return memoized feature keys, if nothing changed and not render IndexedVectorLayer again
		this.checkIdentity = memoize(keys => keys, checkIdentity);
	}

	render() {
		const {tileKey, featureKeysGroupedByTileKey, ...props} = this.props;
		const omittedFeatureKeys = this.getFeatureKeysToOmit(featureKeysGroupedByTileKey, tileKey, props.features, props.fidColumnName);

		return (
			<IndexedVectorLayer
				{...props}
				component={VectorLayer}
				key={tileKey}
				uniqueLayerKey={tileKey}
				omittedFeatureKeys={this.checkIdentity(omittedFeatureKeys)}
			/>
		);
	}
}

export default withLeaflet(Tile);
