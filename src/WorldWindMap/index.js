import {useCallback, useContext, useEffect, useRef, useState} from 'react';
import PropTypes from 'prop-types';
import {isArray as _isArray, isEmpty as _isEmpty} from 'lodash';
import {CyclicPickController, utils, map as mapUtils} from '@gisatcz/ptr-utils';

import WorldWind from 'webworldwind-esa';
import decorateWorldWindowController from './controllers/WorldWindowControllerDecorator';
import layersHelpers from './layers/helpers';
import navigator from './navigator/helpers';

import './style.scss';

import LargeDataLayer from './layers/LargeDataLayerSource/LargeDataLayer';

import VectorLayer from './layers/VectorLayer';

import {mapConstants} from '@gisatcz/ptr-core';
import Context from '@gisatcz/cross-package-react-context';
import {useResizeDetector} from 'react-resize-detector';
import viewport from '../utils/viewport';
const HoverContext = Context.getContext('HoverContext');
const {WorldWindow, ElevationModel} = WorldWind;

const WorldWindMap = ({
	elevationModel = null,
	viewLimits,
	levelsBased,
	view,
	onViewChange,
	delayedWorldWindNavigatorSync,
	onLayerClick,
	mapKey,
	backgroundLayer,
	layers,
	pointAsMarker,
	onClick,
	onResize,
}) => {
	// const viewRef = useRef(view);
	const hoverContext = useContext(HoverContext);
	const [previousHoveredItemsString, setPreviousHoveredItemsString] =
		useState();
	const wwd = useRef(null);
	const [size, setSize] = useState({
		width: null,
		height: null,
	});
	const [canvasId] = useState(utils.uuid());

	const [onZoomLevelsBasedTimeout, setOnZoomLevelsBasedTimeout] =
		useState(null);
	const [onZoomLevelsBasedStep, setOnZoomLevelsBasedStep] = useState(0);
	const [changedNavigatorTimeout, setChangedNavigatorTimeout] = useState();

	/**
	 * @returns {null | elevation}
	 */
	const getElevationModel = () => {
		let elevation = null;
		switch (elevationModel) {
			case 'default':
				return null;
			case null:
				elevation = new ElevationModel();
				elevation.removeAllCoverages();
				return elevation;
		}
	};

	const getSize = sizeArg => {
		const usedSize = sizeArg || size;
		const viewport = wwd.current.viewport;
		const width = usedSize.width || viewport.width;
		const height = usedSize.height || viewport.height;
		return {
			width,
			height,
		};
	};

	const onNavigatorChange = evt => {
		if (evt) {
			const usedSize = getSize();
			const viewParams = navigator.getViewParamsFromWorldWindNavigator(
				evt,
				usedSize.width,
				usedSize.height
			);
			const changedViewParams = navigator.getChangedViewParams(
				{...mapConstants.defaultMapView, ...view},
				viewParams
			);
			if (onViewChange) {
				if (!_isEmpty(changedViewParams)) {
					if (delayedWorldWindNavigatorSync) {
						if (changedNavigatorTimeout) {
							clearTimeout(changedNavigatorTimeout);
						}
						setChangedNavigatorTimeout(
							setTimeout(() => {
								onViewChange(changedViewParams);
							}, delayedWorldWindNavigatorSync)
						);
					} else {
						onViewChange(changedViewParams);
					}
				}
			}
		}
	};

	const onZoomLevelsBased = e => {
		e.preventDefault();

		if (e.wheelDelta) {
			setOnZoomLevelsBasedStep(onZoomLevelsBasedStep + e.wheelDelta);

			if (onZoomLevelsBasedTimeout) {
				clearTimeout(onZoomLevelsBasedTimeout);
			}

			setOnZoomLevelsBasedTimeout(
				setTimeout(() => {
					let zoomLevel = mapUtils.view.getZoomLevelFromBoxRange(
						view.boxRange,
						size.width,
						size.height
					);

					if (onZoomLevelsBasedStep > 300) {
						zoomLevel += 3;
					} else if (onZoomLevelsBasedStep > 150) {
						zoomLevel += 2;
					} else if (onZoomLevelsBasedStep > 0) {
						zoomLevel++;
					} else if (onZoomLevelsBasedStep < -300) {
						zoomLevel -= 3;
					} else if (onZoomLevelsBasedStep < -150) {
						zoomLevel -= 2;
					} else {
						zoomLevel--;
					}

					let levelsRange = mapConstants.defaultLevelsRange;
					const boxRangeRange = viewLimits && viewLimits.boxRangeRange;
					const maxLevel =
						boxRangeRange && boxRangeRange[0]
							? mapUtils.view.getZoomLevelFromBoxRange(
									boxRangeRange[0],
									size.width,
									size.height
							  )
							: levelsRange[1];
					const minLevel =
						boxRangeRange && boxRangeRange[1]
							? mapUtils.view.getZoomLevelFromBoxRange(
									boxRangeRange[1],
									size.width,
									size.height
							  )
							: levelsRange[0];

					levelsRange = [minLevel, maxLevel];

					let finalZoomLevel = zoomLevel;
					if (finalZoomLevel > levelsRange[1]) {
						finalZoomLevel = levelsRange[1];
					} else if (finalZoomLevel < levelsRange[0]) {
						finalZoomLevel = levelsRange[0];
					}

					const boxRange = mapUtils.view.getBoxRangeFromZoomLevel(
						finalZoomLevel,
						size.width,
						size.height
					);
					if (onViewChange) {
						onViewChange({
							boxRange,
						});
					}

					setOnZoomLevelsBasedTimeout(null);
					setOnZoomLevelsBasedStep(0);
				}, 50)
			);
		}
	};

	const onLayerClickHandler = (layerKey, featureKeys) => {
		if (onLayerClick) {
			onLayerClick(mapKey, layerKey, featureKeys);
		}
	};

	const onLayerHover = (
		layerKey,
		featureKeys,
		x,
		y,
		popupContent,
		data,
		fidColumnName
	) => {
		// pass data to popup
		if (hoverContext && hoverContext.onHover && featureKeys.length) {
			hoverContext.onHover(featureKeys, {
				popup: {
					x,
					y,
					content: popupContent,
					data,
					fidColumnName,
				},
			});
		}
	};

	const onWorldWindHover = (renderables, event) => {
		// TODO can be hovered more than one renderable at one time?
		if (renderables.length && renderables.length === 1) {
			// TODO is this enough?
			const layerPantherProps = renderables[0].parentLayer.pantherProps;

			const data = renderables[0].userObject.userProperties;
			const featureKeys = [data[layerPantherProps.fidColumnName]];

			// TODO add support for touch events
			if (event.type === 'mousedown' && layerPantherProps.selectable) {
				onLayerClickHandler(layerPantherProps.layerKey, featureKeys);
			} else if (layerPantherProps.hoverable) {
				onLayerHover(
					layerPantherProps.layerKey,
					featureKeys,
					event.pageX,
					event.pageY,
					<div>{featureKeys.join(',')}</div>,
					data,
					layerPantherProps.fidColumnName
				);
			}
		} else if (hoverContext && hoverContext.onHoverOut) {
			hoverContext.onHoverOut();
		}
	};

	const updateNavigator = (defaultView, sizeArg) => {
		const usedSize = getSize(sizeArg);
		const currentView =
			defaultView ||
			navigator.getViewParamsFromWorldWindNavigator(
				wwd.current.navigator,
				usedSize.width,
				usedSize.height
			);
		const nextView = {...currentView, ...view};
		navigator.update(wwd.current, nextView, usedSize.width, usedSize.height);
	};

	const invalidateLayers = previousLayers => {
		previousLayers.forEach(prevLayer => {
			if (prevLayer instanceof LargeDataLayer) {
				prevLayer.removeListeners();
			}
		});
	};

	const updateLayers = () => {
		let layersUpdate = [];
		if (backgroundLayer) {
			// TODO fix for compatibility
			const backgroundLayers = _isArray(backgroundLayer)
				? backgroundLayer
				: [backgroundLayer];

			backgroundLayers.forEach(layer => {
				layersUpdate.push(layersHelpers.getLayerByType(layer, wwd));
			});
		}

		if (layers) {
			layers.forEach(layer => {
				const mapLayer = layersHelpers.getLayerByType(
					layer,
					wwd,
					onLayerHover,
					onLayerClickHandler,
					pointAsMarker
				);
				layersUpdate.push(mapLayer);
			});
		}

		invalidateLayers(wwd.current.layers);
		wwd.current.layers = layersUpdate;
		wwd.current.redraw();
	};

	const [navigatorEvt, setNavigatorEvt] = useState();

	useEffect(() => {
		onNavigatorChange(navigatorEvt);
	}, [navigatorEvt, setNavigatorEvt]);

	useEffect(() => {
		wwd.current = new WorldWindow(canvasId, getElevationModel());

		decorateWorldWindowController(
			wwd.current.worldWindowController,
			viewLimits,
			levelsBased
		);

		const handleEvent = evt => {
			setNavigatorEvt({
				lookAtLocation: evt.lookAtLocation,
				range: evt.range,
				heading: evt.heading,
				tilt: evt.tilt,
				roll: evt.roll,
			});
		};
		wwd.current.worldWindowController.onNavigatorChanged = handleEvent;

		if (levelsBased) {
			// rewrite default wheel listener.
			wwd.current.eventListeners.wheel.listeners = [onZoomLevelsBased];
		}

		new CyclicPickController(
			wwd.current,
			[
				'mousemove',
				'mousedown',
				'mouseup',
				'mouseout',
				'touchstart',
				'touchmove',
				'touchend',
			],
			onWorldWindHover,
			true
		);
		updateNavigator(mapConstants.defaultMapView);
		updateLayers();
	}, []);

	const updateHoveredFeatures = () => {
		if (wwd.current?.layers) {
			wwd.current.layers.forEach(layer => {
				if (layer instanceof LargeDataLayer) {
					layer.updateHoveredKeys(
						hoverContext.hoveredItems,
						hoverContext.x,
						hoverContext.y
					);
				} else if (layer instanceof VectorLayer) {
					layer.updateHoveredFeatures(hoverContext.hoveredItems);
				}
			});
			wwd.current.redraw();
			setPreviousHoveredItemsString(
				[...hoverContext.hoveredItems].sort().toString()
			);
		}
	};

	if (hoverContext?.hoveredItems) {
		const currentHoveredItemsString = [...hoverContext.hoveredItems]
			.sort()
			.toString();
		if (currentHoveredItemsString !== previousHoveredItemsString) {
			updateHoveredFeatures();
		}
	}

	useEffect(() => {
		updateNavigator();
	}, [view]);

	useEffect(() => {
		updateLayers();
	}, [layers, backgroundLayer]);

	const onClickHandler = () => {
		if (onClick) {
			const {width, height} = wwd.current.viewport;
			let currentView = navigator.getViewParamsFromWorldWindNavigator(
				wwd.current.navigator,
				width,
				height
			);
			onClick(currentView);
		}
	};

	const onMouseOut = () => {
		if (hoverContext && hoverContext.onHoverOut) {
			hoverContext.onHoverOut();
		}
	};

	const onResizeHandler = useCallback(({width, height}) => {
		const roundHeight = viewport.roundDimension(height);
		const roundWidth = viewport.roundDimension(width);
		setSize({
			width: roundWidth,
			height: roundHeight,
		});
		updateNavigator(undefined, {
			width: roundWidth,
			height: roundHeight,
		});
		if (onResize) {
			onResize(roundWidth, roundHeight);
		}
	});

	const {ref: mapRef} = useResizeDetector({
		refreshMode: 'debounce',
		refreshRate: 100,
		onResize: onResizeHandler,
	});

	return (
		<div ref={mapRef} style={{height: '100%', width: '100%'}}>
			<div
				className="ptr-map ptr-world-wind-map"
				onClick={onClickHandler}
				onMouseOut={onMouseOut}
			>
				<canvas className="ptr-world-wind-map-canvas" id={canvasId}>
					Your browser does not support HTML5 Canvas.
				</canvas>
			</div>
		</div>
	);
};

WorldWindMap.propTypes = {
	backgroundLayer: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
	delayedWorldWindNavigatorSync: PropTypes.number,
	elevationModel: PropTypes.string,
	layers: PropTypes.array,
	levelsBased: PropTypes.bool,
	mapKey: PropTypes.string,
	onClick: PropTypes.func,
	onLayerClick: PropTypes.func,
	onResize: PropTypes.func,
	onViewChange: PropTypes.func,
	pointAsMarker: PropTypes.bool,
	view: PropTypes.object,
	viewLimits: PropTypes.object,
};

export default WorldWindMap;
