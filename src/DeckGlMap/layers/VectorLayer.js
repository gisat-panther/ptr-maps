import {CompositeLayer} from '@deck.gl/core';
import {GeoJsonLayer} from '@deck.gl/layers';
import {_TerrainExtension as TerrainExtension} from '@deck.gl/extensions';
import TiledVectorLayer from './TiledVectorLayer';

import {
	forIn as _forIn,
	includes as _includes,
	isEmpty as _isEmpty,
	partition as _partition,
} from 'lodash';
import styleHelpers from '../helpers/style';
import featureHelpers from '../../utils/feature';
import constants from '../../constants';

// TODO handle different selections
class VectorLayer extends CompositeLayer {
	renderLayers() {
		const {key, options, type} = this.props;
		const {features, fidColumnName, selected} = options;
		const selectedFeatureKeys = this.getSelectedFeatureKeys(selected);
		if (type === 'tiledVector' || type === 'tiled-vector') {
			return [this.renderTiledVectorLayer(`${key}-tiledVectorLayer`)];
		} else {
			if (selectedFeatureKeys) {
				const partition = _partition(
					features,
					feature =>
						!!_includes(
							selectedFeatureKeys,
							featureHelpers.getKey(fidColumnName, feature)
						)
				);

				return [
					this.renderVectorLayer(`${key}-geoJsonLayer`, partition[1]),
					this.renderVectorLayer(`${key}-geoJsonLayer-selected`, partition[0]),
				];
			} else {
				return [this.renderVectorLayer(`${key}-geoJsonLayer`, features)];
			}
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
					const featureKey = featureHelpers.getKey(fidColumnName, feature);
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
			_forIn(selected, selection => {
				if (selection.keys && _includes(selection.keys, featureKey)) {
					let selectionStyle = selection.style;
					if (selection.style === 'default') {
						selectionStyle = constants.vectorFeatureStyle.selected;
					}

					selectedStyle = {
						...defaultStyle,
						...styleHelpers.getDeckReadyStyleObject(selectionStyle),
					};
				}
			});
		}

		return selectedStyle || defaultStyle;
	}

	/**
	 * Get default style from state
	 * @param fidColumnName {string}
	 * @param feature {GeoJSONFeature}
	 * @returns {Object} DeckGl-ready style object
	 */
	getDefaultFeatureStyle(fidColumnName, feature) {
		const featureKey = featureHelpers.getKey(fidColumnName, feature);
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
	 * Return all selected feature keys
	 * @param selections {Object}
	 * @param selectionKey {string} If specified, return feature keys for this selection only
	 * @returns {Array|null}
	 */
	getSelectedFeatureKeys(selections, selectionKey) {
		if (!_isEmpty(selections)) {
			let selectedKeys = [];
			_forIn(selections, (selection, key) => {
				if (selection.keys?.length && (!selectionKey || selectionKey === key)) {
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
	 * @param e {Object}
	 */
	onClick(data, e) {
		const {options, onClick, layerKey, activeSelectionKey} = this.props;
		const {srcEvent} = e;
		const {x, y, object} = data;
		if (options?.selectable && onClick) {
			onClick(
				layerKey,
				featureHelpers.getSelectedFeatureKeysOnClick(
					options?.fidColumnName,
					object,
					(srcEvent.ctrlKey || srcEvent.metaKey) &&
						!options?.selectedOptions?.disableMultiClick,
					this.getSelectedFeatureKeys(options?.selected, activeSelectionKey)
				),
				{x, y}
			);
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
				object &&
				featureHelpers.getKey(this.props.options.fidColumnName, object);
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

	renderTiledVectorLayer(vectorLayerKey) {
		return new TiledVectorLayer({
			id: vectorLayerKey,
			key: vectorLayerKey,
			...this.props,
		});
	}

	/**
	 * @returns {GeoJsonLayer} DeckGl.GeoJsonLayer
	 */
	renderVectorLayer(vectorLayerKey, features) {
		const {layerKey, options, styleForDeck, pointAsMarker, opacity} =
			this.props;
		const {fidColumnName, selectable, hoverable, clampToTerrain} = options;
		const revizedFeatures = this.props.omittedFeatureKeys
			? features.filter(f => !this.props.omittedFeatureKeys.includes(f.key))
			: features;

		return new GeoJsonLayer({
			id: vectorLayerKey,
			key: vectorLayerKey,
			layerKey,
			fidColumnName,
			data: revizedFeatures,
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
			opacity,
			extensions: clampToTerrain ? [new TerrainExtension()] : [],
			...(clampToTerrain?.terrainDrawMode
				? {terrainDrawMode: clampToTerrain.terrainDrawMode}
				: {}),
		});
	}
}

export default VectorLayer;
