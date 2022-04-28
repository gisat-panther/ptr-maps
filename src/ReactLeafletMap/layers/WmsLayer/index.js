import React, {useEffect, useRef} from 'react';
import {WMSTileLayer} from 'react-leaflet';
import WMSTileLayerWithFetchedTiles from './WMSTileLayerWithFetchedTiles';
import memoizeOne from 'memoize-one';
import {isEqual as _isEqual} from 'lodash';
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
	const styles = params?.styles;
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
		...(styles ? {styles} : {}),
		...restParameters,
	};
};

const WmsLayer = ({layerKey, options, crs}) => {
	const {params, singleTile, fetchedTile} = options;

	// TODO remove memoization here once it is handled in ptr-state correctly
	const paramsRef = useRef(memoizeOne(getFinalParams, _isEqual));
	const finalParams = paramsRef.current(params);

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
	} else if (fetchedTile) {
		return (
			<WMSTileLayerWithFetchedTiles
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
