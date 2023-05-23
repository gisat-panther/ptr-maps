import {
	useEffect,
	useState,
	Children,
	cloneElement,
	createElement,
	useRef,
} from 'react';
import PropTypes from 'prop-types';
import {
	forEach as _forEach,
	isEmpty as _isEmpty,
	mapValues as _mapValues,
	pickBy as _pickBy,
} from 'lodash';

import {map as mapUtils} from '@gisatcz/ptr-utils';

import {mapConstants} from '@gisatcz/ptr-core';
import MapGrid from '../MapGrid';

import './style.scss';
import MapWrapper from '../MapWrapper';
import * as ReactIs from 'react-is';

const Map = () => {
	return null;
};

const PresentationMap = () => {
	return null;
};

const MapSet = ({
	// mapKey,
	onViewChange,
	onZoomEnd,
	onPanEnd,
	connectedMapComponent,
	backgroundLayer,
	layers,
	updateView,
	activeMapKey,
	onMount,
	onUnMount,
	activeMapView,
	activeMapViewport,
	disableMapRemoval = false,
	maps,
	mapComponent,
	view,
	stateMapSetKey,
	sync,
	wrapper,
	wrapperProps = {},
	Tooltip,
	tooltipProps,
	children,
	onMapRemove,
	resetHeading,
	onClick,
}) => {
	const mapsDimensionsRef = useRef({});
	const [mapsDimensions, setMapsDimensions] = useState({});
	const [mapViews, setMapViews] = useState({});
	const [stateActiveMapKey, setStateActiveMapKey] = useState(activeMapKey);
	const [stateView, setStateView] = useState(
		mapUtils.view.mergeViews(mapConstants.defaultMapView, view)
	);

	useEffect(() => {
		const updateMapViews = _mapValues(mapViews, v => {
			return {...v, ...view};
		});
		setMapViews(updateMapViews);
		// TODO sync props to view only?
	}, [view]);

	useEffect(() => {
		if (!stateMapSetKey) {
			const updateMapViews = {};
			_forEach(children, child => {
				if (
					child &&
					typeof child === 'object' &&
					(child.type === Map ||
						child.type === connectedMapComponent ||
						child.type === PresentationMap) &&
					child.props.mapKey === activeMapKey
				) {
					updateMapViews[child.props.mapKey] = mapUtils.view.mergeViews(
						mapConstants.defaultMapView,
						view,
						child.props.view
					);
				}
			});

			if (!_isEmpty(updateMapViews)) {
				setMapViews(updateMapViews);
			}

			if (typeof onMount === 'function') {
				onMount();
			}

			if (typeof onUnMount === 'function') {
				return onUnMount;
			}
		}
	}, []);

	const onViewChangeLocal = (mapKey, update) => {
		let syncUpdate;
		update = mapUtils.view.ensureViewIntegrity(update);
		mapKey = mapKey || stateActiveMapKey;

		if (sync) {
			syncUpdate = _pickBy(update, (updateVal, updateKey) => {
				return sync[updateKey];
			});
			syncUpdate = mapUtils.view.ensureViewIntegrity(syncUpdate);
		}
		// merge views of all maps
		const updateMapViews = _mapValues(mapViews, v => {
			return mapUtils.view.mergeViews(v, syncUpdate);
		});

		// merge views of given map
		updateMapViews[mapKey] = mapUtils.view.mergeViews(mapViews[mapKey], update);
		setMapViews(updateMapViews);

		if (syncUpdate && !_isEmpty(syncUpdate)) {
			const mergedView = mapUtils.view.mergeViews(stateView, syncUpdate);

			setStateView(mergedView);

			if (onViewChange) {
				onViewChange(mergedView);
			}
		}
	};

	const onResetHeading = () => {
		mapUtils.resetHeading(mapViews[stateActiveMapKey].heading, heading =>
			onViewChangeLocal(stateActiveMapKey, {heading})
		);
	};

	/**
	 * Called in uncontrolled map set
	 * @param key
	 * @param view
	 */
	const onMapClick = (key, view) => {
		if (!mapViews[key]) {
			const updateMapViews = {...mapViews};
			updateMapViews[key] = view;
			setMapViews(updateMapViews);
		}
		setStateActiveMapKey(key);
	};

	const onMapResize = (width, height, mapKey) => {
		const updatedMapsDimensions = {
			...mapsDimensionsRef.current,
			[mapKey]: {width, height},
		};

		mapsDimensionsRef.current = updatedMapsDimensions;
		setMapsDimensions(updatedMapsDimensions);
	};

	const renderControls = () => {
		let customUpdateView,
			customResetHeading,
			mergedView,
			mapKey,
			activeMapDimensions;
		if (stateMapSetKey) {
			mergedView = activeMapView || view;
			mapKey = activeMapKey;
			activeMapDimensions = activeMapViewport;
		} else {
			customUpdateView = (update, mkey) => onViewChangeLocal(mkey, update);
			customResetHeading = onResetHeading;
			mergedView = mapUtils.view.mergeViews(
				stateView,
				mapViews[stateActiveMapKey]
			);
			mapKey = stateActiveMapKey;
			activeMapDimensions = mapsDimensions && mapsDimensions[stateActiveMapKey];
		}
		const newChildren = [];
		Children.forEach(children, child => {
			if (
				!(
					typeof child === 'object' &&
					(child.type === Map ||
						child.type === connectedMapComponent ||
						child.type === PresentationMap)
				)
			) {
				newChildren.push(
					cloneElement(child, {
						...child.props,
						view: mergedView,
						updateView: stateMapSetKey ? updateView : customUpdateView,
						resetHeading: customResetHeading || resetHeading,
						mapKey,
						mapWidth: activeMapDimensions && activeMapDimensions.width,
						mapHeight: activeMapDimensions && activeMapDimensions.height,
					})
				);
			}
		});
		return newChildren;
	};
	const renderMap = (mapComponent, props, children, active, renderWrapper) => {
		// TODO custom wrapper component
		if (wrapper) {
			const mergedWrapperProps = {...wrapperProps};
			if (onMapRemove && !disableMapRemoval) {
				mergedWrapperProps['onMapRemove'] = onMapRemove;
			}

			const allProps = {
				...props,
				...mergedWrapperProps,
				wrapper,
				active,
			};
			// Render wrapper here, if mapComponent is final (framework-specific) map component
			if (renderWrapper) {
				const wrapperComponent = ReactIs.isValidElementType(wrapper)
					? wrapper
					: MapWrapper;
				return createElement(
					wrapperComponent,
					allProps,
					createElement(mapComponent, props, children)
				);
			} else {
				return createElement(mapComponent, allProps, children);
			}
		} else {
			return createElement(mapComponent, props, children);
		}
	};

	const renderMaps = () => {
		const mapsToRender = [];

		// For now, render either maps from state, OR from children

		if (stateMapSetKey) {
			// all from state
			if (maps && maps.length) {
				maps.map(mapKey => {
					const props = {
						key: mapKey,
						stateMapKey: mapKey,
						onResize: (w, h) => onMapResize(w, h, mapKey),
						onViewChange: update => onViewChangeLocal(mapKey, update),
						onZoomEnd,
						onPanEnd,
						// onClick: view => onMapClick(mapKey, view),
						onClick,
						wrapperProps,
						onMapRemove,
						Tooltip,
						tooltipProps,
					};
					mapsToRender.push(
						renderMap(
							connectedMapComponent,
							{...props, mapComponent},
							null,
							mapKey === activeMapKey
						)
					);
				});
			}
		} else {
			Children.map(children, (child, index) => {
				const {
					layers: childLayers,
					backgroundLayer: childBackgroundLayer,
					mapKey: childMapKey,
					...restProps
				} = child.props;
				const props = {
					...restProps,
					key: index,
					view: mapUtils.view.mergeViews(
						view,
						stateView,
						mapViews[childMapKey]
					),
					backgroundLayer: childBackgroundLayer || backgroundLayer,
					layers: mapUtils.mergeLayers(layers, childLayers),
					onViewChange: update => onViewChangeLocal(childMapKey, update),
					onZoomEnd,
					onPanEnd,
					onClick: view => onMapClick(childMapKey, view),
					onResize: (w, h) => onMapResize(w, h, childMapKey),
					mapKey: childMapKey,
				};

				if (
					typeof child === 'object' &&
					(child.type === Map || child.type === connectedMapComponent)
				) {
					// layers from state
					mapsToRender.push(
						renderMap(
							connectedMapComponent,
							{...props, mapComponent},
							null,
							childMapKey === stateActiveMapKey
						)
					);
				} else if (
					typeof child === 'object' &&
					child.type === PresentationMap
				) {
					// all presentational
					mapsToRender.push(
						renderMap(
							mapComponent || child.props.mapComponent,
							props,
							child.props.children,
							childMapKey === stateActiveMapKey,
							true
						)
					);
				}
			});
		}

		return <MapGrid>{mapsToRender}</MapGrid>;
	};
	return (
		<div className="ptr-map-set">
			<div className="ptr-map-set-maps">{renderMaps()}</div>
			<div className="ptr-map-set-controls">{renderControls()}</div>
		</div>
	);
};

MapSet.propTypes = {
	activeMapKey: PropTypes.string,
	activeMapView: PropTypes.object,
	activeMapViewport: PropTypes.object,
	backgroundLayer: PropTypes.object,
	children: PropTypes.node,
	connectedMapComponent: PropTypes.elementType,
	mapComponent: PropTypes.elementType,
	disableMapRemoval: PropTypes.bool,
	layers: PropTypes.array,
	mapSetKey: PropTypes.string,
	maps: PropTypes.array,
	onMapRemove: PropTypes.func,
	onMount: PropTypes.func,
	onUnMount: PropTypes.func,
	onViewChange: PropTypes.func,
	onZoomEnd: PropTypes.func,
	onPanEnd: PropTypes.func,
	resetHeading: PropTypes.func,
	stateMapSetKey: PropTypes.string,
	sync: PropTypes.object,
	updateView: PropTypes.func, //don't sure with it. It should enought onViewChange?
	view: PropTypes.object,
	wrapper: PropTypes.oneOfType([PropTypes.elementType, PropTypes.bool]),
	wrapperProps: PropTypes.object,
	Tooltip: PropTypes.elementType,
	tooltipProps: PropTypes.object,
	onClick: PropTypes.func,
};

export const MapSetMap = Map;
export const MapSetPresentationMap = PresentationMap;

export default MapSet;
