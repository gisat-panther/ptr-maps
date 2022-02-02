import {assert} from 'chai';
import styleHelpers from '../../../src/DeckGlMap/helpers/style';

describe('utils/DeckGlMap/helpers/style', function () {
	describe('getDeckReadyStyleObject', function () {
		it('should return deck ready style object', function () {
			const style = {
				fill: '#ffffff',
				outlineColor: '#010101',
				outilneWidth: 1,
			};

			const expected = {
				fill: [255, 255, 255],
				outlineColor: [1, 1, 1],
				outilneWidth: 1,
			};
			const actual = styleHelpers.getDeckReadyStyleObject(style);
			assert.deepStrictEqual(actual, expected);
		});

		it('should return deck ready style object 2', function () {
			const style = {
				fill: '#ffffff',
				outilneWidth: 1,
			};

			const expected = {
				fill: [255, 255, 255],
				outilneWidth: 1,
			};
			const actual = styleHelpers.getDeckReadyStyleObject(style);
			assert.deepStrictEqual(actual, expected);
		});
	});

	describe('getDeckReadyColor', function () {
		it('should return color as RGB array', function () {
			const actual = styleHelpers.getDeckReadyColor('#fffffe');
			assert.deepStrictEqual(actual, [255, 255, 254]);
		});
	});

	describe('getStylesDefinitionForDeck', function () {
		it('should return style definition suitable for deck', function () {
			const style = {
				rules: [
					{
						styles: [
							{
								fill: '#ffffff',
							},
							{
								attributeKey: 'letter',
								attributeValues: {
									a: {
										fill: '#000000',
									},
									b: {
										outlineWidth: 1,
									},
								},
							},
						],
					},
				],
			};

			const expected = {
				baseStyle: {
					fill: [255, 255, 255],
				},
				attributeStyles: [
					{
						attributeValues: {
							a: {
								fill: [0, 0, 0],
							},
							b: {
								outlineWidth: 1,
							},
						},
						attributeKey: 'letter',
					},
				],
			};

			const actual = styleHelpers.getStylesDefinitionForDeck(style);
			assert.deepStrictEqual(actual, expected);
		});
	});

	describe('getRenderAsRulesByBoxRange', function () {
		it('get rules', function () {
			const renderAs = [
				{
					boxRangeRange: [null, 5000],
					options: {
						pointAsMarker: true,
					},
				},
				{
					boxRangeRange: [5000, null],
				},
			];

			const expected = {
				boxRangeRange: [5000, null],
			};
			const actual = styleHelpers.getRenderAsRulesByBoxRange(renderAs, 10000);
			assert.deepStrictEqual(actual, expected);
		});

		it('get rules 2', function () {
			const renderAs = [
				{
					boxRangeRange: [null, 5000],
					options: {
						pointAsMarker: true,
					},
				},
				{
					boxRangeRange: [5000, null],
				},
			];

			const expected = {
				boxRangeRange: [null, 5000],
				options: {
					pointAsMarker: true,
				},
			};
			const actual = styleHelpers.getRenderAsRulesByBoxRange(renderAs, 3000);
			assert.deepStrictEqual(actual, expected);
		});
	});

	describe('getRgbaColorArray', function () {
		it('should add opacity to RGB array', function () {
			const actual = styleHelpers.getRgbaColorArray([245, 234, 233], 1);
			assert.deepStrictEqual(actual, [245, 234, 233, 255]);
		});

		it('should add opacity to RGB array 2', function () {
			const actual = styleHelpers.getRgbaColorArray([245, 234, 233], 0);
			assert.deepStrictEqual(actual, [245, 234, 233, 0]);
		});

		it('should return the same array', function () {
			const color = [245, 234, 233];
			const actual = styleHelpers.getRgbaColorArray(color);
			assert.equal(actual, color);
		});
	});

	describe('getStyleForFeature', function () {
		it('should return base style', function () {
			const style = {
				baseStyle: {
					fill: [234, 234, 233],
				},
			};

			const feature = {
				properties: {
					letter: 'a',
				},
			};

			const actual = styleHelpers.getStyleForFeature(style, feature);
			assert.equal(actual, style.baseStyle);
		});

		it('should return attribute style merged with base style', function () {
			const style = {
				baseStyle: {
					fill: [234, 234, 233],
				},
				attributeStyles: [
					{
						attributeKey: 'letter',
						attributeValues: {
							a: {
								outlineWidth: 1,
							},
						},
					},
				],
			};

			const feature = {
				properties: {
					letter: 'a',
				},
			};

			const expected = {
				fill: [234, 234, 233],
				outlineWidth: 1,
			};

			const actual = styleHelpers.getStyleForFeature(style, feature);
			assert.deepStrictEqual(actual, expected);
		});
	});

	describe('getStyleObjectForAttribute', function () {
		const baseStyleDefinition = {
			fill: [245, 234, 233],
			size: 10,
		};

		const attributeStyleDefinition = {
			attributeKey: 'letter',
			attributeValues: {
				a: {
					size: 6,
				},
				b: {
					size: 8,
				},
			},
		};

		it('should return style object for attribute only', function () {
			const attributes = {
				letter: 'b',
				number: 3,
			};

			const expected = {
				size: 8,
			};
			const actual = styleHelpers.getStyleObjectForAttribute(
				attributeStyleDefinition,
				attributes
			);
			assert.deepStrictEqual(actual, expected);
		});

		it('should return empty object', function () {
			const attributes = {
				number: 3,
			};

			const actual = styleHelpers.getStyleObjectForAttribute(
				attributeStyleDefinition,
				attributes
			);
			assert.deepStrictEqual(actual, {});
		});
	});
});
