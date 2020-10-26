import React from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import {withLeaflet} from "react-leaflet";
import memoize from "memoize-one";

import Tile from "./Tile";

/**
 * @param uniqueLayerKey {string}
 * @param tile {Object}
 * @return {string}
 */
function getTileKey(uniqueLayerKey, tile) {
	return `${uniqueLayerKey}_${tile.level}_${JSON.stringify(tile.tile)}`;
}

/**
 * @param uniqueLayerKey {string}
 * @param tiles {Array}
 * @param fidColumnName {string}
 * @return {[]} A collection of feature keys grouped by tile key
 */
function getFeatureKeysGroupedByTileKey(uniqueLayerKey, tiles, fidColumnName)  {
	let groupedKeys = [];
	_.forEach(tiles, tile => {
		groupedKeys.push({
			tileKey: getTileKey(uniqueLayerKey, tile),
			featureKeys: tile.features.map(feature => feature.id || feature.properties[fidColumnName])
		})
	});

	return groupedKeys;
}

class TiledVectorLayer extends React.PureComponent {
	static propTypes = {
		fidColumnName: PropTypes.string,
		tiles: PropTypes.array,
		layerKey: PropTypes.string,
		uniqueLayerKey: PropTypes.string
	};

	constructor(props) {
		super(props);

		this.getFeatureKeysGroupedByTileKey = memoize(getFeatureKeysGroupedByTileKey);
	}

	render() {
		const {tiles, ...props} = this.props;
		const featureKeysGroupedByTileKey = this.getFeatureKeysGroupedByTileKey(props.uniqueLayerKey, tiles, props.fidColumnName);

		if (tiles?.length) {
			return tiles.map(tile => {
				const tileKey = getTileKey(props.uniqueLayerKey, tile);

				return (
					<Tile
						{...props}
						key={tileKey}
						tileKey={tileKey}
						features={tile.features}
						level={tile.level}
						tile={tile.tile}
						featureKeysGroupedByTileKey={featureKeysGroupedByTileKey}
					/>
				);
			});
		} else {
			return null;
		}

	}
}

export default withLeaflet(TiledVectorLayer);