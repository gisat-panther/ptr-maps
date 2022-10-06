import {stateManagement} from '@gisatcz/ptr-utils';

/**
 * Get feature key
 * @param fidColumnName {string}
 * @param feature {GeoJSONFeature}
 * @returns {string}
 */
function getKey(fidColumnName, feature) {
	return feature.id || feature.properties[fidColumnName];
}

/**
 * Get selected feature keys (based on selection type)
 * @param fidColumnName {string}
 * @param feature {GeoJSONFeature}
 * @param isMultiSelect {boolean}
 * @param [previousSelectedFeatureKeys] {Array}
 * @return {Array} List of feature keys
 */
function getSelectedFeatureKeysOnClick(
	fidColumnName,
	feature,
	isMultiSelect,
	previousSelectedFeatureKeys
) {
	const currentFeatureKey = getKey(fidColumnName, feature);

	if (previousSelectedFeatureKeys?.length) {
		const alreadySelectedIndex =
			previousSelectedFeatureKeys.indexOf(currentFeatureKey);

		if (isMultiSelect) {
			if (alreadySelectedIndex !== -1) {
				return stateManagement.removeItemByIndex(
					previousSelectedFeatureKeys,
					alreadySelectedIndex
				);
			} else {
				return [...previousSelectedFeatureKeys, currentFeatureKey];
			}
		} else {
			if (alreadySelectedIndex !== -1) {
				return [];
			} else {
				return [currentFeatureKey];
			}
		}
	} else {
		return [currentFeatureKey];
	}
}

export default {
	getKey,
	getSelectedFeatureKeysOnClick,
};
