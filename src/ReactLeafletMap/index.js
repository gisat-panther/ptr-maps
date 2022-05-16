// eslint-disable-next-line no-unused-vars
import React, {useCallback, useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import {useResizeDetector} from 'react-resize-detector';
import viewport from '../utils/viewport';

import ReactLeafletMap from './ReactLeafletMap';

import './style.scss';

const ReactLeafletMapWrapper = ({
	onResize,
	onViewChange,
	view,
	...restProps
}) => {
	const [mapView, setMapView] = useState(view);
	const onMapResize = useCallback((width, height) => {
		if (onResize && width && height) {
			// postpone onResize call due to React issue (Cannot update during an existing state transition)
			setTimeout(() => {
				onResize(
					viewport.roundDimension(width),
					viewport.roundDimension(height)
				);
			}, 10);
		}
	}, []);

	const {width, height, ref} = useResizeDetector({
		refreshMode: 'debounce',
		refreshRate: 500,
		onResize: onMapResize,
	});

	const onMapViewChange = useCallback(
		viewUpdate => {
			if (onViewChange) {
				onViewChange(viewUpdate);
			}

			setMapView({...view, ...viewUpdate});
		},
		[onViewChange, view]
	);

	useEffect(() => {
		if (view) {
			setMapView({...mapView, ...view});
		}
	}, [view]);

	return (
		<div className="ptr-ReactLeafletMap-wrapper" ref={ref}>
			{width && height ? (
				<ReactLeafletMap
					{...restProps}
					width={viewport.roundDimension(width)}
					height={viewport.roundDimension(height)}
					onViewChange={onMapViewChange}
					view={mapView}
				/>
			) : null}
		</div>
	);
};

ReactLeafletMapWrapper.propTypes = {
	onResize: PropTypes.func,
	onViewChange: PropTypes.func,
	view: PropTypes.object,
};

export default ReactLeafletMapWrapper;
