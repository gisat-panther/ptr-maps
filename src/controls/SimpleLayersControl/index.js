import {useRef, useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import {Icon, Button} from '@gisatcz/ptr-atoms';

import './style.scss';
import images from './images';

const SimpleLayersControl = ({
	onSelect,
	opensRight,
	opensBottom,
	left,
	top,
	right,
	bottom,
	layerTemplates,
	activeLayerTemplateKey,
	onMount,
}) => {
	const wrapperEl = useRef(null);
	const [isOpen, setIsOpen] = useState(false);
	useEffect(() => {
		if (typeof onMount === 'function') {
			onMount();
		}
	}, []);

	const close = () => {
		setIsOpen(false);
	};

	const open = () => {
		setIsOpen(true);
	};

	const handleClickOutside = () => {
		if (isOpen) {
			close();
		}
	};
	useOnClickOutside(wrapperEl, handleClickOutside);

	const onControlButtonClick = () => {
		if (isOpen) {
			close();
		} else {
			open();
		}
	};

	const onLayerTileClick = key => {
		if (onSelect) {
			onSelect(key);
		}
	};

	const renderMenu = () => {
		const tileWidth = 7;
		const tileHeight = 5;
		const tileMargin = 0.25;
		const contentMargin = 1;

		if (layerTemplates) {
			const grid = getGrid(layerTemplates.length);

			const menuClasses = classnames('ptr-simple-layers-control-menu', {
				open: isOpen,
				right: opensRight,
				left: !opensRight,
				bottom: opensBottom,
			});

			const menuStyle = {
				width: isOpen
					? `${
							(tileWidth + 2 * tileMargin) * grid.width + 2 * contentMargin
					  }rem`
					: 0,
				height: isOpen
					? `${
							(tileHeight + 2 * tileMargin) * grid.height + 2 * contentMargin
					  }rem`
					: '2rem',
			};

			const contentStyle = {
				margin: `${contentMargin}rem`,
				width: `calc(100% - ${2 * contentMargin}rem)`,
				height: `calc(100% - ${2 * contentMargin}rem)`,
			};

			return (
				<div className={menuClasses} style={menuStyle}>
					<div
						className="ptr-simple-layers-control-menu-content"
						style={contentStyle}
					>
						{layerTemplates.map(layerTemplate =>
							renderTile(layerTemplate, tileWidth, tileHeight, tileMargin)
						)}
					</div>
				</div>
			);
		} else {
			return null;
		}
	};

	const renderTile = (layerTemplate, width, height, margin) => {
		const active = layerTemplate.key === activeLayerTemplateKey;

		const classes = classnames('ptr-simple-layers-control-tile', {
			active,
		});

		const style = {
			width: `${width}rem`,
			height: `${height}rem`,
			margin: `${margin}rem`,
		};
		let previewParam = {};
		if (
			layerTemplate?.data?.thumbnail &&
			Object.hasOwn(images, layerTemplate.data.thumbnail)
		) {
			const image = images[layerTemplate.data.thumbnail];
			if (typeof image === 'object') {
				previewParam['src'] = images[layerTemplate.data.thumbnail].default;
			} else {
				previewParam['src'] = images[layerTemplate.data.thumbnail];
			}
			previewParam['alt'] = layerTemplate.data.thumbnail;
		} else {
			previewParam['src'] = images.noPreview;
			previewParam['alt'] = 'thumbnail';
		}

		return (
			<div
				key={layerTemplate.key}
				style={style}
				className={classes}
				onClick={() => onLayerTileClick(layerTemplate.key)}
			>
				<img
					className="ptr-simple-layers-control-tile-preview"
					src={previewParam.src}
					alt={previewParam.alt}
					style={{
						height: `${height - 1.5}rem`,
						margin: `0 ${margin}rem 0 ${margin}rem`,
					}}
				/>
				<label
					className="ptr-simple-layers-control-tile-name"
					title={layerTemplate.data.nameDisplay}
				>
					{layerTemplate.data.nameDisplay}
				</label>
			</div>
		);
	};

	const getGrid = count => {
		let width = 1;
		let height = 1;

		// TODO solve 9+ cases
		if (count >= 7) {
			width = 3;
			height = 3;
		} else if (count >= 5) {
			width = 2;
			height = 3;
		} else if (count === 4) {
			width = 2;
			height = 2;
		} else if (count === 3) {
			height = 3;
		} else if (count === 2) {
			height = 2;
		}

		return {width, height};
	};

	const buttonClasses = classnames('ptr-simple-layers-control control', {
		open: isOpen,
	});

	const style = {
		left: `${left ? `${left}rem` : undefined}`,
		top: `${top ? `${top}rem` : undefined}`,
		right: `${right ? right : 0.5}rem`,
		bottom: `${bottom ? bottom : 4.5}rem`,
	};

	return (
		<div className={buttonClasses} ref={wrapperEl} style={style}>
			<Button onClick={onControlButtonClick}>
				<Icon icon="layers" />
			</Button>
			{renderMenu()}
		</div>
	);
};

SimpleLayersControl.propTypes = {
	activeLayerTemplateKey: PropTypes.string,
	layerTemplates: PropTypes.array,
	onSelect: PropTypes.func,
	onMount: PropTypes.func,
	opensBottom: PropTypes.bool,
	opensRight: PropTypes.bool,
	left: PropTypes.number,
	top: PropTypes.number,
	right: PropTypes.number,
	bottom: PropTypes.number,
};

export default SimpleLayersControl;

// Hook
function useOnClickOutside(ref, handler) {
	useEffect(
		() => {
			const listener = event => {
				// Do nothing if clicking ref's element or descendent elements
				if (!ref.current || ref.current.contains(event.target)) {
					return;
				}
				handler(event);
			};
			document.addEventListener('mousedown', listener);
			document.addEventListener('touchstart', listener);
			return () => {
				document.removeEventListener('mousedown', listener);
				document.removeEventListener('touchstart', listener);
			};
		},
		// Add ref and handler to effect dependencies
		// It's worth noting that because passed in handler is a new ...
		// ... function on every render that will cause this effect ...
		// ... callback/cleanup to run every render. It's not a big deal ...
		// ... but to optimize you can wrap handler in useCallback before ...
		// ... passing it into this hook.
		[ref, handler]
	);
}
