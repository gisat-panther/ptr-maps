import {createLayerComponent} from '@react-leaflet/core';
import LeafletCanvasLayer from './LeafletCanvasLayer';
import paneHelpers from '../../helpers/pane';

function createLeafletElement(props, context) {
	const paneKey = paneHelpers.getKey(props.mapKey, props.uniqueLayerKey);
	const instance = new LeafletCanvasLayer({
		paneName: paneKey,
		paneZindex: props.zIndex,
	});

	// ensure the canvas and the corresponding pane have been created in the DOM, before features are added
	setTimeout(() => {
		instance.setProps(props);
	}, 10);

	return {instance, context: {...context, overlayContainer: instance}};
}

function updateLeafletElement(instance, props, prevProps) {
	if (prevProps.zIndex !== props.zIndex) {
		const paneKey = paneHelpers.getKey(props.mapKey, props.uniqueLayerKey);
		instance.setPaneZindex(paneKey, props.zIndex);
	}

	// TODO
	if (
		prevProps.selected !== props.selected ||
		prevProps.features !== props.features ||
		prevProps.style !== props.style ||
		prevProps.omittedFeatureKeys !== props.omittedFeatureKeys
	) {
		// ensure that the layer was already created (see comment above)
		setTimeout(() => {
			instance.setProps(props);
		}, 10);
	}
}

const CanvasVectorLayer = createLayerComponent(
	createLeafletElement,
	updateLeafletElement
);

export default CanvasVectorLayer;
