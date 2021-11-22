import GeoRasterLayer from 'georaster-layer-for-leaflet';
import React from 'react';
import {createLayerComponent} from '@react-leaflet/core';
import {mapStyle as mapStyleUtils} from '@gisatcz/ptr-utils';

import styleConstants from '../../../constants/styles';

const DEFAULT_RESOLUTION = 128;

function createLeafletElement(props, context) {
	const {georaster, paneName, options, opacity} = props;
	const instance = new GeoRasterLayer({
		georaster,
		resampleMethod: 'nearest',
		pane: paneName,
		resolution: options.resolution || DEFAULT_RESOLUTION,
		pixelValuesToColorFn: getStyle.bind(this, options?.style),
		// debugLevel: 5,
	});

	return {instance, context: {...context, overlayContainer: instance}};
}

function updateLeafletElement(instance, props, prevProps) {
	if (prevProps.options.style !== props.options.style) {
		instance.updateColors(getStyle.bind(this, prevProps.options.style));
	}
}

function getStyle(styleDefinition, pixelValues) {
	if (styleDefinition) {
		const style = mapStyleUtils.getStyleObjectForRaster(
			pixelValues,
			styleDefinition
		);
		if (style) {
			return style.color;
		} else {
			return styleConstants.defaultRasterPixelStyle;
		}
	} else {
		return styleConstants.defaultRasterPixelStyle;
	}
}

const CogLayer = createLayerComponent(
	createLeafletElement,
	updateLeafletElement
);

export default CogLayer;
