import React from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import _ from 'lodash';
import {utils} from '@gisatcz/ptr-utils';
import {Pane} from 'react-leaflet';

import helpers from './helpers';
import Feature from './Feature';
import constants from '../../../constants';
import GeoJsonLayer from './GeoJsonLayer';

class SvgVectorLayer extends React.PureComponent {
	static propTypes = {
		layerKey: PropTypes.string,
		uniqueLayerKey: PropTypes.string, // typically a combination of layerKey and data source key (or just layerKey, if no data source)
		renderAsGeoJson: PropTypes.bool, // Use Leaflet's GeoJSON layer to render vector features
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

			_.forEach(features, feature => {
				const type = feature && feature.geometry && feature.geometry.type;

				if (type) {
					const fid =
						this.props.fidColumnName &&
						feature.properties[this.props.fidColumnName];
					const uniqueFeatureKey = `${this.props.uniqueLayerKey}_${fid}`;

					let selected = null;
					let defaultStyle = null;

					if (this.props.selected && fid) {
						_.forIn(this.props.selected, (selection, key) => {
							if (selection.keys && _.includes(selection.keys, fid)) {
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
				sortedPointFeatures = _.orderBy(
					pointFeatures,
					['defaultStyle.radius', 'fid'],
					['desc', 'asc']
				);
			}

			// sort polygon features, if selected
			if (polygonFeatures.length) {
				if (this.props.selected) {
					sortedPolygonFeatures = _.orderBy(
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
			'leaflet-hoverable-pane': this.props.hoverable,
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
		if (
			this.props.renderAsGeoJson ||
			features.length > constants.maxFeaturesAsReactElement
		) {
			// GeoJsonLayer doesn't get context
			return this.renderGeoJson(features);
		} else {
			return features.map((item, index) => this.renderFeature(item, index));
		}
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

	renderFeature(data, index) {
		const key =
			data.uniqueFeatureKey ||
			`${this.props.uniqueLayerKey}_${data.fid || index}`;

		return (
			<Feature
				key={key}
				uniqueFeatureKey={data.uniqueFeatureKey}
				onClick={this.onFeatureClick}
				fid={data.fid}
				fidColumnName={this.props.fidColumnName}
				feature={data.feature}
				type={data.feature.geometry.type}
				pointAsMarker={this.props.pointAsMarker}
				selectable={this.props.selectable}
				selected={data.selected}
				selectedStyleDefinition={data.selectedStyleDefinition}
				selectedHoveredStyleDefinition={data.selectedStyleDefinition}
				hoverable={this.props.hoverable}
				styleDefinition={this.props.style}
				hoveredStyleDefinition={this.props.hovered && this.props.hovered.style}
				icons={this.props.resources?.icons}
			/>
		);
	}
}

export default SvgVectorLayer;
