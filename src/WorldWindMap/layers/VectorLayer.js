var RenderableLayer = null;
import {isServer} from '@gisatcz/ptr-core';
if (!isServer) {
    var RenderableLayer = require('webworldwind-esa').RenderableLayer;
}

import utils from '@gisatcz/ptr-utils';
import _ from 'lodash';
import constants from "../../constants";

/**
 * @param layer {Object}
 * @param layer.key {string}
 * @param layer.name {string}
 * @param layer.opacity {number}
 * @param layer.options {Object}
 * @param layer.options.features {Array}
 * @augments WorldWind.RenderableLayer
 * @constructor
 */
class VectorLayer extends RenderableLayer {
	constructor(layer, options) {
		const name = layer.name || '';
		super(name);

		this.opacity = layer.opacity || 1;

		this.pantherProps = {
			features: options.features || [],
			fidColumnName: options.fidColumnName,
			hoverable: options.hoverable,
			selectable: options.selectable,
			hovered: {...options.hovered},
			selected: {...options.selected},
			key: layer.key,
			layerKey: options.layerKey,
			onHover: options.onHover,
			onClick: options.onClick,
			style: options.style
		};

		this.addFeatures(this.pantherProps.features);
	};

	/**;
	 * @param features {Array} List of GeoJSON features
	 */
	addFeatures(features) {
		let geojson = {
			"type": "FeatureCollection",
			"features": features
		};

		const parser = new WorldWind.GeoJSONParser(geojson);

		const shapeConfigurationCallback = (geometry, properties) => {
			const defaultStyleObject = utils.mapStyle.getStyleObject(properties, this.pantherProps.style  || constants.vectorFeatureStyle.defaultFull);
			const defaultStyle = this.getStyleDefinition(defaultStyleObject);

			let hoveredStyleObject, hoveredStyle;
			if (this.pantherProps.hovered?.style) {
				hoveredStyleObject = this.pantherProps.hovered.style === "default" ? constants.vectorFeatureStyle.hovered : this.pantherProps.hovered.style;
				hoveredStyle = this.getStyleDefinition({...defaultStyleObject, ...hoveredStyleObject});
			}

			return {
				userProperties: {
					...properties,
					defaultStyleObject,
					defaultStyle,
					hoveredStyleObject,
					hoveredStyle
				}
			}
		};

		const renderablesAddCallback = (layer) => {
			layer.renderables.forEach(renderable => {
				this.applyStyles(renderable);
			});
		};

		parser.load(renderablesAddCallback, shapeConfigurationCallback, this);
	}

	/**
	 * @param fids {Array}
	 */
	updateHoveredFeatures(fids) {
		this.renderables.forEach(renderable => {
			const key = renderable.userProperties[this.pantherProps.fidColumnName];
			if (_.includes(fids, key)) {
				const selection = this.getSelection(renderable);
				if (selection?.hoveredStyle){
					let selectedHoveredStyleObject = selection.hoveredStyle === "default" ? constants.vectorFeatureStyle.selectedHovered : selection.hoveredStyle;
					let selectedHoveredStyle = this.getStyleDefinition({...renderable.userProperties.defaultStyleObject, ...selectedHoveredStyleObject});
					this.applyWorldWindStyles(renderable, selectedHoveredStyle);
				} else if (renderable, renderable.userProperties.hoveredStyle) {
					this.applyWorldWindStyles(renderable, renderable.userProperties.hoveredStyle);
				}
			} else {
				this.applyStyles(renderable);
			}
		});
	}

	/**
	 * Convert panther style definition to World Wind style definition
	 * @param styleObject {Object}
	 * @return {Object}
	 */
	getStyleDefinition(styleObject) {
		let style = {};

		if (styleObject.fill) {
			const fillRgb = utils.mapStyle.hexToRgb(styleObject.fill);
			style.interiorColor = new WorldWind.Color(fillRgb.r/255, fillRgb.g/256, fillRgb.b/256, styleObject.fillOpacity || 1);
		} else {
			style.interiorColor = WorldWind.Color.TRANSPARENT;
		}

		if (styleObject.outlineColor && styleObject.outlineWidth) {
			const outlineRgb = utils.mapStyle.hexToRgb(styleObject.outlineColor);
			style.outlineColor = new WorldWind.Color(outlineRgb.r / 255, outlineRgb.g / 256, outlineRgb.b / 256, styleObject.outlineOpacity || 1);
			style.outlineWidth = styleObject.outlineWidth;
		} else {
			style.outlineColor = WorldWind.Color.TRANSPARENT;
		}

		return style;
	}

	/**
	 * Get selection for feature
	 * @param renderable {Object}
	 * @return {Object}
	 */
	getSelection(renderable) {
		if (this.pantherProps.selected) {
			const featureKey = renderable.userProperties[this.pantherProps.fidColumnName];
			let selectionDefintion = null;

			_.forIn(this.pantherProps.selected, (selection, key) => {
				if (selection.keys && _.includes(selection.keys, featureKey)) {
					selectionDefintion = selection
				}
			});

			return selectionDefintion;
		} else {
			return null;
		}
	}

	/**
	 * @param renderable {WorldWind.Renderable}
	 */
	applyStyles(renderable) {
		const defaultStyleObject = renderable.userProperties.defaultStyleObject;
		const selection = this.getSelection(renderable);

		if (selection?.style) {
			const selectedStyleObject = selection.style === "default" ? constants.vectorFeatureStyle.selected : selection.style;
			const selectedStyle = this.getStyleDefinition({...defaultStyleObject, ...selectedStyleObject});
			this.applyWorldWindStyles(renderable, selectedStyle);

		} else {
			this.applyWorldWindStyles(renderable, renderable.userProperties.defaultStyle);
		}
	}

	/**
	 * @param renderable {WorldWind.Renderable}
	 * @param style {Object}
	 */
	applyWorldWindStyles(renderable, style) {
		renderable.attributes.outlineWidth = style.outlineWidth;
		renderable.attributes.outlineColor = style.outlineColor;
		renderable.attributes.interiorColor = style.interiorColor;
	}
}

export default VectorLayer;

