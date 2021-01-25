import React from 'react';
import PropTypes from 'prop-types';
import {utils} from '@gisatcz/ptr-utils';
import {GeoJSON, withLeaflet} from 'react-leaflet';
import L from 'leaflet';
import helpers from '../helpers';
import memoize from 'memoize-one';

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
				if (this.props.onFeatureClick && this.props.selectable) {
					this.props.onFeatureClick(feature.uniqueFeatureKey);
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
			if (feature.selected) {
				// TODO selectedHovered?
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
			const shape = helpers.getMarkerShape(shapeId, style, {
				icons: this.props.icons,
			});

			return L.marker(coord, {
				pane: this.props.paneName,
				interactive: this.props.hoverable || this.props.selectable,
				icon: shape,
			});
		} else {
			return L.circle(coord, feature.defaultStyle);
		}
	}

	filter(feature) {
		if (this.props.omittedFeatureKeys) {
			const featureKey =
				feature.id || feature.properties[this.props.fidColumnName];
			return !(
				featureKey && _.includes(this.props.omittedFeatureKeys, featureKey)
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

export default withLeaflet(GeoJsonLayer);
