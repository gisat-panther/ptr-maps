import {MapLayer,withLeaflet } from 'react-leaflet';
import LeafletCanvasLayer from './LeafletCanvasLayer';

class ReactCanvasLayer extends MapLayer {
	createLeafletElement(props) {
		let layer = new LeafletCanvasLayer();
		layer.setProps(props);
		return layer;
	}

	updateLeafletElement(fromProps, toProps) {
		super.updateLeafletElement(fromProps, toProps);

		// TODO
		if (fromProps.selected !== toProps.selected || fromProps.features !== toProps.features || fromProps.style !== toProps.style) {
			this.leafletElement.setProps(toProps);
		}
	}
}

export default withLeaflet(ReactCanvasLayer)