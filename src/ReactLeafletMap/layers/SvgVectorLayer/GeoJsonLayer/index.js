import {useRef} from 'react';
import {includes as _includes} from 'lodash';
import PropTypes from 'prop-types';
import {utils} from '@gisatcz/ptr-utils';
import {GeoJSON} from 'react-leaflet';
import L from 'leaflet';
import helpers from '../helpers';
import memoize from 'memoize-one';
import shapes from '../shapes';
import MarkerShape from '../MarkerShape';

const GeoJsonLayer = ({
	omittedFeatureKeys,
	features,
	styleDefinition,
	hoveredStyleDefinition,
	onFeatureClick,
	selectable,
	hoverable,
	pointAsMarker,
	paneName,
	icons,
	fidColumnName,
}) => {
	const getRenderId = useRef(
		memoize(features => {
			if (features) {
				return utils.uuid();
			}
		})
	);

	const getStyle = feature => {
		const styles = helpers.calculateStyle(
			feature.feature,
			styleDefinition,
			hoveredStyleDefinition,
			feature.selected,
			feature.selectedStyleDefinition,
			feature.selectedHoveredStyleDefinition
		);

		if (feature.selected) {
			return styles.selected;
		} else {
			return styles.default;
		}
	};

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
	const getMarkerShape = (id, style, options) => {
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
	};

	const onEachFeature = (feature, layer) => {
		const geometryType = feature.geometry.type;
		const isPolygon =
			geometryType === 'Polygon' || geometryType === 'MultiPolygon';
		const isLine = geometryType === 'Line' || geometryType === 'LineString';

		const styles = helpers.calculateStyle(
			feature.feature,
			styleDefinition,
			hoveredStyleDefinition,
			feature.selected,
			feature.selectedStyleDefinition,
			feature.selectedHoveredStyleDefinition
		);

		layer.on({
			click: () => {
				if (onFeatureClick && selectable && feature.fid) {
					onFeatureClick(feature.fid);
				}
			},
			mouseover: e => {
				if (!selectable && !hoverable) {
					e.originalEvent.target.className.baseVal = '';
				}
			},
			mousemove: e => {
				if (hoverable) {
					if (feature.selected && styles.selectedHovered) {
						setStyle(styles.selectedHovered, e.target);
					} else {
						setStyle(styles.hovered, e.target);
					}

					if (isPolygon || isLine) {
						layer.bringToFront();
					}
				}
			},
			mouseout: e => {
				if (hoverable) {
					if (feature.selected && styles.selected) {
						setStyle(styles.selected, e.target);
					} else {
						setStyle(styles.default, e.target);
					}

					if ((isLine || isPolygon) && !feature.selected) {
						layer.bringToBack();
					}
				}
			},
		});
	};

	/**
	 * Set style of the feature
	 * @param leafletStyle {Object} Leaflet style definition
	 * @param element {Object} Leaflet element
	 */
	const setStyle = (leafletStyle, element) => {
		const shape = element?.options?.icon;
		if (shape) {
			shape.setStyle(leafletStyle, shape.id, shape.isBasicShape);
		} else {
			element.setStyle(leafletStyle);
		}
	};

	// render points
	const pointToLayer = (feature, coord) => {
		if (pointAsMarker) {
			let style = feature.defaultStyle;

			// for circles, use L.circleMarker due to better performance
			if ((!style?.shape && !style?.icon) || style?.shape === 'circle') {
				return L.circleMarker(coord, {
					...feature.defaultStyle,
					pane: paneName,
				});
			} else {
				if (feature.selected) {
					const styles = helpers.calculateStyle(
						feature.feature,
						styleDefinition,
						hoveredStyleDefinition,
						feature.selected,
						feature.selectedStyleDefinition,
						feature.selectedHoveredStyleDefinition
					);
					style = styles.selected;
				}

				const shapeId = feature.uniqueFeatureKey
					? `${feature.uniqueFeatureKey}_icon`
					: utils.uuid();

				const shape = getMarkerShape(shapeId, style, {
					icons,
					onClick: () => {
						selectable && onFeatureClick(feature.fid);
					},
					// TODO on events
				});

				return L.marker(coord, {
					pane: paneName,
					interactive: hoverable || selectable,
					icon: shape,
				});
			}
		} else {
			return L.circle(coord, feature.defaultStyle);
		}
	};

	const filter = feature => {
		if (omittedFeatureKeys) {
			const featureKey = feature.id || feature.properties[fidColumnName];
			return !(featureKey && _includes(omittedFeatureKeys, featureKey));
		} else {
			return true;
		}
	};

	const meggedFeatures = features.map(item => {
		return {...item.feature, ...item};
	});

	// generate new key on features change to return the new instance
	// more: https://react-leaflet.js.org/docs/en/components#geojson
	const key = getRenderId.current(meggedFeatures);

	return (
		<GeoJSON
			key={key}
			data={meggedFeatures}
			style={getStyle}
			onEachFeature={onEachFeature}
			pointToLayer={pointToLayer}
			filter={filter}
		/>
	);
};

GeoJsonLayer.propTypes = {
	omittedFeatureKeys: PropTypes.array, // list of feature keys that shouldn't be rendered
	features: PropTypes.array,
	styleDefinition: PropTypes.object,
	hoveredStyleDefinition: PropTypes.oneOfType([
		PropTypes.string,
		PropTypes.object,
	]),
	onFeatureClick: PropTypes.func,
	selectable: PropTypes.bool,
	hoverable: PropTypes.bool,
	pointAsMarker: PropTypes.bool,
	paneName: PropTypes.string,
	icons: PropTypes.object,
	fidColumnName: PropTypes.string,
};

export default GeoJsonLayer;
