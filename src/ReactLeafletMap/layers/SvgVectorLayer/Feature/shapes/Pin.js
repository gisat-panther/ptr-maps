import React from 'react';
import svg from "./svg";

const Pin = props => {
	return (
		<g transform={`translate(${props.offset} ${props.offset + (props.offset/4)})`}>
			<path vectorEffect="non-scaling-stroke" d="M 27,10.999999 C 26.999936,4.924849 22.075087,0 16,0 9.9249129,0 5.0000636,4.924849 5,10.999999 4.9998451,13.460703 6.2398215,15.834434 8.6666665,18.857143 11.093512,21.879851 13.424935,25.819509 16,32 18.614084,25.725879 20.878951,21.8993 23.333333,18.857143 25.787715,15.814985 26.999857,13.488539 27,10.999999 Z"/>
			<g transform="translate(9 3.5) scale(0.4375 0.4375)">
				{props.icon || null}
			</g>
		</g>
	);
};

export default (props) => React.createElement(svg, props, Pin);