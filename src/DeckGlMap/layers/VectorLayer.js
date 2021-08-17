import {CompositeLayer} from '@deck.gl/core';
import {GeoJsonLayer} from '@deck.gl/layers';
import {forIn as _forIn, includes as _includes} from 'lodash';
import {style as styleUtils} from '../../utils/style';
import utils from '../utils';

class VectorLayer extends CompositeLayer {
	renderLayers() {
		return [this.renderVectorLayer()];
	}

	/**
	 * @param feature {GeoJSONFeature}
	 * @returns {fill: string, fillOpacity: number, outlineColor: string, outlineWidth: number, outlineSize: number, size: number} Panther-like style object
	 */
	getDefaultStyle(feature) {
		const {hovered, hoverable, selected, selectable, style, fidColumnName} =
			this.props.options;
		const fid = feature.id || feature.properties[fidColumnName];

		const defaultStyle = styleUtils.getDefaultStyleObject(feature, style);

		let isSelected, selectedStyle;
		if (selected && fid) {
			_forIn(selected, (selection, key) => {
				if (selection.keys && _includes(selection.keys, fid)) {
					isSelected = true;
					selectedStyle = {
						...defaultStyle,
						...styleUtils.getSelectedStyleObject(selection.style),
					};
				}
			});
		}

		return selectedStyle || defaultStyle;
	}

	/**
	 * @param feature {GeoJSONFeature}
	 * @returns {Array} Array representing RGBA channels
	 */
	getFeatureFill(feature) {
		const defaultStyle = this.getDefaultStyle(feature);
		return utils.rgbaFromHexAndOpacity(
			defaultStyle?.fill,
			defaultStyle?.fillOpacity
		);
	}

	/**
	 * @param feature {GeoJSONFeature}
	 * @returns {Array} Array representing RGBA channels
	 */
	getFeatureOutlineColor(feature) {
		const defaultStyle = this.getDefaultStyle(feature);
		return utils.rgbaFromHexAndOpacity(
			defaultStyle?.outlineColor,
			defaultStyle?.outlineOpacity
		);
	}

	/**
	 * @param feature {GeoJSONFeature}
	 * @returns {number}
	 */
	getPointSize(feature) {
		const defaultStyle = this.getDefaultStyle(feature);
		return defaultStyle?.size;
	}

	/**
	 * @param feature {GeoJSONFeature}
	 * @returns {number}
	 */
	getFeatureOutlineWidth(feature) {
		const defaultStyle = this.getDefaultStyle(feature);
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
		const {key, layerKey, options} = this.props;

		return new GeoJsonLayer({
			id: key,
			layerKey: key || layerKey,
			fidColumnName: options?.fidColumnName,
			data: options?.features,
			pickable: options?.selectable,
			stroked: true,
			filled: true,
			extruded: false,
			pointType: 'circle',
			lineWidthUnits: 'pixels',
			getFillColor: this.getFeatureFill.bind(this),
			getLineColor: this.getFeatureOutlineColor.bind(this),
			getPointRadius: this.getPointSize.bind(this),
			onClick: this.onClick.bind(this),
			getLineWidth: this.getFeatureOutlineWidth.bind(this),
			updateTriggers: {
				getFillColor: [options],
				getLineColor: [options],
				getLineWidth: [options],
				getPointRadius: [options],
			},
			pointRadiusMinPixels: 1,
		});
	}
}

export default VectorLayer;
