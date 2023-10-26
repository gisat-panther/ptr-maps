// Original file is from Deck.gl
// https://github.com/visgl/deck.gl/blob/master/modules/layers/src/geojson-layer/geojson-binary.ts

/**
 * Return the feature for an accessor
 */
export function binaryToFeatureForAccessor(data, index) {
	if (!data) {
		return null;
	}

	const featureIndex =
		'startIndices' in data ? data.startIndices[index] : index;
	const geometryIndex = data.featureIds.value[featureIndex];

	if (featureIndex !== -1) {
		return getPropertiesForIndex(data, geometryIndex, featureIndex);
	}

	return null;
}

export function getPropertiesForIndex(
	data,
	propertiesIndex,
	numericPropsIndex
) {
	const feature = {
		properties: {...data.properties[propertiesIndex]},
	};

	for (const prop in data.numericProps) {
		feature.properties[prop] = data.numericProps[prop].value[numericPropsIndex];
	}

	return feature;
}
