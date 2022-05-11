// eslint-disable-next-line no-unused-vars
import React, {useMemo} from 'react';
import PropTypes from 'prop-types';
import {mapConstants} from '@gisatcz/ptr-core';

import './style.scss';

const DEFAULT_MAX_WIDTH = 150;
const OPTIMAL_LAT = mapConstants.averageLatitude;

/**
 * @param view {Object} Panther map view
 * @param mapHeight {number} map component height in pixels
 * @param mapWidth {number} map component width in pixels
 * @param maxWidth {number} scale width in pixels
 * @returns {[number, string]} width of scale, label
 */
const getScaleOptions = (view, mapHeight, mapWidth, maxWidth) => {
	const onePxInMeters =
		getAdjustedBoxRangeForCenter(view) / Math.min(mapHeight, mapWidth);
	const maxScaleWidthInMeters = maxWidth * onePxInMeters;
	const valueForScaleInMeters = getValueForScaleInMeters(maxScaleWidthInMeters);
	const scaleWidth = maxWidth * (valueForScaleInMeters / maxScaleWidthInMeters);
	const label = getFormattedLabel(valueForScaleInMeters);

	return [scaleWidth, label];
};

const MapScale = ({view, mapWidth, mapHeight, maxWidth, className}) => {
	const maxScaleWidth = maxWidth || DEFAULT_MAX_WIDTH;

	if (view && mapWidth && mapHeight) {
		const classes = `ptr-MapScale ${className}`;
		const [scaleWidth, label] = useMemo(
			() => getScaleOptions(view, mapHeight, mapWidth, maxScaleWidth),
			[view, mapHeight, mapWidth, maxScaleWidth]
		);

		return (
			<div className={classes}>
				<div
					className="ptr-MapScale-content"
					style={{width: scaleWidth + 'px'}}
				>
					<span>{label}</span>
				</div>
			</div>
		);
	} else {
		return null;
	}
};

MapScale.propTypes = {
	view: PropTypes.object,
	mapWidth: PropTypes.number,
	mapHeight: PropTypes.number,
	maxWidth: PropTypes.number,
	className: PropTypes.string,
};

/**
 * Format value for label
 * @param value {number}
 * @returns {string}
 */
function getFormattedLabel(value) {
	if (value < 1000) {
		return `${value} m`;
	} else {
		return `${(value / 1000).toLocaleString()} km`;
	}
}

/**
 * Calculate value in meters suitable for display
 * @param maxScaleWidthInMeters {number}
 * @returns {number}
 */
function getValueForScaleInMeters(maxScaleWidthInMeters) {
	const orderOfMagnitude = getOrderOfMagnitude(maxScaleWidthInMeters);
	const coeff = Math.pow(10, orderOfMagnitude);
	const normalizedValue = maxScaleWidthInMeters / coeff;

	if (normalizedValue < 2) {
		return coeff;
	} else if (normalizedValue < 3) {
		return 2 * coeff;
	} else if (normalizedValue < 5) {
		return 3 * coeff;
	} else {
		return 5 * coeff;
	}
}

/**
 * Currently, boxRange is optimized for optimal latitude. This function returns boxRange adjusted for current map center latitude
 * @param view {Object}
 * @returns {number} adjusted box range in meters
 */
function getAdjustedBoxRangeForCenter(view) {
	const {boxRange, center} = view;
	return (
		boxRange *
		(Math.cos((Math.PI * center.lat) / 180) /
			Math.cos((Math.PI * OPTIMAL_LAT) / 180))
	);
}

/**
 * https://en.wikipedia.org/wiki/Order_of_magnitude
 * @param number {number}
 * @returns {number} Number of magnitude
 */
function getOrderOfMagnitude(number) {
	return Math.floor(Math.log(number) / Math.LN10 + 0.000000001);
}

export default MapScale;
