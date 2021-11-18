import PropTypes from 'prop-types';
import {createLayerComponent} from '@react-leaflet/core';
import wms from './leaflet.wms';

function createLeafletElement(props, context) {
	const {pane, url, crs, params} = props;

	const source = new wms.source(url, {
		...params,
		crs,
		pane,
		tiled: false,
		identify: false,
	});
	const instance = source.getLayer(params.layers, {pane});
	return {instance, context: {...context, overlayContainer: instance}};
}

function updateLeafletElement(instance, props, prevProps) {
	//TODO add updates
	// if (prevProps.options.style !== props.options.style) {
	// 	instance.updateColors(getStyle.bind(this, prevProps.options.style));
	// }
}

const SingleTileLayer = createLayerComponent(
	createLeafletElement,
	updateLeafletElement
);

SingleTileLayer.propTypes = {
	crs: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
	opacity: PropTypes.number,
	url: PropTypes.string,
	params: PropTypes.object,
	pane: PropTypes.string,
};

export default SingleTileLayer;
