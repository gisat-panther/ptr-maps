// Original file is from Deck.gl
// https://github.com/visgl/deck.gl/blob/master/modules/layers/src/geojson-layer/geojson-binary.ts
// updates after migration to version 9 from carto file
// https://github.com/visgl/deck.gl/blob/master/modules/carto/src/layers/utils.ts

/**
 * Return the feature for an accessor
 */
export function binaryToFeatureForAccessor(data, index, indices) {
	if (!data) {
		return null;
	}

	// const featureIndex =
	// 	'startIndices' in data ? data.startIndices[index] : index;
	const startIndex = indices.value[index];
	const featureId = data.globalFeatureIds.value[startIndex];
	// const geometryIndex = data.featureIds.value[startIndex];

	if (featureId !== -1) {
		return getPropertiesForIndex(data, startIndex, startIndex);
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
