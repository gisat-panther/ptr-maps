// eslint-disable-next-line no-unused-vars
import React, {useRef} from 'react';
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

const SvgVectorLayer = ({
	opacity,
	layerKey,
	uniqueLayerKey,
	features,
	fidColumnName,
	omittedFeatureKeys,
	selectable,
	selected,
	hoverable,
	hovered,
	style,
	pointAsMarker,
	onClick,
	withSelectedFeaturesOnly,
	resources,
}) => {
	const pointsPaneName = useRef(utils.uuid());
	const linesPaneName = useRef(utils.uuid());
	const polygonsPaneName = useRef(utils.uuid());

	const onFeatureClick = fid => {
		if (onClick) {
			onClick(layerKey, [fid]);
		}
	};
	const prepareData = features => {
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
						feature.id || (fidColumnName && feature.properties[fidColumnName]);
					const uniqueFeatureKey = `${uniqueLayerKey}_${fid}`;

					let selected = null;
					let defaultStyle = null;

					if (selected && fid) {
						_forIn(selected, selection => {
							if (selection.keys && _includes(selection.keys, fid)) {
								selected = selection;
							}
						});
					}

					if (type === 'Point' || type === 'MultiPoint') {
						defaultStyle = helpers.getDefaultStyle(feature, style);
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
				if (selected) {
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
	};

	const renderGeoJson = features => {
		return (
			<GeoJsonLayer
				layerKey={layerKey}
				uniqueLayerKey={uniqueLayerKey}
				paneName={pointsPaneName.current}
				features={features}
				onFeatureClick={onFeatureClick}
				omittedFeatureKeys={omittedFeatureKeys}
				fidColumnName={fidColumnName}
				pointAsMarker={pointAsMarker}
				selectable={selectable}
				hoverable={hoverable}
				styleDefinition={style}
				hoveredStyleDefinition={hovered && hovered.style}
				icons={resources?.icons}
			/>
		);
	};

	const renderFeatures = features => {
		return renderGeoJson(features);
	};

	const data = prepareData(features);
	const paneStyle = opacity ? {opacity: opacity} : null;
	const classes = classnames({
		'hoverable-pane': hoverable,
		'selected-features-pane': withSelectedFeaturesOnly,
	});
	return data ? (
		<>
			{data.polygons?.length ? (
				<Pane
					className={classes}
					style={{...paneStyle, zIndex: 1}}
					name={polygonsPaneName.current}
				>
					{renderFeatures(data.polygons)}
				</Pane>
			) : null}
			{data.lines?.length ? (
				<Pane
					className={classes}
					style={{...paneStyle, zIndex: 2}}
					name={linesPaneName.current}
				>
					{renderFeatures(data.lines)}
				</Pane>
			) : null}
			{data.points?.length ? (
				<Pane
					className={classes}
					style={{...paneStyle, zIndex: 3}}
					name={pointsPaneName.current}
				>
					{renderFeatures(data.points)}
				</Pane>
			) : null}
		</>
	) : null;
};

SvgVectorLayer.propTypes = {
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
	opacity: PropTypes.number,
	resources: PropTypes.object,
};
export default SvgVectorLayer;
