import React from 'react';
import {
	forEach as _forEach,
	forIn as _forIn,
	includes as _includes,
	orderBy as _orderBy,
} from 'lodash';
import {Pane} from 'react-leaflet';
import centerOfMass from '@turf/center-of-mass';
import flip from '@turf/flip';
import constants from '../../../constants';

import SvgVectorLayer from '../SvgVectorLayer';
import Feature from '../SvgVectorLayer/Feature';

class DiagramLayer extends SvgVectorLayer {
	constructor(props) {
		super(props);
	}

	getDiagramDefaultStyle(feature, defaultStyleObject) {
		return this.getDiagramLeafletStyle(feature, defaultStyleObject);
	}

	getDiagramAccentedStyle(feature, defaultStyleObject, accentedStyleObject) {
		const style = {...defaultStyleObject, ...accentedStyleObject};
		return this.getDiagramLeafletStyle(feature, style);
	}

	getDiagramLeafletStyle(feature, style) {
		let finalStyle = {};

		finalStyle.color = style.diagramOutlineColor
			? style.diagramOutlineColor
			: null;
		finalStyle.weight = style.diagramOutlineWidth
			? style.diagramOutlineWidth
			: 0;
		finalStyle.opacity = style.diagramOutlineOpacity
			? style.diagramOutlineOpacity
			: 1;
		finalStyle.fillOpacity = style.diagramFillOpacity
			? style.diagramFillOpacity
			: 1;
		finalStyle.fillColor = style.diagramFill;

		if (!style.diagramFill) {
			finalStyle.fillColor = null;
			finalStyle.fillOpacity = 0;
		}

		if (!style.diagramOutlineColor || !style.diagramOutlineWidth) {
			finalStyle.color = null;
			finalStyle.opacity = 0;
			finalStyle.weight = 0;
		}

		if (style.diagramSize) {
			finalStyle.radius = style.diagramSize;
		} else if (style.diagramVolume) {
			finalStyle.radius = Math.sqrt(style.diagramVolume / Math.PI);
		}

		return finalStyle;
	}

	prepareData(features) {
		if (features) {
			let data = [];

			_forEach(features, feature => {
				const fid =
					this.props.fidColumnName &&
					feature.properties[this.props.fidColumnName];
				const centroid = centerOfMass(feature.geometry);

				let selected = null;
				let areaSelectedStyle = null;
				let diagramSelectedStyle = null;
				let areaSelectedHoveredStyle = null;
				let diagramSelectedHoveredStyle = null;
				if (this.props.selected && fid) {
					_forIn(this.props.selected, (selection, key) => {
						if (selection.keys && _includes(selection.keys, fid)) {
							selected = selection;
						}
					});
				}

				// Flip coordinates due to different leaflet implementation
				const flippedFeature = flip(feature);
				const flippedCentroid = flip(centroid);

				const diagramLeafletCoordinates =
					flippedCentroid &&
					flippedCentroid.geometry &&
					flippedCentroid.geometry.coordinates;
				const areaLeafletCoordinates =
					flippedFeature &&
					flippedFeature.geometry &&
					flippedFeature.geometry.coordinates;

				// Prepare default styles
				const defaultStyleObject = this.getDefaultStyleObject(feature);
				const areaDefaultStyle = this.getFeatureDefaultStyle(
					feature,
					defaultStyleObject
				);
				const diagramDefaultStyle = this.getDiagramDefaultStyle(
					feature,
					defaultStyleObject
				);

				// Prepare hovered style
				let hoveredStyleObject = null;
				let areaHoveredStyle = null;
				let diagramHoveredStyle = null;
				if (this.props.hovered?.style) {
					hoveredStyleObject =
						this.props.hovered.style === 'default'
							? {
									...constants.vectorFeatureStyle.hovered,
									...constants.diagramStyle.hovered,
							  }
							: this.props.hovered.style;
					areaHoveredStyle = this.getFeatureAccentedStyle(
						feature,
						defaultStyleObject,
						hoveredStyleObject
					);
					diagramHoveredStyle = this.getDiagramAccentedStyle(
						feature,
						defaultStyleObject,
						hoveredStyleObject
					);
				}

				// Prepare selected and selected hovered style, if selected
				if (selected) {
					let selectedStyleObject,
						selectedHoveredStyleObject = null;
					if (selected.style) {
						selectedStyleObject =
							selected.style === 'default'
								? {
										...constants.vectorFeatureStyle.selected,
										...constants.diagramStyle.selected,
								  }
								: selected.style;
						areaSelectedStyle = this.getFeatureAccentedStyle(
							feature,
							defaultStyleObject,
							selectedStyleObject
						);
						diagramSelectedStyle = this.getDiagramAccentedStyle(
							feature,
							defaultStyleObject,
							selectedStyleObject
						);
					}
					if (selected.hoveredStyle) {
						selectedHoveredStyleObject =
							selected.hoveredStyle === 'default'
								? {
										...constants.vectorFeatureStyle.selectedHovered,
										...constants.diagramStyle.selectedHovered,
								  }
								: selected.hoveredStyle;
						areaSelectedHoveredStyle = this.getFeatureAccentedStyle(
							feature,
							defaultStyleObject,
							selectedHoveredStyleObject
						);
						diagramSelectedHoveredStyle = this.getDiagramAccentedStyle(
							feature,
							defaultStyleObject,
							selectedHoveredStyleObject
						);
					}
				}

				data.push({
					feature,
					fid,
					selected: !!selected,
					hoverable: this.props.hoverable,
					selectable: this.props.selectable,
					areaDefaultStyle,
					areaHoveredStyle,
					areaSelectedStyle,
					areaSelectedHoveredStyle,
					areaLeafletCoordinates,
					diagramDefaultStyle,
					diagramHoveredStyle,
					diagramSelectedStyle,
					diagramSelectedHoveredStyle,
					diagramLeafletCoordinates,
				});
			});

			return _orderBy(data, ['diagramDefaultStyle.radius'], ['desc']);
		} else {
			return null;
		}
	}

	render() {
		const data = this.prepareData(this.props.features);
		let sortedPolygons = data;
		if (this.props.selected) {
			sortedPolygons = _orderBy(data, ['selected'], ['asc']);
		}

		const style = this.props.opacity ? {opacity: this.props.opacity} : null;

		return data ? (
			<Pane style={style}>
				<Pane>
					{sortedPolygons.map((item, index) => this.renderArea(item, index))}
				</Pane>
				<Pane>
					{data.map((item, index) => this.renderDiagram(item, index))}
				</Pane>
			</Pane>
		) : null;
	}

	renderArea(data, index) {
		return (
			<Feature
				key={data.fid || index}
				fid={data.fid}
				onClick={this.onFeatureClick}
				fidColumnName={this.props.fidColumnName}
				type={data.feature.geometry.type}
				selectable={data.selectable}
				hoverable={data.hoverable}
				defaultStyle={data.areaDefaultStyle}
				hoveredStyle={data.areaHoveredStyle}
				selectedStyle={data.areaSelectedStyle}
				selectedHoveredStyle={data.areaSelectedHoveredStyle}
				selected={data.selected}
				leafletCoordinates={data.areaLeafletCoordinates}
				feature={data.feature}
			/>
		);
	}

	renderDiagram(data, index) {
		return (
			<Feature
				key={data.fid || index}
				fid={data.fid}
				onClick={this.onFeatureClick}
				fidColumnName={this.props.fidColumnName}
				type="Point"
				selectable={data.selectable}
				hoverable={data.hoverable}
				defaultStyle={data.diagramDefaultStyle}
				hoveredStyle={data.diagramHoveredStyle}
				selectedStyle={data.diagramSelectedStyle}
				selectedHoveredStyle={data.diagramSelectedHoveredStyle}
				selected={data.selected}
				leafletCoordinates={data.diagramLeafletCoordinates}
				feature={data.feature}
			/>
		);
	}
}

export default DiagramLayer;
