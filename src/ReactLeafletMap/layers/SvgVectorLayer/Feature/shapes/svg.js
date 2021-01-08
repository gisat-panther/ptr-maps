import React from 'react';

export default (props) => {
	let svgSize = 32;
	let offset = 0;

	if (props.outlineWidth) {
		svgSize += props.outlineWidth;
		offset = props.outlineWidth/2;
	}

	return (
		<svg
			version="1.1"
			xmlns="http://www.w3.org/2000/svg"
			xmlnsXlink="http://www.w3.org/1999/xlink"
			x="0px"
			y="0px"
			width={svgSize + "px"}
			height={svgSize + "px"}
			viewBox={`0 0 ${svgSize} ${svgSize}`}
			xmlSpace="preserve"
			className={`ptr-map-shape ${props.className || ''}`}
			style={props.style}
		>
			{React.createElement(props.children, {...props, offset})}
		</svg>
	);
};