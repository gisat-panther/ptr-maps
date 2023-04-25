import {
	useEffect,
	useRef,
	useState,
	createElement,
	cloneElement,
	Children,
} from 'react';
import * as ReactIs from 'react-is';
import PropTypes from 'prop-types';
import {isEqual as _isEqual, isEmpty as _isEmpty} from 'lodash';
import {map as mapUtils} from '@gisatcz/ptr-utils';
import {Error} from '@gisatcz/ptr-atoms';
import {mapConstants} from '@gisatcz/ptr-core';
import MapWrapper from './MapWrapper';

import './style.scss';

const PresentationMap = ({
	onClick,
	active,
	activeSelectionKey,
	backgroundLayer,
	children,
	layers,
	mapComponent,
	onMount,
	onUnmount,
	onPropViewChange,
	onResize,
	onViewChange,
	onZoomEnd,
	onPanEnd,
	onMapRemove,
	resetHeading,
	resources,
	stateMapKey,
	view,
	viewport,
	viewLimits,
	wrapper,
	wrapperProps,
	Tooltip,
	tooltipProps,
	onLayerClick,
	mapKey,
	name,
	crs,
	mapComponentProps,
}) => {
	const [size, setSize] = useState({
		width: null,
		height: null,
	});

	// const [stateView, setStateView] = useState({test: 'aaa'});
	const [stateView, setStateView] = useState();

	useEffect(() => {
		if (!stateMapKey) {
			setStateView({...mapConstants.defaultMapView, ...view});
		}

		if (typeof onUnmount === 'function') {
			return onUnmount;
		}
	}, []);

	const saveViewChange = (view, checkViewEquality) => {
		// if (checkViewEquality && !_isEqual(view, viewRef.current)) {
		viewRef.current = view;
		if (checkViewEquality && !_isEqual(view, stateView)) {
			if (!stateMapKey) {
				setStateView(view);
			}
		}
	};

	const getValidView = update => {
		let validView = {...mapConstants.defaultMapView, ...view};
		if (stateView && !_isEmpty(stateView)) {
			validView = {...stateView, ...update};
		}
		validView = mapUtils.view.ensureViewIntegrity(validView);
		return validView;
	};

	const onViewChangeDecorator = onViewChange => {
		return update => {
			onViewChange(update, size.width, size.height);
		};
	};

	const onViewChangeHandler = stateMapKey
		? onViewChange
		: update => {
				const view = getValidView(update);

				// TODO buble view to map!!!
				saveViewChange(view, true);

				if (!_isEqual(view, stateView)) {
					if (onViewChange && !stateMapKey) {
						onViewChangeDecorator(onViewChange)(view);
					}
				}
		  };

	const onPropViewChangeHandler = view => {
		if (stateMapKey && onPropViewChange) {
			onViewChangeDecorator(onPropViewChange)(view);
		}
	};

	const viewRef = useRef(view);
	useEffect(() => {
		if (view) {
			const validView = getValidView(view);
			if (viewRef.current) {
				if (!_isEqual(validView, viewRef.current)) {
					if (!stateMapKey) {
						saveViewChange(validView, true);
					} else {
						onPropViewChangeHandler(validView);
					}
				}
			} else {
				if (!stateMapKey) {
					saveViewChange(validView, true);
				} else {
					onPropViewChangeHandler(validView);
				}
			}
		}
	}, [view]);

	const resetHeadingHandler = () => {
		mapUtils.resetHeading(stateView.heading, heading =>
			setStateView({...stateView, heading})
		);
	};

	const onResizeHandler = (width, height) => {
		if (onResize) {
			onResize(width, height);
		}
		setSize({width, height});
	};

	const renderContent = (MapComponent, props, children) => {
		//TODO is it correct to create element on each change?
		// const map = createElement(mapComponent, props);

		if (!children) {
			// return map
			return <MapComponent {...props} />;
		} else {
			return (
				<div className="ptr-map-controls-wrapper">
					<MapComponent {...props} />;
					{Children.map(children, child => {
						return cloneElement(child, {
							// FIXME better props definition
							...child.props,
							view: props.view,
							mapKey,
							viewLimits,
							updateView: props.onViewChange,
							active,
							onMapRemove,
							resetHeading: stateMapKey ? resetHeading : resetHeadingHandler,
							mapWidth: stateMapKey ? viewport?.width : size.width,
							mapHeight: stateMapKey ? viewport?.height : size.height,
							name,
							crs,
						});
					})}
				</div>
			);
		}
	};

	if (!mapComponent) {
		return <Error centered>mapComponent not supplied to Map</Error>;
	} else {
		let usedView = view;
		if (!stateMapKey) {
			// onViewChangeHandledLocal = onViewChange;
			// what? whay? is it legal?
			// props.onResize = this.onResize;
			// if (!props.stateMapKey) {
			// 	props.view = this.state.view || props.view;
			// 	props.onViewChange = this.onViewChange;
			// }
			usedView = stateView;
		}
		if (wrapper) {
			// check if passed wrapper is React component or connected component
			const wrapperComponent = ReactIs.isValidElementType(wrapper)
				? wrapper
				: MapWrapper;

			return createElement(
				wrapperComponent,
				{
					// FIXME better props definition
					activeSelectionKey,
					backgroundLayer,
					layers,
					mapComponent,
					onMount,
					onUnmount,
					onPropViewChange: onPropViewChangeHandler,
					resetHeading: stateMapKey ? resetHeading : resetHeadingHandler,
					stateMapKey,
					mapKey,
					viewport,
					viewLimits,
					wrapper,
					Tooltip,
					tooltipProps,
					onResize: onResizeHandler,
					onLayerClick,
					// view: !_isEmpty(stateView) ? stateView : view,
					view: usedView,
					onViewChange: onViewChangeHandler,
					onZoomEnd,
					onPanEnd,
					active,
					onClick,
					onMapRemove,
					name,
					crs,
					...wrapperProps,
				},
				renderContent(
					mapComponent,
					{
						// FIXME better props definition
						activeSelectionKey,
						backgroundLayer,
						children,
						layers,
						mapComponent,
						onMount,
						onUnmount,
						onPropViewChange: onPropViewChangeHandler,
						onResize: onResizeHandler,
						onLayerClick,
						onViewChange: onViewChangeHandler,
						onZoomEnd,
						onPanEnd,
						onClick,
						active,
						onMapRemove,
						resetHeading: stateMapKey ? resetHeading : resetHeadingHandler,
						resources,
						stateMapKey,
						mapKey,
						// view: !_isEmpty(stateView) ? stateView : view,
						view: usedView,
						viewport,
						viewLimits,
						wrapper,
						Tooltip,
						crs,
						...wrapperProps,
						tooltipProps,
						name,
						...(mapComponentProps ? mapComponentProps : {}),
					},
					children
				)
			);
		} else {
			return renderContent(
				mapComponent,
				{
					// FIXME better props definition
					activeSelectionKey,
					backgroundLayer,
					children,
					layers,
					mapComponent,
					onMount,
					onUnmount,
					onPropViewChange: onPropViewChangeHandler,
					onResize: onResizeHandler,
					onLayerClick,
					onViewChange: onViewChangeHandler,
					onZoomEnd,
					onPanEnd,
					active,
					onMapRemove,
					onClick,
					resetHeading: stateMapKey ? resetHeading : resetHeadingHandler,
					resources,
					stateMapKey,
					mapKey,
					// view: !_isEmpty(stateView) ? stateView : view,
					view: usedView,
					viewport,
					viewLimits,
					wrapper,
					Tooltip,
					wrapperProps,
					tooltipProps,
					name,
					crs,
					...(mapComponentProps ? mapComponentProps : {}),
				},
				children
			);
		}
	}
};

PresentationMap.propTypes = {
	mapKey: PropTypes.string,
	active: PropTypes.bool,
	activeSelectionKey: PropTypes.bool,
	name: PropTypes.string,
	backgroundLayer: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
	children: PropTypes.oneOfType([PropTypes.element, PropTypes.array]),
	layers: PropTypes.array,
	mapComponent: PropTypes.oneOfType([PropTypes.element, PropTypes.func]),
	onMount: PropTypes.func,
	onUnmount: PropTypes.func,
	onMapRemove: PropTypes.func,
	onLayerClick: PropTypes.func,
	onPropViewChange: PropTypes.func,
	onResize: PropTypes.func,
	onViewChange: PropTypes.func,
	onZoomEnd: PropTypes.func,
	onPanEnd: PropTypes.func,
	onClick: PropTypes.func,
	resetHeading: PropTypes.func,
	resources: PropTypes.object,
	stateMapKey: PropTypes.string,
	view: PropTypes.object,
	viewport: PropTypes.object,
	viewLimits: PropTypes.object,
	wrapper: PropTypes.oneOfType([
		PropTypes.elementType,
		PropTypes.element,
		PropTypes.bool,
	]),
	wrapperProps: PropTypes.object,
	Tooltip: PropTypes.elementType,
	tooltipProps: PropTypes.object,
	crs: PropTypes.string,
	mapComponentProps: PropTypes.object,
};

export default PresentationMap;
