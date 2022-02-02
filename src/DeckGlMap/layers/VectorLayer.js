import {CompositeLayer} from '@deck.gl/core';
import {GeoJsonLayer} from '@deck.gl/layers';
import {
	forIn as _forIn,
	includes as _includes,
	partition as _partition,
} from 'lodash';
import styleHelpers from '../helpers/style';

class VectorLayer extends CompositeLayer {
	renderLayers() {
		const {key, options} = this.props;
		const {features, fidColumnName, selected} = options;
		const selectedFeatureKeys = this.getSelectedFeatureKeys(selected);

		if (selectedFeatureKeys) {
			const partition = _partition(
				features,
				feature =>
					!!_includes(
						selectedFeatureKeys,
						this.getFeatureKey(fidColumnName, feature)
					)
			);

			return [
				this.renderVectorLayer(`${key}-geoJsonLayer-selected`, partition[1]),
				this.renderVectorLayer(`${key}-geoJsonLayer`, partition[0]),
			];
		} else {
			return [this.renderVectorLayer(`${key}-geoJsonLayer`, features)];
		}
	}

	updateState({changeFlags}) {
		if (changeFlags.propsOrDataChanged) {
			// prepare style for each feature in advance
			const {options, styleForDeck} = this.props;
			const {fidColumnName, features, selected} = options;
			if (styleForDeck && features) {
				let styleByFeatureKey = {};
				features.forEach(feature => {
					const featureKey = this.getFeatureKey(fidColumnName, feature);
					styleByFeatureKey[featureKey] = this.calculateDefaultStyle(
						styleForDeck,
						featureKey,
						feature,
						selected
					);
				});
				this.setState({styleByFeatureKey});
			}
		}
	}

	/**
	 * Return feature style
	 * @param style {Object} Preprocessed style definition for Deck
	 * @param featureKey {string}
	 * @param feature {GeoJSONFeature}
	 * @param selected {Object} Selected featureKeys and styles by selection
	 * @returns {fill: array, fillOpacity: number, outlineColor: array, outlineWidth: number, outlineSize: number, size: number} Style object
	 */
	calculateDefaultStyle(style, featureKey, feature, selected) {
		const defaultStyle = styleHelpers.getStyleForFeature(style, feature);

		let selectedStyle;
		if (selected && featureKey) {
			_forIn(selected, (selection, key) => {
				if (selection.keys && _includes(selection.keys, featureKey)) {
					selectedStyle = {
						...defaultStyle,
						...styleHelpers.getDeckReadyStyleObject(selection.style),
					};
				}
			});
		}

		return selectedStyle || defaultStyle;
	}

	/**
	 * Get feature key
	 * @param fidColumnName {string}
	 * @param feature {GeoJSONFeature}
	 * @returns {string}
	 */
	getFeatureKey(fidColumnName, feature) {
		return feature.id || feature.properties[fidColumnName];
	}

	/**
	 * Get default style from state
	 * @param fidColumnName {string}
	 * @param feature {GeoJSONFeature}
	 * @returns {Object} DeckGl-ready style object
	 */
	getDefaultFeatureStyle(fidColumnName, feature) {
		const featureKey = this.getFeatureKey(fidColumnName, feature);
		return this.state.styleByFeatureKey[featureKey] || null;
	}

	/**
	 * @param style {Object} Preprocessed style
	 * @param fidColumnName {string}
	 * @param feature {GeoJSONFeature}
	 * @returns {Array} Array representing RGBA channels
	 */
	getFeatureFill(style, fidColumnName, feature) {
		const defaultStyle = this.getDefaultFeatureStyle(fidColumnName, feature);
		// if no fill defined, make fill transparent
		if (defaultStyle?.fill) {
			return styleHelpers.getRgbaColorArray(
				defaultStyle?.fill,
				defaultStyle?.fillOpacity
			);
		} else {
			return styleHelpers.getRgbaColorArray([255, 255, 255], 0);
		}
	}

	/**
	 * @param style {Object} Preprocessed style
	 * @param fidColumnName {string}
	 * @param feature {GeoJSONFeature}
	 * @returns {Array} Array representing RGBA channels
	 */
	getFeatureOutlineColor(style, fidColumnName, feature) {
		const defaultStyle = this.getDefaultFeatureStyle(fidColumnName, feature);
		return styleHelpers.getRgbaColorArray(
			defaultStyle?.outlineColor,
			defaultStyle?.outlineOpacity
		);
	}

	/**
	 * @param style {Object} Preprocessed style
	 * @param fidColumnName {string}
	 * @param feature {GeoJSONFeature}
	 * @returns {number}
	 */
	getPointRadius(style, fidColumnName, feature) {
		const defaultStyle = this.getDefaultFeatureStyle(fidColumnName, feature);
		return defaultStyle?.size && defaultStyle.size / 2;
	}

	/**
	 * @param style {Object} Preprocessed style
	 * @param fidColumnName {string}
	 * @param feature {GeoJSONFeature}
	 * @returns {number}
	 */
	getFeatureOutlineWidth(style, fidColumnName, feature) {
		const defaultStyle = this.getDefaultFeatureStyle(fidColumnName, feature);
		return defaultStyle?.outlineWidth;
	}

	/**
	 * TODO move all selected features to the top for now
	 * @param selectedFeatureKeys {Array}
	 * @param fidColumnName {string}
	 * @param feature {GeoJSONFeature}
	 * @returns {number}
	 */
	getFeatureZIndex(selectedFeatureKeys, fidColumnName, feature) {
		if (selectedFeatureKeys) {
			const featureKey = this.getFeatureKey(fidColumnName, feature);
			const isSelected = _includes(selectedFeatureKeys, featureKey);
			return isSelected ? 1 : 0;
		} else {
			return 0;
		}
	}

	/**
	 * Return all selected feature keys
	 * @param selections {Object}
	 * @returns {Array|null}
	 */
	getSelectedFeatureKeys(selections) {
		if (selections) {
			let selectedKeys = [];
			_forIn(selections, selection => {
				if (selection.keys?.length) {
					selectedKeys = [...selectedKeys, ...selection.keys];
				}
			});

			return selectedKeys.length ? selectedKeys : null;
		} else {
			return null;
		}
	}

	/**
	 * Call on feature click
	 * @param data {Object}
	 */
	onClick(data) {
		if (this.props.options.selectable && this.props.onClick) {
			this.props.onClick(this.props.layerKey, [
				this.getFeatureKey(this.props.options.fidColumnName, data.object),
			]);
		}
	}

	/**
	 * Call on feature hover
	 * @param data {Object}
	 */
	onHover(data) {
		if (this.props.options.hoverable && this.props.onHover) {
			const {layer, object, x, y} = data;
			const featureKey =
				object && this.getFeatureKey(this.props.options.fidColumnName, object);
			this.props.onHover(layer, featureKey, object, x, y);
		}

		if (this.props.options.selectable && this.props.onClick) {
			const object = data?.object;
			const canvas = data?.layer?.context?.deck?.canvas;
			if (canvas && object) {
				canvas.style.cursor = 'pointer';
			} else {
				canvas.style.cursor = 'inherit';
			}
		}
	}

	/**
	 * @returns {GeoJsonLayer} DeckGl.GeoJsonLayer
	 */
	renderVectorLayer(vectorLayerKey, features) {
		const {layerKey, options, styleForDeck, pointAsMarker} = this.props;
		const {fidColumnName, selectable, hoverable} = options;

		return new GeoJsonLayer({
			id: vectorLayerKey,
			key: vectorLayerKey,
			layerKey,
			fidColumnName,
			data: features,
			pickable: selectable || hoverable,
			stroked: true,
			filled: true,
			extruded: false,
			pointType: 'circle',
			lineWidthUnits: 'pixels',
			lineCapRounded: true,
			lineJointRounded: true,
			getFillColor: this.getFeatureFill.bind(this, styleForDeck, fidColumnName),
			getLineColor: this.getFeatureOutlineColor.bind(
				this,
				styleForDeck,
				fidColumnName
			),
			getPointRadius: this.getPointRadius.bind(
				this,
				styleForDeck,
				fidColumnName
			),
			pointRadiusUnits: pointAsMarker ? 'pixels' : 'meters',
			onClick: this.onClick.bind(this),
			onHover: this.onHover.bind(this),
			getLineWidth: this.getFeatureOutlineWidth.bind(
				this,
				styleForDeck,
				fidColumnName
			),
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
