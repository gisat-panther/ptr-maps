import {mapStyle} from '@gisatcz/ptr-utils';
import constants from '../../../constants';
import memoize from 'memoize-one';
import * as turf from '@turf/turf';

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

/**
 * @param feature {GeoJSONFeature}
 * @param defaultStyleObject {Object} Panther style definition
 * @return {Object}
 */
function getFeatureDefaultStyle(feature, defaultStyleObject) {
	return getFeatureLeafletStyle(feature, defaultStyleObject);
}

/**
 * @param feature {GeoJSONFeature}
 * @param defaultStyleObject {Object} Panther style definition
 * @param accentedStyleObject {Object} Panther style definition
 * @return {Object}
 */
function getFeatureAccentedStyle(
	feature,
	defaultStyleObject,
	accentedStyleObject
) {
	const style = {...defaultStyleObject, ...accentedStyleObject};
	return getFeatureLeafletStyle(feature, style);
}

/**
 * @param feature {GeoJSONFeature}
 * @param style {Object} Panther style definition
 * @return {Object} Leaflet style definition
 */
function getFeatureLeafletStyle(feature, style) {
	let finalStyle = {};

	finalStyle.color = style.outlineColor ? style.outlineColor : null;
	finalStyle.weight = style.outlineWidth ? style.outlineWidth : 0;
	finalStyle.opacity = style.outlineOpacity ? style.outlineOpacity : 1;
	finalStyle.fillOpacity = style.fillOpacity ? style.fillOpacity : 1;
	finalStyle.fillColor = style.fill;

	if (!style.fill) {
		finalStyle.fillColor = null;
		finalStyle.fillOpacity = 0;
	}

	if (!style.outlineColor || !style.outlineWidth) {
		finalStyle.color = null;
		finalStyle.opacity = 0;
		finalStyle.weight = 0;
	}

	// for point features, set radius
	if (feature.geometry.type === 'Point') {
		if (style.size) {
			finalStyle.radius = style.size;
		} else if (style.volume) {
			finalStyle.radius = Math.sqrt(style.volume / Math.PI);
		}
	}

	if (style.shape) {
		finalStyle.shape = style.shape;
	}

	return finalStyle;
}

/**
 * Leaflet requires coordinates in different order than GeoJSON standard
 * @param feature {GeoJSONFeature}
 */
const convertCoordinatesMemo = memoize(feature => {
	// TODO do we need turf for this?
	const flippedFeature = turf.flip(feature);
	return (
		flippedFeature &&
		flippedFeature.geometry &&
		flippedFeature.geometry.coordinates
	);
});

const getDefaultStyle = (feature, styleDefinition) => {
	const defaultStyleObject = getDefaultStyleObject(feature, styleDefinition);
	return getFeatureDefaultStyle(feature, defaultStyleObject);
};

const calculateStyle = (
	feature,
	styleDefinition,
	hoveredStyleDefinition,
	selected,
	selectedStyleDefinition,
	selectedHoveredStyleDefinition
) => {
	// Prepare default style
	const defaultStyleObject = getDefaultStyleObject(feature, styleDefinition);
	const defaultStyle = getFeatureDefaultStyle(feature, defaultStyleObject);

	// Prepare hovered style
	let hoveredStyleObject = null;
	let hoveredStyle = null;
	if (hoveredStyleDefinition) {
		hoveredStyleObject =
			hoveredStyleDefinition === 'default'
				? constants.vectorFeatureStyle.hovered
				: hoveredStyleDefinition;
		hoveredStyle = getFeatureAccentedStyle(
			feature,
			defaultStyleObject,
			hoveredStyleObject
		);
	}

	// Prepare selected and selected hovered style, if selected
	let selectedStyle = null;
	let selectedHoveredStyle = null;
	if (selected) {
		let selectedHoveredStyleObject = null;
		if (selectedStyleDefinition) {
			selectedStyle = getFeatureAccentedStyle(
				feature,
				defaultStyleObject,
				getSelectedStyleObject(selectedStyleDefinition)
			);
		}
		if (selectedHoveredStyleDefinition) {
			selectedHoveredStyleObject =
				selectedHoveredStyleDefinition === 'default'
					? constants.vectorFeatureStyle.selectedHovered
					: selectedHoveredStyleDefinition;
			selectedHoveredStyle = getFeatureAccentedStyle(
				feature,
				defaultStyleObject,
				selectedHoveredStyleObject
			);
		}
	}

	return {
		default: defaultStyle,
		hovered: hoveredStyle,
		selected: selectedStyle,
		selectedHovered: selectedHoveredStyle,
	};
};

const calculateStylesMemo = memoize(calculateStyle);

export default {
	calculateStyle,
	calculateStylesMemo,
	convertCoordinatesMemo,

	getDefaultStyle,
	getDefaultStyleObject,
	getFeatureAccentedStyle,
	getFeatureDefaultStyle,
	getFeatureLeafletStyle,
	getSelectedStyleObject,
};
