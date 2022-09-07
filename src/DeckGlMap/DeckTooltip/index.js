import PropTypes from 'prop-types';
import {createElement, useRef} from 'react';
import {getTootlipPosition} from '@gisatcz/ptr-core';
import './style.scss';

const MARGIN = 10;

const DeckTooltip = ({
	Tooltip,
	data,
	renderLeft,
	height,
	width,
	mapWidth,
	mapHeight,
}) => {
	const tooltipElement = useRef();
	const tooltipElementData = tooltipElement?.current;
	const {x, y} = data;

	// Get width from element if not passed as a prop
	if (tooltipElementData && !width) {
		width = tooltipElementData?.clientWidth;
	}

	// Get height from element if not passed as a prop
	if (tooltipElementData && !height) {
		height = tooltipElementData?.clientHeight;
	}

	const getTooltipStyle = () => {
		return getTootlipPosition(
			'corner',
			renderLeft
				? ['left', 'right', 'top', 'bottom']
				: ['right', 'left', 'top', 'bottom'],
			[0, mapWidth, mapHeight, 0],
			MARGIN
		);
	};

	const {top, left} = getTooltipStyle()(x, y, width, height);

	return (
		<div
			className="ptr-DeckTooltip"
			style={{left, top, width}}
			ref={tooltipElement}
		>
			{createElement(Tooltip, {...data})}
		</div>
	);
};

DeckTooltip.propTypes = {
	data: PropTypes.object,
	mapWidth: PropTypes.number,
	mapHeight: PropTypes.number,
	height: PropTypes.number,
	width: PropTypes.number,
	renderLeft: PropTypes.bool,
	renderTop: PropTypes.bool,
	Tooltip: PropTypes.func,
};

export default DeckTooltip;
