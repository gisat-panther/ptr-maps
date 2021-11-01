import React, {useMemo, useCallback, useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import {isArray as _isArray} from 'lodash';
import {MapContainer, Pane, TileLayer} from 'react-leaflet';
import {map as mapUtils} from '@gisatcz/ptr-utils';

import viewHelpers from './helpers/view';
import constants from '../constants';

/**
 * Return one or multiple layer as an array (depending on number of data sources)
 * @param backgroundLayer {Object} Panther Layer definition
 * @returns {(JSX.Element|null)[]}
 */
function getBackgroundLayers(backgroundLayer) {
	const backgroundLayersSource = _isArray(backgroundLayer)
		? backgroundLayer
		: [backgroundLayer];
	return (
		backgroundLayersSource &&
		backgroundLayersSource.map((layer, i) => getLayerByType(layer, i))
	);
}

/**
 * Return layer by given layer.type
 * @param layer {Object} Panther Layer definition
 * @param layer.type {string} defined type of layer
 * @param i {number} index of layer if there are several data sources for one layer
 * @param zIndex
 * @param zoom
 * @returns {JSX.Element|null}
 */
function getLayerByType(layer, i, zIndex, zoom) {
	if (layer && layer.type) {
		switch (layer.type) {
			case 'wmts':
				return getTileLayer(layer, i);
			default:
				return null;
		}
	} else {
		return null;
	}
}

/**
 * Return TileLayer
 * @param layer {Object} Panther Layer definition
 * @param i {number} index of layer if there are several data sources for one layer
 * @returns {JSX.Element} TileLayer https://react-leaflet.js.org/docs/api-components/#tilelayer
 */
function getTileLayer(layer, i) {
	let {url, ...restOptions} = layer.options;

	// fix for backward compatibility
	if (layer.options.urls) {
		url = layer.options.urls[0];
	}

	return <TileLayer key={layer.key || i} url={url} {...restOptions} />;
}

const MapViewControl = ({map, zoom, center, width, height, onViewChange}) => {
	console.log('MapViewControlRender');
	const mapZoom = map.getZoom();

	if (mapZoom !== zoom) {
		console.log('external change -> setZoom');
		map.setZoom(zoom);
	}

	const onZoom = useCallback(() => {
		console.log('onZoom');
		const boxRange = mapUtils.view.getBoxRangeFromZoomLevel(
			map.getZoom(),
			width,
			height
		);
		if (onViewChange) {
			onViewChange({boxRange});
		}
	}, [map]);

	useEffect(() => {
		map.on('zoom', onZoom);
		return () => {
			map.off('zoom', onZoom);
		};
	}, [map, onZoom]);

	return null;
};

const ReactLeafletMap = ({
	backgroundLayer,
	height,
	view,
	width,
	onViewChange,
}) => {
	console.log('ReactLeafletMap render');
	const [map, setMap] = useState(null);
	const {zoom, center} = viewHelpers.getLeafletViewportFromViewParams(
		view,
		width,
		height
	);

	const displayMap = useMemo(() => {
		console.log('MapContainer render');
		return (
			<MapContainer
				className="ptr-map ptr-ReactLeafletMap"
				center={center}
				zoom={zoom}
				zoomControl={false}
				whenCreated={setMap}
			>
				<Pane
					style={{zIndex: constants.defaultLeafletPaneZindex + 101}}
					name="backgroundLayers"
				>
					{getBackgroundLayers(backgroundLayer)}
				</Pane>
			</MapContainer>
		);
	}, []);

	return (
		<>
			{displayMap}
			{map ? (
				<MapViewControl
					map={map}
					zoom={zoom}
					center={center}
					width={width}
					height={height}
					onViewChange={onViewChange}
				/>
			) : null}
		</>
	);
};

ReactLeafletMap.propTypes = {
	backgroundLayer: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
	height: PropTypes.number,
	view: PropTypes.object,
	width: PropTypes.number,
};

export default ReactLeafletMap;
