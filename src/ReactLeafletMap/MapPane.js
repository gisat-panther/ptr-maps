// eslint-disable-next-line no-unused-vars
import React, {useEffect, useRef} from 'react';
import PropTypes from 'prop-types';
import {Pane} from 'react-leaflet';

const MapPane = ({children, name, zIndex, map, opacity}) => {
	const paneRef = useRef(null);

	useEffect(() => {
		if (map) {
			let pane = map.getPane(name);
			if (pane) {
				pane.style.zIndex = zIndex;
				if (opacity || opacity === 0) {
					pane.style.opacity = opacity;
				}
			}
		}
	}, [map, zIndex, opacity]);

	return (
		<Pane forwardRef={paneRef} name={name} style={{zIndex}}>
			{children}
		</Pane>
	);
};

MapPane.propTypes = {
	children: PropTypes.node,
	map: PropTypes.object,
	name: PropTypes.string,
	opacity: PropTypes.number,
	zIndex: PropTypes.number,
};

export default MapPane;
