var MapLayer = null;
import {isServer} from '@gisatcz/ptr-core';
if (!isServer) {
    var MapLayer = require('react-leaflet').MapLayer;
    var withLeaflet = require('react-leaflet').withLeaflet;
}

import LeafletCanvasLayer from './LeafletCanvasLayer';

class CanvasVectorLayer extends MapLayer {
	createLeafletElement(props) {
		let layer = new LeafletCanvasLayer({paneName: props.uniqueLayerKey, paneZindex: props.zIndex});
		layer.setProps(props);
		return layer;
	}

	updateLeafletElement(fromProps, toProps) {
		super.updateLeafletElement(fromProps, toProps);

		// TODO
		if (fromProps.selected !== toProps.selected || fromProps.features !== toProps.features || fromProps.style !== toProps.style || fromProps.omittedFeatureKeys !== this.props.omittedFeatureKeys) {
			this.leafletElement.setProps(toProps);
		}
	}
}

var CanvasVectorLayerWithLeaflet = null;
if (!isServer) {
    CanvasVectorLayerWithLeaflet = withLeaflet(CanvasVectorLayer);
}
export default CanvasVectorLayerWithLeaflet
