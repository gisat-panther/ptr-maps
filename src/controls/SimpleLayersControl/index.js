import React, {useRef, useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import {Icon, Button} from '@gisatcz/ptr-atoms';

import './style.scss';
import images from './images';

const SimpleLayersControl = ({
								 onSelect,
								 layers,
								 right,
								 layerTemplates,
								 activeLayerTemplateKey,
								 onMount,
							 }) => {
	const wrapperEl = useRef(null);
	const [isOpen, setIsOpen] = useState(false);
	useEffect(() => {
		if (typeof onMount === 'function') {
			onMount(layerTemplates?.map(lt => lt.key));
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

		if (layers) {
			const grid = getGrid(layers.length);

			const menuClasses = classnames('ptr-simple-layers-control-menu', {
				open: isOpen,
				right,
				left: !right,
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
						{layers.map(layer =>
							renderTile(layer, tileWidth, tileHeight, tileMargin)
						)}
					</div>
				</div>
			);
		} else {
			return null;
		}
	};

	const renderTile = (layer, width, height, margin) => {
		const layerTemplate = layerTemplates.find(lt => lt.key === layer.key);
		const active = layer.key === activeLayerTemplateKey;

		const classes = classnames('ptr-simple-layers-control-tile', {
			active,
		});

		const style = {
			width: `${width}rem`,
			height: `${height}rem`,
			margin: `${margin}rem`,
		};
		const previewParam = {};
		if (layerTemplate?.thumbnail) {
			previewParam['src'] = layerTemplate.thumbnail in images? images[layerTemplate.thumbnail] : images.noPreview;
			previewParam['alt'] = layerTemplate.thumbnail;
		}

		return (
			<div
				key={layer.key}
				style={style}
				className={classes}
				onClick={() => onLayerTileClick(layer.key)}
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
				<div className="ptr-simple-layers-control-tile-name">
					{layer.data.nameDisplay}
				</div>
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

	return (
		<div className={buttonClasses} ref={wrapperEl}>
			<Button onClick={onControlButtonClick}>
				<Icon icon="layers" />
			</Button>
			{renderMenu()}
		</div>
	);
};

SimpleLayersControl.prototype = {
	activeLayerTemplateKey: PropTypes.string,
	layerTemplates: PropTypes.array,
	layers: PropTypes.array,
	onSelect: PropTypes.func,
	onMount: PropTypes.func,
	right: PropTypes.bool,
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
