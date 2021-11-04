import React from 'react';
import {includes as _includes} from 'lodash';
import PropTypes from 'prop-types';
import {utils} from '@gisatcz/ptr-utils';
import {GeoJSON} from 'react-leaflet';
import L from 'leaflet';
import helpers from '../helpers';
import memoize from 'memoize-one';
import shapes from '../shapes';
import MarkerShape from '../MarkerShape';

class GeoJsonLayer extends React.PureComponent {
	static propTypes = {
		omittedFeatureKeys: PropTypes.array, // list of feature keys that shouldn't be rendered
	};

	constructor(props) {
		super(props);

		this.getStyle = this.getStyle.bind(this);
		this.filter = this.filter.bind(this);
		this.onEachFeature = this.onEachFeature.bind(this);
		this.pointToLayer = this.pointToLayer.bind(this);

		this.getRenderId = memoize(features => {
			if (features) {
				return utils.uuid();
			}
		});
	}

	getStyle(feature) {
		const styles = helpers.calculateStyle(
			feature.feature,
			this.props.styleDefinition,
			this.props.hoveredStyleDefinition,
			feature.selected,
			feature.selectedStyleDefinition,
			feature.selectedHoveredStyleDefinition
		);

		if (feature.selected) {
			return styles.selected;
		} else {
			return styles.default;
		}
	}

	/**
	 * @param id {string}
	 * @param style {Object} Leaflet style definition
	 * @param options {Object}
	 * @param options.icons {Object} see https://gisat.github.io/components/maps/map#resources
	 * @param options.onMouseMove {function}
	 * @param options.onMouseOver {function}
	 * @param options.onMouseOut {function}
	 * @param options.onClick {function}
	 * @return {MarkerShape}
	 */
	getMarkerShape(id, style, options) {
		const shapeKey = style.shape;
		const iconKey = style.icon;
		let basicShape = true;
		let anchorShift = 0; // shift of anchor in pixels
		let anchorPositionX = 0.5; // relative anchor X position (0.5 means that the shape reference point is in the middle horizontally)
		let anchorPositionY = 0.5; // relative anchor Y position
		let shape, icon;

		// find shape by key in the internal set of shapes
		if (shapeKey) {
			shape = shapes[shapeKey] || null;
		}

		// find icon by key in the given set of icons
		if (iconKey) {
			icon = options?.icons?.[iconKey] || null;
		}

		if (shape || icon) {
			basicShape = false;

			// get anchor positions from definitions, if exist
			if (shape?.anchorPoint) {
				anchorPositionX = shape.anchorPoint[0];
				anchorPositionY = shape.anchorPoint[1];
			} else if (!shape && icon?.anchorPoint) {
				anchorPositionX = icon.anchorPoint[0];
				anchorPositionY = icon.anchorPoint[1];
			}

			// if outline, shift the anchor point
			if (style?.weight) {
				anchorShift = style?.weight;
			}
		}

		return new MarkerShape({
			basicShape,
			id: id,
			style,
			iconAnchor: style.radius
				? [
						(2 * style.radius + anchorShift) * anchorPositionX,
						(2 * style.radius + anchorShift) * anchorPositionY,
				  ]
				: null,
			icon,
			shape,
			onMouseMove: options.onMouseMove,
			onMouseOut: options.onMouseOut,
			onMouseOver: options.onMouseOver,
			onClick: options.onClick,
		});
	}

	onEachFeature(feature, layer) {
		const geometryType = feature.geometry.type;
		const isPolygon =
			geometryType === 'Polygon' || geometryType === 'MultiPolygon';
		const isLine = geometryType === 'Line' || geometryType === 'LineString';

		const styles = helpers.calculateStyle(
			feature.feature,
			this.props.styleDefinition,
			this.props.hoveredStyleDefinition,
			feature.selected,
			feature.selectedStyleDefinition,
			feature.selectedHoveredStyleDefinition
		);

		layer.on({
			click: e => {
				if (this.props.onFeatureClick && this.props.selectable && feature.fid) {
					this.props.onFeatureClick(feature.fid);
				}
			},
			mousemove: e => {
				if (this.props.hoverable) {
					if (feature.selected && styles.selectedHovered) {
						this.setStyle(styles.selectedHovered, e.target);
					} else {
						this.setStyle(styles.hovered, e.target);
					}

					if (isPolygon || isLine) {
						layer.bringToFront();
					}
				}
			},
			mouseout: e => {
				if (this.props.hoverable) {
					if (feature.selected && styles.selected) {
						this.setStyle(styles.selected, e.target);
					} else {
						this.setStyle(styles.default, e.target);
					}

					if ((isLine || isPolygon) && !feature.selected) {
						layer.bringToBack();
					}
				}
			},
		});
	}

	/**
	 * Set style of the feature
	 * @param leafletStyle {Object} Leaflet style definition
	 * @param element {Object} Leaflet element
	 */
	setStyle(leafletStyle, element) {
		const shape = element?.options?.icon;
		if (shape) {
			shape.setStyle(leafletStyle, shape.id, shape.isBasicShape);
		} else {
			element.setStyle(leafletStyle);
		}
	}

	// render points
	pointToLayer(feature, coord) {
		if (this.props.pointAsMarker) {
			let style = feature.defaultStyle;

			// for circles, use L.circleMarker due to better performance
			if ((!style?.shape && !style?.icon) || style?.shape === 'circle') {
				return L.circleMarker(coord, {
					...feature.defaultStyle,
					pane: this.props.paneName,
				});
			} else {
				if (feature.selected) {
					const styles = helpers.calculateStyle(
						feature.feature,
						this.props.styleDefinition,
						this.props.hoveredStyleDefinition,
						feature.selected,
						feature.selectedStyleDefinition,
						feature.selectedHoveredStyleDefinition
					);
					style = styles.selected;
				}

				const shapeId = feature.uniqueFeatureKey
					? `${feature.uniqueFeatureKey}_icon`
					: utils.uuid();
				const shape = this.getMarkerShape(shapeId, style, {
					icons: this.props.icons,
				});

				return L.marker(coord, {
					pane: this.props.paneName,
					interactive: this.props.hoverable || this.props.selectable,
					icon: shape,
				});
			}
		} else {
			return L.circle(coord, feature.defaultStyle);
		}
	}

	filter(feature) {
		if (this.props.omittedFeatureKeys) {
			const featureKey =
				feature.id || feature.properties[this.props.fidColumnName];
			return !(
				featureKey && _includes(this.props.omittedFeatureKeys, featureKey)
			);
		} else {
			return true;
		}
	}

	render() {
		const features = this.props.features.map(item => {
			return {...item.feature, ...item};
		});

		// generate new key on features change to return the new instance
		// more: https://react-leaflet.js.org/docs/en/components#geojson
		const key = this.getRenderId(this.props.features);

		return (
			<GeoJSON
				key={key}
				data={features}
				style={this.getStyle}
				onEachFeature={this.onEachFeature}
				pointToLayer={this.pointToLayer}
				filter={this.filter}
			/>
		);
	}
}

export default GeoJsonLayer;
