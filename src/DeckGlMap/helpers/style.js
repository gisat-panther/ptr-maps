import {mapStyle} from '@gisatcz/ptr-utils';
import {
	find as _find,
	forEach as _forEach,
	forIn as _forIn,
	isEmpty as _isEmpty,
} from 'lodash';
import memoize from 'moize';
import chroma from 'chroma-js';
import view from '../../utils/view';
import defaultStyles from '../../constants/styles';

/**
 * Get style object ready for usage in DeckGl-based layers, where colors are represented by RGB array
 * @param styleObject {Object} Panther style object
 * @param [distinctSelectionColor] {string} Color of distinct selection
 * @returns {Object} DeckGl-ready style object
 */
function getDeckReadyStyleObject(styleObject, distinctSelectionColor) {
	const {fill, outlineColor, ...restProps} = styleObject;

	let deckReadyStyleObject = {...restProps};

	// Overwrite fill or outlineColor with distinctSelectionColor if exists
	if (fill) {
		deckReadyStyleObject.fill = getDeckReadyColor(
			distinctSelectionColor || fill
		);
	}

	if (outlineColor) {
		deckReadyStyleObject.outlineColor = getDeckReadyColor(
			distinctSelectionColor || outlineColor
		);
	}

	/* If there is no fill color and outline color defined in style and at the same time there is distinctSelectionColor
	 use as outlineColor */
	if (!fill && !outlineColor && distinctSelectionColor) {
		deckReadyStyleObject.outlineColor = getDeckReadyColor(
			distinctSelectionColor
		);
	}

	return deckReadyStyleObject;
}

/**
 * Get array representing RGB values
 * @param hexColor {string} color hex code
 * @returns {Array} RGB array
 */
function getDeckReadyColor(hexColor) {
	return chroma(hexColor).rgb();
}

/**
 * Style definition prepared for the usage in DeckGl-based vector layers to optimize rendering performance
 * @param style {Object} Panther Style.definition
 * @returns {baseStyle: Object, attributeStyles: Array}
 */
function getStylesDefinitionForDeck(style) {
	// TODO multiple rules and filters?
	const styles = style?.rules[0].styles || [
		defaultStyles.vectorFeatureStyle.default,
	];
	if (styles) {
		const baseStyle = getDeckReadyStyleObject(styles[0]);
		let styleForDeck = {
			baseStyle,
		};

		let attributeStyles = [];
		for (let i = 1; i < styles.length; i++) {
			const style = styles[i];
			const attributeKey = style.attributeKey;

			if (style.attributeValues) {
				let values = {};
				_forIn(style.attributeValues, (style, value) => {
					values[value] = getDeckReadyStyleObject(style);
				});

				attributeStyles.push({
					attributeKey,
					attributeValues: values,
				});
			} else if (style.attributeClasses) {
				let classes = [];
				_forEach(style.attributeClasses, style => {
					classes.push(getDeckReadyStyleObject(style));
				});
				attributeStyles.push({
					attributeKey,
					attributeClasses: classes,
				});
			}
		}

		if (!_isEmpty(attributeStyles)) {
			styleForDeck.attributeStyles = attributeStyles;
		}

		return styleForDeck;
	} else {
		return null;
	}
}

/**
 * Return renderAs rules according to given box range
 * @param renderAs {Array} List of renderAs rule sets
 * @param boxRange {number} Panther's mapView.boxRange
 * @returns {Object} renderAs rules
 */
function getRenderAsRulesByBoxRange(renderAs, boxRange) {
	if (renderAs && boxRange) {
		return _find(renderAs, renderAsItem => {
			return view.isBoxRangeInRange(boxRange, renderAsItem.boxRangeRange);
		});
	} else {
		return null;
	}
}

/**
 * Return array of RGBA values, where A is from 0 to 255
 * @param rgbColorArray {Array} Array of RGB values
 * @param opacity {number} From 0 to 1
 * @returns {Array}
 */
function getRgbaColorArray(rgbColorArray, opacity) {
	if (opacity || opacity === 0) {
		return [...rgbColorArray, Math.floor(opacity * 255)];
	} else {
		return rgbColorArray;
	}
}

/**
 * Get style for given feature
 * @param style {Object} Style definition suitable for Deck
 * @param feature {GeoJSONFeature}
 * @returns {Object} style object
 */
function getStyleForFeature(style, feature) {
	if (style.attributeStyles?.length) {
		let finalStyle = {...style.baseStyle};
		style.attributeStyles.forEach(attributeStyle => {
			finalStyle = {
				...finalStyle,
				...getStyleObjectForAttribute(attributeStyle, feature.properties),
			};
		});

		return finalStyle;
	} else {
		return style.baseStyle;
	}
}

/**
 * @param attributeStyleDefinition {Object} Style definition for given attribute key
 * @param attributes {Object} Feature attributes
 * @return {Object} Style object for given attribute key
 */
function getStyleObjectForAttribute(attributeStyleDefinition, attributes) {
	if (Object.hasOwn(attributes, attributeStyleDefinition.attributeKey)) {
		const value = attributes[attributeStyleDefinition.attributeKey];
		if (value === null || value === undefined) {
			return {};
		} else {
			if (attributeStyleDefinition.attributeClasses) {
				return mapStyle.getStyleObjectForIntervals(
					attributeStyleDefinition.attributeClasses,
					value
				);
			} else if (attributeStyleDefinition.attributeValues) {
				return mapStyle.getStyleObjectForValues(
					attributeStyleDefinition.attributeValues,
					value
				);
			}
			// TODO add other cases
			else {
				return {};
			}
		}
	} else {
		return {};
	}
}

export default {
	getRgbaColorArray,
	getDeckReadyColor,
	getDeckReadyStyleObject,
	getStylesDefinitionForDeck: memoize(getStylesDefinitionForDeck, {
		maxSize: 100,
	}),
	getStyleForFeature,
	getStyleObjectForAttribute,
	getRenderAsRulesByBoxRange,
};
