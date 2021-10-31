import React, {useCallback} from 'react';
import PropTypes from 'prop-types';
import {useResizeDetector} from 'react-resize-detector';
import viewport from '../utils/viewport';

import ReactLeafletMap from './ReactLeafletMap';

import './style.scss';

const ReactLeafletMapWrapper = props => {
	const onResize = useCallback((width, height) => {
		if (props.onResize && width && height) {
			props.onResize(
				viewport.roundDimension(width),
				viewport.roundDimension(height)
			);
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
					onWrapperResize={onResize}
				/>
			) : null}
		</div>
	);
};

ReactLeafletMapWrapper.propTypes = {
	onResize: PropTypes.func,
};

export default ReactLeafletMapWrapper;
