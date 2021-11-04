import React from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import {
	forEach as _forEach,
	forIn as _forIn,
	includes as _includes,
	orderBy as _orderBy,
} from 'lodash';
import {utils} from '@gisatcz/ptr-utils';
import {Pane} from 'react-leaflet';

import helpers from './helpers';
import GeoJsonLayer from './GeoJsonLayer';

class SvgVectorLayer extends React.PureComponent {
	static propTypes = {
		layerKey: PropTypes.string,
		uniqueLayerKey: PropTypes.string, // typically a combination of layerKey and data source key (or just layerKey, if no data source)
		features: PropTypes.array,
		fidColumnName: PropTypes.string,
		omittedFeatureKeys: PropTypes.array,
		selectable: PropTypes.bool,
		selected: PropTypes.object,
		hoverable: PropTypes.bool,
		hovered: PropTypes.object,
		style: PropTypes.object,
		pointAsMarker: PropTypes.bool,
		onClick: PropTypes.func,
		withSelectedFeaturesOnly: PropTypes.bool, // True, if layer contains only selected features
	};

	constructor(props) {
		super(props);

		this.pointsPaneName = utils.uuid();
		this.linesPaneName = utils.uuid();
		this.polygonsPaneName = utils.uuid();
		this.onFeatureClick = this.onFeatureClick.bind(this);
	}

	onFeatureClick(fid) {
		if (this.props.onClick) {
			this.props.onClick(this.props.layerKey, [fid]);
		}
	}

	prepareData(features) {
		if (features) {
			let pointFeatures = [];
			let polygonFeatures = [];
			let lineFeatures = [];

			let sortedPointFeatures = null;
			let sortedPolygonFeatures = null;

			_forEach(features, feature => {
				const type = feature && feature.geometry && feature.geometry.type;

				if (type) {
					const fid =
						feature.id ||
						(this.props.fidColumnName &&
							feature.properties[this.props.fidColumnName]);
					const uniqueFeatureKey = `${this.props.uniqueLayerKey}_${fid}`;

					let selected = null;
					let defaultStyle = null;

					if (this.props.selected && fid) {
						_forIn(this.props.selected, (selection, key) => {
							if (selection.keys && _includes(selection.keys, fid)) {
								selected = selection;
							}
						});
					}

					if (type === 'Point' || type === 'MultiPoint') {
						defaultStyle = helpers.getDefaultStyle(feature, this.props.style);
					}

					const data = {
						feature,
						fid,
						uniqueFeatureKey,
						defaultStyle,
						selected: !!selected,
						selectedStyleDefinition: selected?.style,
						selectedHoveredStyleDefinition: selected?.hoveredStyle,
					};

					switch (type) {
						case 'Point':
						case 'MultiPoint':
							pointFeatures.push(data);
							break;
						case 'Polygon':
						case 'MultiPolygon':
							polygonFeatures.push(data);
							break;
						case 'LineString':
						case 'MultiLineString':
							lineFeatures.push(data);
							break;
						default:
							break;
					}
				}
			});

			// sort point features by radius
			if (pointFeatures.length) {
				sortedPointFeatures = _orderBy(
					pointFeatures,
					['defaultStyle.radius', 'fid'],
					['desc', 'asc']
				);
			}

			// sort polygon features, if selected
			if (polygonFeatures.length) {
				if (this.props.selected) {
					sortedPolygonFeatures = _orderBy(
						polygonFeatures,
						['selected'],
						['asc']
					);
				} else {
					sortedPolygonFeatures = polygonFeatures;
				}
			}

			return {
				polygons: sortedPolygonFeatures,
				points: sortedPointFeatures || pointFeatures,
				lines: lineFeatures,
			};
		} else {
			return null;
		}
	}

	render() {
		const data = this.prepareData(this.props.features);
		const style = this.props.opacity ? {opacity: this.props.opacity} : null;
		const classes = classnames({
			'hoverable-pane': this.props.hoverable,
			'selected-features-pane': this.props.withSelectedFeaturesOnly,
		});

		return data ? (
			<>
				{data.polygons?.length ? (
					<Pane className={classes} style={style} name={this.polygonsPaneName}>
						{this.renderFeatures(data.polygons)}
					</Pane>
				) : null}
				{data.lines?.length ? (
					<Pane className={classes} style={style} name={this.linesPaneName}>
						{this.renderFeatures(data.lines)}
					</Pane>
				) : null}
				{data.points?.length ? (
					<Pane className={classes} style={style} name={this.pointsPaneName}>
						{this.renderFeatures(data.points)}
					</Pane>
				) : null}
			</>
		) : null;
	}

	renderFeatures(features) {
		return this.renderGeoJson(features);
	}

	renderGeoJson(features) {
		return (
			<GeoJsonLayer
				layerKey={this.props.layerKey}
				uniqueLayerKey={this.props.uniqueLayerKey}
				paneName={this.pointsPaneName}
				features={features}
				onFeatureClick={this.onFeatureClick}
				omittedFeatureKeys={this.props.omittedFeatureKeys}
				fidColumnName={this.props.fidColumnName}
				pointAsMarker={this.props.pointAsMarker}
				selectable={this.props.selectable}
				hoverable={this.props.hoverable}
				styleDefinition={this.props.style}
				hoveredStyleDefinition={this.props.hovered && this.props.hovered.style}
				icons={this.props.resources?.icons}
			/>
		);
	}
}

export default SvgVectorLayer;
