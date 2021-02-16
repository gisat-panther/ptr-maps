import React from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import {utils} from '@gisatcz/ptr-utils';
import {map as mapUtils} from '@gisatcz/ptr-utils';
import {utils as tileGridUtils, grid} from '@gisatcz/ptr-tile-grid';
import {GeoJSON, withLeaflet, Marker, Pane} from 'react-leaflet';
import memoize from 'memoize-one';
import helpers from '../SvgVectorLayer/helpers';

class TileGridLayer extends React.PureComponent {
	static propTypes = {
		layerKey: PropTypes.string,
		uniqueLayerKey: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
		view: PropTypes.object,
		zoom: PropTypes.number,
		zIndex: PropTypes.number,
	};

	constructor(props) {
		super(props);

		this.pointsPaneName = utils.uuid();
		this.getStyle = this.getStyle.bind(this);
		this.onEachFeature = this.onEachFeature.bind(this);

		this.getRenderId = memoize(features => {
			if (features) {
				return utils.uuid();
			}
		});
	}

	onEachFeature(feature, layer) {
		const geometryType = feature.geometry.type;
		const isPolygon =
			geometryType === 'Polygon' || geometryType === 'MultiPolygon';
		const isLine = geometryType === 'Line' || geometryType === 'LineString';

		const styles = helpers.calculateStyle(
			feature,
			this.props.style,
			undefined,
			feature.selected,
			feature.selectedStyleDefinition,
			feature.selectedHoveredStyleDefinition
		);
	}

	getStyle(feature) {
		const styles = helpers.calculateStyle(
			feature,
			this.props.style,
			undefined,
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

	render() {
		const options = this.props.options;
		return this.renderBasicVectorLayer(options);
	}

	getGeoJsonTileGrid(tileGrid, boxRange, viewport) {
		const level = this.getTileGridLevel(boxRange, viewport);

		// // todo
		// // add buffer for leveles bigger than 5
		const size = tileGridUtils.getGridSizeForLevel(level);

		// //consider caching levels
		const geojsonTileGrid = tileGridUtils.getTileGridAsGeoJSON(tileGrid, size);
		return geojsonTileGrid;
	}

	getTileGridLevel(boxRange, viewport) {
		const viewportRange = mapUtils.view.getMapViewportRange(
			viewport.width,
			viewport.height
		);
		const nearestBoxRange = mapUtils.view.getNearestZoomLevelBoxRange(
			viewport.width,
			viewport.height,
			boxRange
		);
		const level = grid.getLevelByViewport(nearestBoxRange, viewportRange);

		return level;
	}
	getTilesMarkers(tileGrid = [], boxRange, viewport) {
		const level = this.getTileGridLevel(boxRange, viewport);

		const markers = tileGrid.reduce((acc, row) => {
			const rowMarkers = row.map((tile, i) => {
				return (
					<Pane
						style={{zIndex: this.props.zIndex}}
						key={`${level}-${tile[0]}-${tile[1]}`}
					>
						<Marker
							zIndex={this.props.zIndex}
							position={[tile[1], tile[0]]}
							icon={
								new L.DivIcon({
									//push every second tile title up to prevent overlays
									iconAnchor: [-10, 20 + (i % 2) * 20],
									className: 'my-div-icon',
									html: `<div style="display:flex"><div style="white-space: nowrap;">${level}-${tile[0]}-${tile[1]}</div></div>`,
								})
							}
						/>
					</Pane>
				);
			});

			return [...acc, ...rowMarkers];
		}, []);

		return markers;
	}

	renderBasicVectorLayer(options) {
		const {options: opt, ...props} = this.props;
		const tileGrid = grid.getTileGrid(
			options.viewport.width,
			options.viewport.height,
			props.view.boxRange,
			props.view.center,
			true
		);

		const geoJsonTileGrid = this.getGeoJsonTileGrid(
			tileGrid,
			props.view.boxRange,
			options.viewport
		);

		// generate new key on features change to return the new instance
		// more: https://react-leaflet.js.org/docs/en/components#geojson
		const key = this.getRenderId(geoJsonTileGrid.features);

		const tilesMarkers = this.getTilesMarkers(
			tileGrid,
			props.view.boxRange,
			options.viewport
		);

		return (
			<>
				<GeoJSON
					key={key}
					data={geoJsonTileGrid.features}
					style={this.getStyle}
					onEachFeature={this.onEachFeature}
					zIndex={this.props.zIndex}
					// pointToLayer={this.pointToLayer}
					// filter={this.filter}
				/>
				{tilesMarkers}
			</>
		);
	}
}

export default withLeaflet(TileGridLayer);
