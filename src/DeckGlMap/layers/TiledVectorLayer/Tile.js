import PropTypes from 'prop-types';
import {CompositeLayer} from '@deck.gl/core';

import VectorLayer from '../VectorLayer';
import {getFeatureKeysToOmit} from '../../../ReactLeafletMap/layers/TiledVectorLayer/Tile';

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
