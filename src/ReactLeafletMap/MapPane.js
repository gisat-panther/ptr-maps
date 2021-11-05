import React, {useEffect, useRef} from 'react';
import PropTypes from 'prop-types';
import {Pane} from 'react-leaflet';

const MapPane = ({children, name, zIndex, map}) => {
	const paneRef = useRef(null);

	useEffect(() => {
		if (map) {
			let pane = map.getPane(name);
			if (pane) {
				pane.style.zIndex = zIndex;
			}
		}
	}, [map, zIndex]);

	return (
		<Pane ref={paneRef} name={name} style={{zIndex}}>
			{children}
		</Pane>
	);
};

MapPane.propTypes = {
	name: PropTypes.string,
	zIndex: PropTypes.number,
	map: PropTypes.object
}

export default MapPane;
