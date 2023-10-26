import {MVTLayer as DeckMVTLayer} from '@deck.gl/geo-layers';
import findIndexBinary from './utils/find-index-binary';
import {Matrix4} from '@math.gl/core';
import {COORDINATE_SYSTEM} from '@deck.gl/core';
import {ClipExtension} from '@deck.gl/extensions';
import VectorLayer from './VectorLayer';

const WORLD_SIZE = 512;

class MVTLayer extends DeckMVTLayer {
	constructor(props) {
		super(props);
		this.displayTooltip = true;
	}
	getHighlightedObjectIndex(tile) {
		const {hoveredFeatureId, hoveredFeatureLayerName, binary} = this.state;
		const {fidColumnName} = this.props;
		const highlightedFeatureId =
			Number(this.state.higlightedFeature) || this.state.higlightedFeature;
		const data = tile.content;
		const isHighlighted = isFeatureIdDefined(highlightedFeatureId);
		const isFeatureIdPresent =
			isFeatureIdDefined(hoveredFeatureId) || isHighlighted;

		if (!isFeatureIdPresent) {
			return -1;
		}

		const featureIdToHighlight = isHighlighted
			? highlightedFeatureId
			: hoveredFeatureId;

		// Iterable data
		if (Array.isArray(data)) {
			return data.findIndex(feature => {
				const isMatchingId =
					getFeatureUniqueId(feature, fidColumnName) === featureIdToHighlight;
				const isMatchingLayer =
					isHighlighted ||
					getFeatureLayerName(feature) === hoveredFeatureLayerName;
				return isMatchingId && isMatchingLayer;
			});

			// Non-iterable data
		} else if (data && binary) {
			// Get the feature index of the selected item to highlight
			return findIndexBinary(
				data,
				fidColumnName,
				featureIdToHighlight,
				isHighlighted ? '' : hoveredFeatureLayerName
			);
		}

		return -1;
	}
	onClick(obj, evt) {
		obj.tile.layers[0].onClick(obj, evt);
		return true;
	}

	/**
	 * Call on feature hover
	 * @param data {Object}
	 */
	// FIXME
	// onHover(obj, evt) {
	// obj.tile.layers[0].onClick(obj, evt);
	// return true;
	// }

	renderSubLayers(props) {
		const {x, y, z} = props.tile.index;
		const worldScale = Math.pow(2, z);

		const xScale = WORLD_SIZE / worldScale;
		const yScale = -xScale;

		const xOffset = (WORLD_SIZE * x) / worldScale;
		const yOffset = WORLD_SIZE * (1 - y / worldScale);

		const modelMatrix = new Matrix4().scale([xScale, yScale, 1]);

		props.autoHighlight = false;

		if (!this.context.viewport.resolution) {
			props.modelMatrix = modelMatrix;
			props.coordinateOrigin = [xOffset, yOffset, 0];
			props.coordinateSystem = COORDINATE_SYSTEM.CARTESIAN;
			props.extensions = [...(props.extensions || []), new ClipExtension()];
		}

		return [
			new VectorLayer({
				...props,
				key: props.id,
				options: {...props.options, features: props.data},
			}),
		];
	}
}

function getFeatureUniqueId(feature, uniqueIdProperty) {
	if (uniqueIdProperty) {
		return feature.properties[uniqueIdProperty];
	}

	if ('id' in feature) {
		return feature.id;
	}

	return -1;
}

function getFeatureLayerName(feature) {
	return feature.properties?.layerName || null;
}

function isFeatureIdDefined(value) {
	return value !== undefined && value !== null && value !== '';
}

export default MVTLayer;
