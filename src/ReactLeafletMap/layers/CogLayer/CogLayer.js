import React from 'react';
import GeoRasterLayer from 'georaster-layer-for-leaflet';
import {MapLayer, withLeaflet} from 'react-leaflet';

const DEFAULT_RESOLUTION = 128;

class CogLayer extends MapLayer {
	createLeafletElement(props) {
		const {georaster, paneName, options} = props;

		return new GeoRasterLayer({
			georaster,
			pane: paneName,
			resolution: options.resolution || DEFAULT_RESOLUTION,
			pixelValuesToColorFn: this.getStyle.bind(this),
		});
	}

	updateLeafletElement(fromProps, toProps) {
		super.updateLeafletElement(fromProps, toProps);
	}

	getStyle(pixelValues) {
		// TODO multiple bands
		const pixelValue = pixelValues[0]; // there's just one band in this raster

		// if there's zero wind, don't return a color
		if (pixelValue === 0) return null;

		// TODO scales, values, intervals
		return '#000000';
	}
}

export default withLeaflet(CogLayer);
