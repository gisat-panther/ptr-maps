import memoize from 'moize';
import {mapStyle} from '@gisatcz/ptr-utils';
import flip from '@turf/flip';
import constants from '../../../constants';
import styleUtils from '../../../utils/style';

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
	let {
		outlineColor, // eslint-disable-line no-unused-vars
		outlineWidth, // eslint-disable-line no-unused-vars
		outlineOpacity, // eslint-disable-line no-unused-vars
		fillOpacity, // eslint-disable-line no-unused-vars
		fill, // eslint-disable-line no-unused-vars
		size, // eslint-disable-line no-unused-vars
		volume, // eslint-disable-line no-unused-vars
		...finalStyle
	} = style;

	finalStyle.color = style.outlineColor ? style.outlineColor : null;
	finalStyle.weight = style.outlineWidth ? style.outlineWidth : 0;
	finalStyle.opacity =
		style.outlineOpacity || style.outlineOpacity === 0
			? style.outlineOpacity
			: 1;
	finalStyle.fillOpacity =
		style.fillOpacity || style.fillOpacity === 0 ? style.fillOpacity : 1;
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
	if (
		feature.geometry.type === 'Point' ||
		feature.geometry.type === 'MultiPoint'
	) {
		if (style.size) {
			finalStyle.radius = style.size / 2;
		} else if (style.volume) {
			finalStyle.radius = Math.sqrt(style.volume / Math.PI);
		}
	}

	return finalStyle;
}

/**
 * Leaflet requires coordinates in different order than GeoJSON standard
 * @param feature {GeoJSONFeature}
 */
const convertCoordinatesMemo = memoize(feature => {
	// TODO do we need turf for this?
	const flippedFeature = flip(feature);
	return (
		flippedFeature &&
		flippedFeature.geometry &&
		flippedFeature.geometry.coordinates
	);
});

const getDefaultStyle = (feature, styleDefinition) => {
	const defaultStyleObject = styleUtils.getDefaultStyleObject(
		feature,
		styleDefinition
	);
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
	const defaultStyleObject = styleUtils.getDefaultStyleObject(
		feature,
		styleDefinition
	);
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
				styleUtils.getSelectedStyleObject(selectedStyleDefinition)
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

/**
 * Prepare element style by shape
 * @param leafletStyle {Object} Leaflet style definition
 * @return {Object} calculated style object
 */
const getMarkerShapeCssStyle = leafletStyle => {
	switch (leafletStyle.shape) {
		case 'square':
			return getMarkerShapeSquareStyle(leafletStyle);
		case 'diamond':
			return getMarkerShapeSquareStyle(leafletStyle, 45);
		case 'circle':
		default:
			return getMarkerShapeCircleStyle(leafletStyle);
	}
};

/**
 * @param leafletStyle {Object} Leaflet style definition
 * @return {Object} calculated style object
 */
const getMarkerShapeCircleStyle = leafletStyle => {
	return getMarkerShapeSquareStyle(leafletStyle, null, leafletStyle.radius);
};

/**
 * @param leafletStyle {Object} Leaflet style definition
 * @param rotation {number}
 * @param borderRadius {number}
 * @return {Object} calculated style object
 */
const getMarkerShapeSquareStyle = (leafletStyle, rotation, borderRadius) => {
	let style = {};
	if (leafletStyle.radius) {
		style.width = leafletStyle.radius * 2 + 'px';
		style.height = leafletStyle.radius * 2 + 'px';
	}

	if (leafletStyle.fillColor) {
		if (leafletStyle.fillOpacity && leafletStyle.fillOpacity !== 1) {
			const rgb = mapStyle.hexToRgb(leafletStyle.fillColor);
			style[
				'backgroundColor'
			] = `rgba(${rgb.r},${rgb.g},${rgb.b},${leafletStyle.fillOpacity})`;
		} else {
			style['backgroundColor'] = leafletStyle.fillColor;
		}
	}

	if (leafletStyle.color) {
		if (leafletStyle.opacity && leafletStyle.opacity !== 1) {
			const rgb = mapStyle.hexToRgb(leafletStyle.color);
			style[
				'borderColor'
			] = `rgba(${rgb.r},${rgb.g},${rgb.b},${leafletStyle.opacity})`;
		} else {
			style['borderColor'] = leafletStyle.color;
		}
	}

	if (leafletStyle.weight) {
		style['borderStyle'] = 'solid';
		style['borderWidth'] = leafletStyle.weight + 'px';
	} else {
		style['borderWidth'] = 0;
	}

	if (borderRadius) {
		style['borderRadius'] = borderRadius + 'px';
	}

	if (rotation) {
		style.transform = 'rotate(' + rotation + 'deg)';
	}

	return style;
};

/**
 * Prepare element style
 * @param leafletStyle {Object} Leaflet style definition
 * @param leafletStyle.color {string} hex code of outline color
 * @param leafletStyle.fillColor {string} hex code of fill color
 * @param leafletStyle.fillOpacity {number} range from 0 to 1, where 0 is transparent and 1 is fully opaque
 * @param leafletStyle.icon {string} icon id
 * @param leafletStyle.iconFill {string} hex code of icon fill color
 * @param leafletStyle.opacity {number} Outline opacity. range from 0 to 1, where 0 is transparent and 1 is fully opaque
 * @param leafletStyle.radius {number} Shape radius is a half of shape height/width
 * @param leafletStyle.shape {string} shape id
 * @param leafletStyle.weight {number} outline width
 * @return {Object} calculated style object suitable for SVG
 */
const getMarkerShapeSvgStyle = leafletStyle => {
	let style = {};
	if (leafletStyle.radius) {
		const size = leafletStyle.radius * 2 + (leafletStyle.weight || 0);
		style.width = size + 'px';
		style.height = size + 'px';
	}

	if (leafletStyle.fillColor) {
		style.fill = leafletStyle.fillColor;
	}

	if (leafletStyle.fillOpacity || leafletStyle.fillOpacity === 0) {
		style.fillOpacity = leafletStyle.fillOpacity;
	}

	if (leafletStyle.color) {
		style.stroke = leafletStyle.color;
	}

	if (leafletStyle.opacity) {
		style.strokeOpacity = leafletStyle.opacity;
	}

	if (leafletStyle.weight) {
		style.strokeWidth = leafletStyle.weight + 'px';
	} else {
		style.strokeWidth = 0;
	}

	if (leafletStyle.iconFill) {
		style.iconFill = leafletStyle.iconFill;
	}

	return style;
};

export default {
	calculateStyle,
	calculateStylesMemo,
	convertCoordinatesMemo,

	getDefaultStyle,
	getFeatureAccentedStyle,
	getFeatureDefaultStyle,
	getFeatureLeafletStyle,
	getMarkerShapeCssStyle,
	getMarkerShapeSvgStyle,
};
