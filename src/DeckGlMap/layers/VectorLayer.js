import {CompositeLayer} from '@deck.gl/core';
import {GeoJsonLayer} from '@deck.gl/layers';
import {find as _find, forIn as _forIn, includes as _includes} from 'lodash';
import styleUtils from '../../utils/style';
import utils from '../utils';
import view from '../../utils/view';

class VectorLayer extends CompositeLayer {
	renderLayers() {
		return [this.renderVectorLayer()];
	}

	/**
	 * @param feature {GeoJSONFeature}
	 * @returns {fill: string, fillOpacity: number, outlineColor: string, outlineWidth: number, outlineSize: number, size: number} Panther-like style object
	 */
	getDefaultStyle(feature) {
		const {hovered, hoverable, selected, selectable, fidColumnName} =
			this.props.options;
		const style = this.getOption(
			this.props.options,
			'style',
			this.props.view?.boxRange
		);

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
		return defaultStyle?.size / 2;
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

	getRenderAsRules(renderAs, boxRange) {
		return _find(renderAs, renderAsItem => {
			return view.isBoxRangeInRange(boxRange, renderAsItem.boxRangeRange);
		});
	}

	getOption(options, option, boxRange) {
		if (options?.renderAs && boxRange) {
			const renderAsRules = this.getRenderAsRules(options.renderAs, boxRange);
			if (renderAsRules.options?.hasOwnProperty(option)) {
				return renderAsRules.options[option];
			} else {
				return options[option];
			}
		} else {
			return options[option];
		}
	}

	renderVectorLayer() {
		const {key, layerKey, options, view} = this.props;
		const {fidColumnName, features, selectable} = options;
		const style = this.getOption(options, 'style', view?.boxRange);

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
			getFillColor: this.getFeatureFill.bind(this),
			getLineColor: this.getFeatureOutlineColor.bind(this),
			getPointRadius: this.getPointSize.bind(this),
			pointRadiusUnits: this.getOption(options, 'pointAsMarker', view?.boxRange)
				? 'pixels'
				: 'meters',
			onClick: this.onClick.bind(this),
			getLineWidth: this.getFeatureOutlineWidth.bind(this),
			updateTriggers: {
				getFillColor: [options, style],
				getLineColor: [options, style],
				getLineWidth: [options, style],
				getPointRadius: [options, style],
			},
			pointRadiusMinPixels: 1,
		});
	}
}

export default VectorLayer;
