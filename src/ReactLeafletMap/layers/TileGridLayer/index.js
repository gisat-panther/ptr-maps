import React from 'react';
import PropTypes from 'prop-types';
import {map as mapUtils} from '@gisatcz/ptr-utils';
import {utils as tileGridUtils, grid} from '@gisatcz/ptr-tile-grid';
import {Marker, Pane} from 'react-leaflet';
import { GeoJSON as LeafletGeoJSON } from 'leaflet';
import { createLayerComponent } from '@react-leaflet/core'

const getBoxRange = (boxRange, width, height) => {
	const calculatedBoxRange = mapUtils.view.getNearestZoomLevelBoxRange(
		width,
		height,
		boxRange
	);

	if (boxRange !== calculatedBoxRange) {
		return calculatedBoxRange;
	} else {
		return boxRange;
	}
};

const getTileGridLevel = (boxRange, viewport) =>{
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



const getGeoJsonTileGrid = (tileGrid, boxRange, viewport) => {
	const level = getTileGridLevel(boxRange, viewport);

	// // todo
	// // add buffer for leveles bigger than 5
	const size = tileGridUtils.getGridSizeForLevel(level);

	// //consider caching levels
	const geojsonTileGrid = tileGridUtils.getTileGridAsGeoJSON(tileGrid, size);
	return geojsonTileGrid;
}

const getTilesMarkers = (tileGrid = [], boxRange, viewport) => {
	const level = getTileGridLevel(boxRange, viewport);

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


const getGeoJsonGrid = (view, options, ) => {
	const recalculatedBoxrange = getBoxRange(
		view.boxRange,
		options.viewport.width,
		options.viewport.height
	);

	const tileGrid = grid.getTileGrid(
		options.viewport.width,
		options.viewport.height,
		recalculatedBoxrange,
		view.center,
		true
	);

	const geoJsonTileGrid = getGeoJsonTileGrid(
		tileGrid,
		recalculatedBoxrange,
		options.viewport
	);

	return geoJsonTileGrid;

	// generate new key on features change to return the new instance
	// more: https://react-leaflet.js.org/docs/en/components#geojson
	// const key = this.getRenderId(geoJsonTileGrid.features);

	// const tilesMarkers = this.getTilesMarkers(
	// 	tileGrid,
	// 	recalculatedBoxrange,
	// 	options.viewport
	// );
}


function createLeafletElement({ layerKey, uniqueLayerKey, view, zoom, zIndex, options, pane }, ctx) {
	const geoJsonTileGrid = getGeoJsonGrid(view, options);
	const instance = new LeafletGeoJSON(geoJsonTileGrid.features, {})
    return { instance, context: { ...ctx, overlayContainer: instance } }
}


function updateLeafletElement(instance, { layerKey, uniqueLayerKey, view, zoom, zIndex, options, pane }, prevProps) {

	//remove current tiles
	instance.getLayers().map(l => instance.removeLayer(l));

	const geoJsonTileGrid = getGeoJsonGrid(view, options);
	instance.addData(geoJsonTileGrid.features);
}

const TileGridLayer = createLayerComponent(createLeafletElement, updateLeafletElement)


TileGridLayer.propTypes = {
	layerKey: PropTypes.string,
	uniqueLayerKey: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
	view: PropTypes.object,
	zoom: PropTypes.number,
	zIndex: PropTypes.number,
};

export default TileGridLayer;