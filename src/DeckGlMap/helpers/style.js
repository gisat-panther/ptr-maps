import {
	find as _find,
	forEach as _forEach,
	forIn as _forIn,
	isEmpty as _isEmpty,
} from 'lodash';
import memoize from 'memoize-one';
import chroma from 'chroma-js';
import view from '../../utils/view';

// TODO memoize more than last style calculation
const calculateStyleForDeckMemo = memoize(calculateStyleForDeck);

function getDeckReadyStyleObject(styleObject) {
	const {fill, outlineColor, ...restProps} = styleObject;

	let deckReadyStyleObject = {...restProps};

	if (fill) {
		deckReadyStyleObject.fill = chroma(fill).rgb();
	}

	if (outlineColor) {
		deckReadyStyleObject.outlineColor = chroma(outlineColor).rgb();
	}

	return deckReadyStyleObject;
}

function calculateStyleForDeck(style) {
	// TODO multiple rules and filters?
	const styles = style.rules[0].styles;
	if (styles) {
		const baseStyle = getDeckReadyStyleObject(styles[0]);
		let styleForDeck = {
			baseStyle,
		};

		let attributesStyles = [];
		for (let i = 1; i < styles.length; i++) {
			const style = styles[i];
			const attributeKey = style.attributeKey;

			if (style.attributeValues) {
				let values = {};
				_forIn(style.attributeValues, (style, value) => {
					values[value] = {...baseStyle, ...getDeckReadyStyleObject(style)};
				});

				attributesStyles.push({
					attributeKey,
					attributeValues: values,
				});
			} else if (style.attributeClasses) {
				let classes = [];
				_forEach(style.attributeClasses, style => {
					classes.push({...baseStyle, ...getDeckReadyStyleObject(style)});
				});
				attributesStyles.push({
					attributeKey,
					attributeClasses: classes,
				});
			}
		}

		if (!_isEmpty(attributesStyles)) {
			styleForDeck.attributesStyles = attributesStyles;
		}

		return styleForDeck;
	} else {
		return null;
	}
}

function getRenderAsRules(renderAs, boxRange) {
	return _find(renderAs, renderAsItem => {
		return view.isBoxRangeInRange(boxRange, renderAsItem.boxRangeRange);
	});
}

function getStyleForDeck(options, renderAsRules) {
	const style = renderAsRules?.options?.style || options.style;
	if (style) {
		return calculateStyleForDeckMemo(style);
	} else {
		return null;
	}
}

function getColorWithOpacity(rgbColorArray, opacity) {
	if (opacity || opacity === 0) {
		[...rgbColorArray].push(Math.floor(opacity * 255));
	}

	return rgbColorArray;
}

function getStyleForFeature(style, feature) {
	if (style.attributesStyles) {
		if (style.attributesStyles.length === 1) {
			return getStyleObjectForAttribute(
				style.attributesStyles[0],
				style.baseStyle,
				feature.properties
			);
		} else {
			// TODO
		}
	} else {
		return style.baseStyle;
	}
}

// TODO export below from ptr-utils
/**
 * @param attributeStyleDefinition {Object} Style definition for given attribute key
 * @param baseStyleDefinition {Object}
 * @param attributes {Object} Feature attributes
 * @return {Object} Style object for given attribute key
 */
function getStyleObjectForAttribute(
	attributeStyleDefinition,
	baseStyleDefinition,
	attributes
) {
	if (attributes.hasOwnProperty(attributeStyleDefinition.attributeKey)) {
		let value = attributes[attributeStyleDefinition.attributeKey];
		if (value === null || value === undefined) {
			return baseStyleDefinition;
		} else {
			if (attributeStyleDefinition.attributeClasses) {
				return getStyleObjectForAttributeClasses(
					attributeStyleDefinition.attributeClasses,
					value
				);
			} else if (attributeStyleDefinition.attributeValues) {
				return getStyleObjectForAttributeValues(
					attributeStyleDefinition.attributeValues,
					value
				);
			}
			// TODO add other cases
			else {
				return baseStyleDefinition;
			}
		}
	} else {
		return baseStyleDefinition;
	}
}

/**
 * Attribute classes
 *
 * @param attributeClasses {Array}
 * @param value {number|String} attribute value
 */
function getStyleObjectForAttributeClasses(attributeClasses, value) {
	let styleObject = {};
	_forEach(attributeClasses, attributeClass => {
		let {interval, intervalBounds} = attributeClass;

		if (!intervalBounds) {
			intervalBounds = [true, false];
		}

		if (
			isGreaterThan(value, interval[0], intervalBounds[0]) &&
			isGreaterThan(interval[1], value, intervalBounds[1])
		) {
			styleObject = attributeClass;
		}
	});

	return styleObject;
}

/**
 * Attribute value
 *
 * @param attributeValues {Object}
 * @param value {String} attribute value
 * @return {Object}
 */
function getStyleObjectForAttributeValues(attributeValues, value) {
	return attributeValues[value] || {};
}

function isGreaterThan(comparedValue, referenceValue, allowEquality) {
	if (comparedValue || comparedValue === 0) {
		if (allowEquality) {
			return comparedValue >= referenceValue;
		} else {
			return comparedValue > referenceValue;
		}
	} else {
		return false;
	}
}

export default {
	getColorWithOpacity,
	getDeckReadyStyleObject,
	getStyleForDeck,
	getStyleForFeature,
	getRenderAsRules,
};
