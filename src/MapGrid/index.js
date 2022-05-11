// eslint-disable-next-line no-unused-vars
import React, {useEffect, useRef, useState} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import './style.scss';

const MapGrid = ({children}) => {
	const ref = useRef();
	const [size, setSize] = useState({
		width: null,
		height: null,
	});

	const resize = () => {
		if (ref && ref.current) {
			const width = ref.current.clientWidth;
			const height = ref.current.clientHeight;

			setSize({
				width,
				height,
			});
		}
	};

	useEffect(() => {
		resize();

		if (typeof window !== 'undefined') {
			window.addEventListener('resize', resize, {
				passive: true,
			}); //todo IE
		}
	}, []);

	const renderMaps = () => {
		const availableWidth = size.width;
		const availableHeight = size.height;

		if (children.length && availableWidth && availableHeight) {
			const sizeRatio = availableWidth / availableHeight;
			let rows = 1,
				columns = 1;

			switch (children.length) {
				case 1:
					break;
				case 2:
					if (sizeRatio > 1) {
						columns = 2;
					} else {
						rows = 2;
					}
					break;
				case 3:
					if (sizeRatio > 2) {
						columns = 3;
					} else if (sizeRatio < 0.6666) {
						rows = 3;
					} else {
						columns = 2;
						rows = 2;
					}
					break;
				case 4:
					if (sizeRatio > 3) {
						columns = 4;
					} else if (sizeRatio < 0.5) {
						rows = 4;
					} else {
						columns = 2;
						rows = 2;
					}
					break;
				case 5:
				case 6:
					if (sizeRatio > 1) {
						columns = 3;
						rows = 2;
					} else {
						columns = 2;
						rows = 3;
					}
					break;
				case 7:
				case 8:
					if (sizeRatio > 2) {
						columns = 4;
						rows = 2;
					} else if (sizeRatio < 0.6666) {
						columns = 2;
						rows = 4;
					} else {
						columns = 3;
						rows = 3;
					}
					break;
				case 9:
					if (sizeRatio > 2.5) {
						columns = 5;
						rows = 2;
					} else if (sizeRatio < 0.5) {
						columns = 2;
						rows = 5;
					} else {
						columns = 3;
						rows = 3;
					}
					break;
				default:
					if (sizeRatio > 1) {
						columns = 4;
						rows = 3;
					} else {
						columns = 3;
						rows = 4;
					}
			}

			const width = +(100 / columns).toFixed(4) + '%';
			const height = +(100 / rows).toFixed(4) + '%';

			const style = {width, height};

			return children.map((map, index) => {
				index++;
				const rowNo = Math.ceil(index / columns);
				const colNo = index % columns || columns;

				const wrapperClasses = classNames(
					'ptr-map-grid-cell',
					'row' + rowNo,
					'col' + colNo,
					map.props.wrapperClasses
				);

				return (
					<div
						key={'map-grid-cell-' + index}
						className={wrapperClasses}
						style={style}
					>
						{map}
					</div>
				);
			});
		} else {
			return null;
		}
	};

	return (
		<div className="ptr-map-grid" ref={ref}>
			{renderMaps()}
		</div>
	);
};

MapGrid.propTypes = {
	children: PropTypes.array,
};

export default MapGrid;
