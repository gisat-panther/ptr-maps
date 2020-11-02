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
		if (fromProps.selected !== toProps.selected) {
			this.leafletElement.setProps(toProps);
			this.leafletElement.needRedraw()
		}

		if (fromProps.features !== toProps.features) {
			this.leafletElement.setProps(toProps);
			this.leafletElement.needRedraw()
		}
	}
}

export default withLeaflet(ReactCanvasLayer)