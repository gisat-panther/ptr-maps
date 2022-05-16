// eslint-disable-next-line no-unused-vars
import React, {createElement} from 'react';
import PropTypes from 'prop-types';
import svg from './svg';

const CrossChild = ({offset}) => {
	return (
		<g transform={`translate(${offset} ${offset})`}>
			<path vectorEffect="non-scaling-stroke" d="M 1,1 31,31" />
			<path vectorEffect="non-scaling-stroke" d="M 1,31 31,1" />
		</g>
	);
};

CrossChild.propTypes = {
	offset: PropTypes.number,
};

const Cross = props => createElement(svg, props, CrossChild);

export default Cross;
