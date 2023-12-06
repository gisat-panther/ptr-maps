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
import {binaryToFeatureForAccessor} from './utils/geojson-binary';
import {distinctColours} from '@gisatcz/ptr-core';

// TODO handle different selections
class VectorLayer extends CompositeLayer {
	renderLayers() {
		const {key, options, type} = this.props;
		const {features, fidColumnName, selected} = options;
		const selectedFeatureKeys = this.getSelectedFeatureKeys(selected);
		if (type === 'tiledVector' || type === 'tiled-vector') {
			return [this.renderTiledVectorLayer(`${key}-tiledVectorLayer`)];
		} else {
			if (!this.isBinary()) {
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
						this.renderVectorLayer(
							`${key}-geoJsonLayer-selected`,
							partition[0]
						),
					];
				} else {
					return [this.renderVectorLayer(`${key}-geoJsonLayer`, features)];
				}
			} else {
				return [this.renderVectorLayer(`${key}-geoJsonLayer`, features)];
			}
		}
	}

	getStyleByFeatureKey() {
		const {options, styleForDeck} = this.props;
		const {fidColumnName, features, selected} = options;
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
		return styleByFeatureKey;
	}
	getStyleByFeatureKeyBinary() {
		const {options, styleForDeck} = this.props;
		const {fidColumnName, features, selected} = options;
		let styleByFeatureKey = {};
		//TODO - add polygon outlines?
		const types = [
			['lines', 'pathIndices'],
			['points', 'positions'],
			['polygons', 'polygonIndices'],
		];

		types.forEach(([type, indicesName]) => {
			let length = features?.[type]?.[indicesName].value.length - 1;

			if (type === 'points') {
				length =
					features?.[type]?.positions.value.length /
					features?.[type]?.positions.size;
			}
			let keys = [];
			let properties = [];
			for (let index = 0; index < length; index++) {
				const indicesIndex = features?.[type]?.[indicesName].value[index];
				const key = features?.[type]?.featureIds.value[indicesIndex];
				keys.push(key);

				properties.push(
					binaryToFeatureForAccessor(features?.[type], indicesIndex)
				);
			}
			let uniquePropertiesFIDs = new Set();
			let uniqueProperties = [];
			properties.forEach(prop => {
				const key = prop.properties[fidColumnName];
				if (!uniquePropertiesFIDs.has(key)) {
					uniquePropertiesFIDs.add(key);
					uniqueProperties.push(prop);
				}
			});

			properties.forEach(p => {
				const featureKey = featureHelpers.getKey(fidColumnName, p);
				styleByFeatureKey[featureKey] = this.calculateDefaultStyle(
					styleForDeck,
					featureKey,
					p,
					selected
				);
			});
		});
		return styleByFeatureKey;
	}

	updateState({changeFlags}) {
		if (changeFlags.propsOrDataChanged) {
			// prepare style for each feature in advance
			const {
				options: {features},
				styleForDeck,
			} = this.props;
			let styleByFeatureKey = {};

			if (styleForDeck && features && !this.isBinary()) {
				styleByFeatureKey = this.getStyleByFeatureKey();
			}

			if (styleForDeck && features && this.isBinary()) {
				styleByFeatureKey = this.getStyleByFeatureKeyBinary();
			}

			this.setState({styleByFeatureKey});
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
					const colourPalette = selection?.colourPalette || distinctColours;
					const distinctSelectionColor =
						selection.distinctItems &&
						colourPalette[selection.keyColourIndexPairs?.[featureKey]];
					selectedStyle = {
						...defaultStyle,
						...styleHelpers.getDeckReadyStyleObject(
							selectionStyle,
							distinctSelectionColor
						),
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
		return this.state?.styleByFeatureKey?.[featureKey] || null;
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
				{x, y},
				object
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

	isBinary() {
		const features = this.props?.options?.features;
		return (
			features &&
			'points' in features &&
			'polygons' in features &&
			'lines' in features
		);
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

		let revizedFeatures = [];
		if (this.isBinary()) {
			revizedFeatures = features;
		} else {
			revizedFeatures = this.props.omittedFeatureKeys
				? features.filter(f => !this.props.omittedFeatureKeys.includes(f.key))
				: features;
		}

		const extensions = [
			...(this.props.extensions ? [...this.props.extensions] : []),
		];

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
			extensions: clampToTerrain
				? [new TerrainExtension(), ...extensions]
				: [...extensions],
			...(clampToTerrain?.terrainDrawMode
				? {terrainDrawMode: clampToTerrain.terrainDrawMode}
				: {}),

			...(this.props.modelMatrix ? {modelMatrix: this.props.modelMatrix} : {}),
			...(this.props.coordinateOrigin
				? {coordinateOrigin: this.props.coordinateOrigin}
				: {}),
			...(Object.hasOwn(this.props, 'coordinateSystem')
				? {coordinateSystem: this.props.coordinateSystem}
				: {}),
		});
	}
}

export default VectorLayer;
