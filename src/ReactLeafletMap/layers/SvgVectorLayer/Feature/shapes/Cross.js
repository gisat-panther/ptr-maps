import React from 'react';
import svg from './svg';

const Cross = props => {
	return (
		<g transform={`translate(${props.offset} ${props.offset})`}>
			<path vectorEffect="non-scaling-stroke" d="M 1,1 31,31" />
			<path vectorEffect="non-scaling-stroke" d="M 1,31 31,1" />
		</g>
	);
};

export default props => React.createElement(svg, props, Cross);
