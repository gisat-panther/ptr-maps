import React from 'react';
import GeoRasterLayer from 'georaster-layer-for-leaflet';
import {MapLayer, withLeaflet} from 'react-leaflet';
import {mapStyle as mapStyleUtils} from '@gisatcz/ptr-utils';

import styleConstants from '../../../constants/styles';

const DEFAULT_RESOLUTION = 128;

class CogLayer extends MapLayer {
	createLeafletElement(props) {
		const {georaster, paneName, options, opacity} = props;

		this.layer = new GeoRasterLayer({
			georaster,
			pane: paneName,
			resolution: options.resolution || DEFAULT_RESOLUTION,
			pixelValuesToColorFn: this.getStyle.bind(this),
			opacity: opacity || 1,
		});

		return this.layer;
	}

	updateLeafletElement(fromProps, toProps) {
		super.updateLeafletElement(fromProps, toProps);

		if (fromProps.options.style !== toProps.options.style) {
			this.layer.updateColors(this.getStyle.bind(this));
		}
	}

	getStyle(pixelValues) {
		const styleDefinition = this.props.options.style;
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
}

export default withLeaflet(CogLayer);
