import isEqual from 'fast-deep-equal';
import wms from './leaflet.wms';
var MapLayer = null;
import {isServer} from '@gisatcz/ptr-core';
if (!isServer) {
	var MapLayer = require('react-leaflet').MapLayer;
	var TileLayer = require('leaflet').TileLayer;
	var withLeaflet = require('react-leaflet').withLeaflet;
}

export const EVENTS_RE = /^on(.+)$/i;
class WMSLayer extends MapLayer {
	createLeafletElement(props) {
		const {url, params, singleTile, ...restParams} = props;
		const {leaflet: _l, ...options} = this.getOptions({
			...restParams,
			...params,
		});

		if (singleTile) {
			const source = new wms.source(url, {
				...options,
				pane: _l.pane,
				tiled: false,
				identify: false,
			});
			const layer = source.getLayer(options.layers);
			layer.options.pane = _l.pane;
			return layer;
		} else {
			return new TileLayer.WMS(url, options);
		}
	}

	updateLeafletElement(fromProps, toProps) {
		super.updateLeafletElement(fromProps, toProps);

		const {url: prevUrl} = fromProps;
		const {url} = toProps;

		if (url !== prevUrl) {
			this.leafletElement.setUrl(url);
		}
		if (!isEqual(fromProps.params, toProps.params)) {
			this.leafletElement.setParams({
				...toProps.params,
				pane: toProps.leaflet.pane,
			});
		}
	}

	getOptions(params) {
		const superOptions = super.getOptions(params);
		return Object.keys(superOptions).reduce((options, key) => {
			if (!EVENTS_RE.test(key)) {
				options[key] = superOptions[key];
			}
			return options;
		}, {});
	}
}

var WMSLayerWithLeaflet = null;
if (!isServer) {
	WMSLayerWithLeaflet = withLeaflet(WMSLayer);
}
export default WMSLayerWithLeaflet;
