import PropTypes from 'prop-types';
import {createElement, useRef} from 'react';
import './style.scss';

const MARGIN_HORIZONTAL = 5;
const MARGIN_VERTICAL = 5;

const getPosition = (
	x,
	y,
	mapWidth,
	mapHeight,
	tooltipHeight,
	tooltipWidth,
	renderLeft,
	renderTop
) => {
	const fullTooltipWidth = tooltipWidth + MARGIN_HORIZONTAL;
	const fullTooltipHeight = tooltipHeight + MARGIN_VERTICAL;
	let left = x + MARGIN_HORIZONTAL,
		top = y + MARGIN_VERTICAL;

	if (renderLeft) {
		if (left > fullTooltipWidth) {
			left = left - fullTooltipWidth;
		}
	} else {
		if (mapWidth && fullTooltipWidth + left > mapWidth) {
			left = left - fullTooltipWidth;
		}
	}

	if (renderTop) {
		if (top > fullTooltipHeight) {
			top = top - fullTooltipHeight;
		}
	} else {
		if (mapHeight && fullTooltipHeight + top > mapHeight) {
			top = top - fullTooltipHeight;
		}
	}

	return {left, top};
};

const DeckTooltip = ({
	Tooltip,
	data,
	renderLeft,
	renderTop,
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

	const {left, top} = getPosition(
		x,
		y,
		mapWidth,
		mapHeight,
		height,
		width,
		renderLeft,
		renderTop
	);

	const style = {
		left,
		top,
		width,
		height,
	};

	return (
		<div className="ptr-DeckTooltip" style={style} ref={tooltipElement}>
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
