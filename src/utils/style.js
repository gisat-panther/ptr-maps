import {mapStyle} from '@gisatcz/ptr-utils';
import constants from '../constants';

/**
 * @param feature {GeoJSONFeature}
 * @param styleDefinition {Object} Panther style definition
 * @return {Object}
 */
function getDefaultStyleObject(feature, styleDefinition) {
	return mapStyle.getStyleObject(
		feature.properties,
		styleDefinition || constants.vectorFeatureStyle.defaultFull
	);
}

/**
 * @param selectedStyleDefinition {Object} Panther style definition
 * @return {Object}
 */
function getSelectedStyleObject(selectedStyleDefinition) {
	return selectedStyleDefinition === 'default'
		? constants.vectorFeatureStyle.selected
		: selectedStyleDefinition;
}

export default {
	getDefaultStyleObject,
	getSelectedStyleObject,
};
