import React, {useCallback} from 'react';
import PropTypes from 'prop-types';
import {useResizeDetector} from 'react-resize-detector';
import viewport from '../utils/viewport';

import ReactLeafletMap from './ReactLeafletMap';

import './style.scss';

const ReactLeafletMapWrapper = props => {
	const onResize = useCallback((width, height) => {
		if (props.onResize && width && height) {
			// postpone onResize call due to React issue (Cannot update during an existing state transition)
			setTimeout(() => {
				props.onResize(
					viewport.roundDimension(width),
					viewport.roundDimension(height)
				);
			}, 10);
		}
	}, []);

	const {width, height, ref} = useResizeDetector({
		refreshMode: 'debounce',
		refreshRate: 500,
		onResize,
	});

	return (
		<div className="ptr-ReactLeafletMap-wrapper" ref={ref}>
			{width && height ? (
				<ReactLeafletMap
					{...props}
					width={viewport.roundDimension(width)}
					height={viewport.roundDimension(height)}
				/>
			) : null}
		</div>
	);
};

ReactLeafletMapWrapper.propTypes = {
	onResize: PropTypes.func,
};

export default ReactLeafletMapWrapper;
