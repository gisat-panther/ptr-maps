import PropTypes from 'prop-types';
import {createElement, useRef, useState, useLayoutEffect} from 'react';
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
	const heightRef = useRef();
	const [tooltipHeight, setTooltipHeight] = useState(0);

	useLayoutEffect(() => {
		heightRef.current = tooltipElement?.current?.offsetHeight;
		if (tooltipElement?.current?.offsetHeight !== tooltipHeight) {
			setTooltipHeight(tooltipElement?.current?.offsetHeight);
		}
	}, [data]);

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

	const style =
		tooltipElement &&
		tooltipElement.offsetWidth !== 0 &&
		tooltipElement.offsetHeight !== 0
			? {...{left, top, width}}
			: {
					...{left, top, width},
					position: 'absolute',
					overfloat: 'auto',
			  };

	if (tooltipElement && !tooltipElement.current) {
		style.display = 'none';
	}

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
