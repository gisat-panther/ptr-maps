import {CompositeLayer} from '@deck.gl/core';
import {GeoJsonLayer} from '@deck.gl/layers';
import {find as _find, forIn as _forIn, includes as _includes} from 'lodash';
import styleHelpers from '../helpers/style';

class VectorLayer extends CompositeLayer {
	renderLayers() {
		return [this.renderVectorLayer()];
	}

	updateState({changeFlags}) {}

	/**
	 * @param style {Object} Preprocessed style
	 * @param feature {GeoJSONFeature}
	 * @returns {fill: array, fillOpacity: number, outlineColor: array, outlineWidth: number, outlineSize: number, size: number} Style object
	 */
	getDefaultStyle(style, feature) {
		if (style.attributesStyles) {
			return styleHelpers.getStyleForFeature(style.attributesStyles, feature);
		} else {
			return style.baseStyle;
		}

		// let isSelected, selectedStyle;
		// if (selected && fid) {
		// 	_forIn(selected, (selection, key) => {
		// 		if (selection.keys && _includes(selection.keys, fid)) {
		// 			isSelected = true;
		// 			selectedStyle = {
		// 				...defaultStyle,
		// 				fill: [255, 0, 0],
		// 			};
		// 		}
		// 	});
		// }
		//
		// return selectedStyle || defaultStyle;
	}

	/**
	 * @param style {Object} Preprocessed style
	 * @param feature {GeoJSONFeature}
	 * @returns {Array} Array representing RGBA channels
	 */
	getFeatureFill(style, feature) {
		const defaultStyle = this.getDefaultStyle(style, feature);
		return styleHelpers.getColorWithOpacity(
			defaultStyle?.fill,
			defaultStyle?.fillOpacity
		);
	}

	/**
	 * @param style {Object} Preprocessed style
	 * @param feature {GeoJSONFeature}
	 * @returns {Array} Array representing RGBA channels
	 */
	getFeatureOutlineColor(style, feature) {
		const defaultStyle = this.getDefaultStyle(style, feature);
		return styleHelpers.getColorWithOpacity(
			defaultStyle?.outlineColor,
			defaultStyle?.outlineOpacity
		);
	}

	/**
	 * @param style {Object} Preprocessed style
	 * @param feature {GeoJSONFeature}
	 * @returns {number}
	 */
	getPointSize(style, feature) {
		const defaultStyle = this.getDefaultStyle(style, feature);
		return defaultStyle?.size / 2;
	}

	/**
	 * @param style {Object} Preprocessed style
	 * @param feature {GeoJSONFeature}
	 * @returns {number}
	 */
	getFeatureOutlineWidth(style, feature) {
		const defaultStyle = this.getDefaultStyle(style, feature);
		return defaultStyle?.outlineWidth;
	}

	onClick(data) {
		if (this.props.options.selectable && this.props.onClick) {
			this.props.onClick(this.props.layerKey, [
				data.object.id ||
					data.object.properties[this.props.options.fidColumnName],
			]);
		}
	}

	renderVectorLayer() {
		// TODO update state
		const {key, layerKey, options, styleForDeck, pointAsMarker} = this.props;
		const {fidColumnName, features, selectable} = options;

		return new GeoJsonLayer({
			id: `${key}-geoJsonLayer`,
			key,
			layerKey,
			fidColumnName,
			data: features,
			pickable: selectable,
			stroked: true,
			filled: true,
			extruded: false,
			pointType: 'circle',
			lineWidthUnits: 'pixels',
			getFillColor: this.getFeatureFill.bind(this, styleForDeck),
			getLineColor: this.getFeatureOutlineColor.bind(this, styleForDeck),
			getPointRadius: this.getPointSize.bind(this, styleForDeck),
			pointRadiusUnits: pointAsMarker ? 'pixels' : 'meters',
			onClick: this.onClick.bind(this),
			getLineWidth: this.getFeatureOutlineWidth.bind(this, styleForDeck),
			updateTriggers: {
				getFillColor: [options, styleForDeck],
				getLineColor: [options, styleForDeck],
				getLineWidth: [options, styleForDeck],
				getPointRadius: [options, styleForDeck],
			},
			pointRadiusMinPixels: 1,
		});
	}
}

export default VectorLayer;
