import React from 'react';
import {createLayerComponent} from '@react-leaflet/core';
import LeafletCanvasLayer from './LeafletCanvasLayer';

function createLeafletElement(props, context) {
	const instance = new LeafletCanvasLayer({
		paneName: props.uniqueLayerKey,
		paneZindex: props.zIndex,
	});

	setTimeout(() => {
		instance.setProps(props);
	}, 10);

	return {instance, context: {...context, overlayContainer: instance}};
}

function updateLeafletElement(instance, props, prevProps) {
	if (prevProps.zIndex !== props.zIndex) {
		instance.setPaneZindex(props.uniqueLayerKey, props.zIndex);
	}

	// TODO
	if (
		prevProps.selected !== props.selected ||
		prevProps.features !== props.features ||
		prevProps.style !== props.style ||
		prevProps.omittedFeatureKeys !== props.omittedFeatureKeys
	) {
		instance.setProps(props);
	}
}

const CanvasVectorLayer = createLayerComponent(
	createLeafletElement,
	updateLeafletElement
);

export default CanvasVectorLayer;
