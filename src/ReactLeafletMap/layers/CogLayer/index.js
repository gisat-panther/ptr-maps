// eslint-disable-next-line no-unused-vars
import React, {useEffect, useRef, useState} from 'react';
import PropTypes from 'prop-types';
import parseGeoRaster from 'georaster';
import {utils} from '@gisatcz/ptr-utils';
import CogLayerComponent from './CogLayer';
import {useMap} from 'react-leaflet';

/**
 * Wrapper is used to load & parse geotiff data and to place layer to the pane for z-positioning
 */
const CogLayerWrapper = ({options, paneName, zIndex, ...rest}) => {
	const map = useMap();
	const {url} = options;
	const urlRef = useRef(url);
	const [georaster, setGeoraster] = useState(null);
	const [key, setKey] = useState(utils.uuid());

	useEffect(() => {
		let pane = map.getPane(paneName);
		if (!pane) {
			pane = map.createPane(paneName);
			pane.style.zIndex = zIndex;
		}

		parseGeoRaster(urlRef.current).then(georaster => {
			setGeoraster(georaster);
		});

		return () => {
			if (paneName) {
				// delete pane and remove them from DOM
				delete map._panes[paneName];
				const elements = document.querySelectorAll(`.leaflet-${paneName}-pane`);
				if (elements.length) {
					elements.forEach(element => element.remove());
				}
			}
		};
	}, []);

	useEffect(() => {
		let pane = map.getPane(paneName);
		pane.style.zIndex = zIndex;
	}, [zIndex]);

	useEffect(() => {
		const {url} = options;
		if (url !== urlRef.current) {
			urlRef.current = url;
			parseGeoRaster(url).then(georaster => {
				setGeoraster(georaster);
				setKey(utils.uuid());
			});
		}
	}, [options]);

	if (georaster) {
		return (
			<CogLayerComponent
				{...{...rest, options, paneName, map, zIndex}}
				georaster={georaster}
				key={key}
			/>
		);
	} else {
		return null;
	}
};

CogLayerWrapper.propTypes = {
	options: PropTypes.shape({
		url: PropTypes.string,
	}),
	paneName: PropTypes.string,
	zIndex: PropTypes.number,
};

export default CogLayerWrapper;
