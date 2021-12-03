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
 * @returns {{layers: (*|string), format: (String|string), opacity: (*|number), transparent: boolean}}
 */
const getFinalParams = params => {
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
		transparent: true,
		format: imageFormat,
		...restParameters,
	};
};

const WmsLayer = ({layerKey, options, crs}) => {
	const {params, singleTile} = options;
	const finalParams = useMemo(() => getFinalParams(params), [params]);
	const finalCrs = crs || params?.crs;

	if (singleTile) {
		return (
			<SingleTileLayer
				key={layerKey || i}
				url={options.url}
				crs={finalCrs ? projectionHelpers.getCRS(finalCrs) : null}
				params={finalParams}
			/>
		);
	} else {
		return (
			<WMSTileLayer
				key={layerKey || i}
				url={options.url}
				crs={finalCrs ? projectionHelpers.getCRS(finalCrs) : null}
				params={finalParams}
			/>
		);
	}
};

WmsLayer.propTypes = {
	layerKey: PropTypes.string,
	options: PropTypes.object,
};

export default WmsLayer;
