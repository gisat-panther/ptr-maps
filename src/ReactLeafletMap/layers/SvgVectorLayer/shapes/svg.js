import {createElement} from 'react';
import PropTypes from 'prop-types';

const Svg = ({outlineWidth, className, style, children, ...rest}) => {
	let svgSize = 32;
	let offset = 0;

	if (outlineWidth) {
		svgSize += outlineWidth;
		offset = outlineWidth / 2;
	}

	return (
		<svg
			version="1.1"
			xmlns="http://www.w3.org/2000/svg"
			xmlnsXlink="http://www.w3.org/1999/xlink"
			x="0px"
			y="0px"
			width={svgSize + 'px'}
			height={svgSize + 'px'}
			viewBox={`0 0 ${svgSize} ${svgSize}`}
			xmlSpace="preserve"
			className={`ptr-map-shape ${className || ''}`}
			style={style}
		>
			{createElement(children, {
				...rest,
				offset,
				outlineWidth,
				className,
				style,
			})}
		</svg>
	);
};

Svg.propTypes = {
	children: PropTypes.elementType,
	className: PropTypes.string,
	outlineWidth: PropTypes.number,
	style: PropTypes.object,
};

export default Svg;
