import React, {useMemo} from 'react';
import {WMSTileLayer} from 'react-leaflet';
import PropTypes from 'prop-types';
import projectionHelpers from '../../helpers/projection';
import SingleTileLayer from './SingleTileLayer';
const reservedWmsParamsKeys = [
	'layers',
	'crs',
	'imageFormat',
	'pane',
	'maxZoom',
	'styles',
];

/**
 * Get final parameters for WMSTileLayer
 * @param params {Object} Panther WMS layer definition options.params
 * @param opacity {number} layer opacity
 * @returns {{layers: (*|string), format: (String|string), opacity: (*|number), transparent: boolean}}
 */
const getFinalParams = (params, opacity) => {
	const layers = params?.layers || '';
	const imageFormat = params?.imageFormat || 'image/png';
	const restParameters =
		(params &&
			Object.entries(params).reduce((acc, [key, value]) => {
				if (reservedWmsParamsKeys.includes(key)) {
					return acc;
				} else {
					acc[key] = value;
					return acc;
				}
			}, {})) ||
		{};

	return {
		layers: layers,
		opacity: opacity >= 0 ? opacity : 1,
		transparent: true,
		format: imageFormat,
		...restParameters,
	};
};

const WmsLayer = ({layerKey, options, opacity, crs}) => {
	const {params} = options;
	const finalParams = useMemo(
		() => getFinalParams(params, opacity),
		[params, opacity]
	);

	if (options.singleTile) {
		return (
			<SingleTileLayer
				key={layerKey || i}
				url={options.url}
				crs={crs ? projectionHelpers.getCRS(crs) : null}
				params={finalParams}
			/>
		);
	} else {
		return (
			<WMSTileLayer
				key={layerKey || i}
				url={options.url}
				crs={crs ? projectionHelpers.getCRS(crs) : null}
				params={finalParams}
			/>
		);
	}
};

WmsLayer.propTypes = {
	layerKey: PropTypes.string,
	options: PropTypes.object,
	opacity: PropTypes.number,
};

export default WmsLayer;
