import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import {map as mapUtils} from '@gisatcz/ptr-utils';

import {mapConstants} from '@gisatcz/ptr-core';
import MapGrid from '../MapGrid';

import './style.scss';
import MapWrapper from "../MapWrapper";

class Map extends React.PureComponent {
	render() {
		return null;
	}
}

class PresentationMap extends React.PureComponent {
	render() {
		return null;
	}
}

class MapSet extends React.PureComponent {
	static defaultProps = {
		disableMapRemoval: false
	}

	static propTypes = {
		activeMapKey: PropTypes.string,
		activeMapView: PropTypes.object,
		activeMapViewport: PropTypes.object,
		disableMapRemoval: PropTypes.bool,
		mapSetKey: PropTypes.string,
		maps: PropTypes.array,
		mapComponent: PropTypes.func,
		view: PropTypes.object,
		stateMapSetKey: PropTypes.string,
		sync: PropTypes.object,
		wrapper: PropTypes.oneOfType([
			PropTypes.elementType,
			PropTypes.element,
			PropTypes.bool
		]),
		wrapperProps: PropTypes.object
	};

	constructor(props) {
		super(props);

		if (!props.stateMapSetKey) {
			this.state = {
				view: mapUtils.view.mergeViews(mapConstants.defaultMapView, props.view),

				activeMapKey: props.activeMapKey,
				mapViews: {},
				mapsDimensions: {}
			};

			_.forEach(this.props.children, child => {
				if (child && typeof child === "object"
					&& (child.type === Map || child.type === this.props.connectedMapComponent || child.type === PresentationMap)
					&& child.props.mapKey === props.activeMapKey) {
					this.state.mapViews[child.props.mapKey] = mapUtils.view.mergeViews(mapConstants.defaultMapView, props.view, child.props.view);
				}
			});
		} else {
			this.state = {
				mapsDimensions: {}
			}
		}
	}

	componentDidMount() {
		if (this.props.onMount) {
			this.props.onMount();
		}
	}

	componentWillUnmount() {
		if (this.props.onUnmount) {
			this.props.onUnmount();
		}
	}

	componentDidUpdate(prevProps, prevState, snapshot) {
		const props = this.props;
		if (!props.stateMapSetKey) {
			if (prevProps.view !== props.view) {
				let mapViews = _.mapValues(this.state.mapViews, view => {
					return {...view, ...props.view};
				});

				this.setState({
					// TODO sync props to view only?
					view: {...this.state.view, ...props.view},
					mapViews
				});
			}

			if (
				(props.layers && props.layers !== prevProps.layers)
				|| (props.backgroundLayer && props.backgroundLayer !== prevProps.backgroundLayer)
			) {
				if (props.refreshUse) {
					// props.refreshUse();
				}
			}
		}
	}

	onViewChange(mapKey, update) {
		let syncUpdate;
		update = mapUtils.view.ensureViewIntegrity(update);
		mapKey = mapKey || this.state.activeMapKey;

		if (this.props.sync) {
			syncUpdate = _.pickBy(update, (updateVal, updateKey) => {
				return this.props.sync[updateKey];
			});
			syncUpdate = mapUtils.view.ensureViewIntegrity(syncUpdate);
		}

		// merge views of all maps
		let mapViews = _.mapValues(this.state.mapViews, view => {
			return mapUtils.view.mergeViews(view, syncUpdate);
		});

		// merge views of given map
		mapViews[mapKey] = mapUtils.view.mergeViews(this.state.mapViews[mapKey], update);

		if (syncUpdate && !_.isEmpty(syncUpdate)) {
			const mergedView = mapUtils.view.mergeViews(this.state.view, syncUpdate);

			this.setState({
				view: mergedView,
				mapViews
			});

			if (this.props.onViewChange) {
				this.props.onViewChange(mergedView);
			}
		} else {
			this.setState({
				mapViews
			});
		}
	}

	onResetHeading() {
		mapUtils.resetHeading(
			this.state.mapViews[this.state.activeMapKey].heading,
			(heading) => this.onViewChange(this.state.activeMapKey, {heading})
		);
	}

	/**
	 * Called in uncontrolled map set
	 * @param key
	 * @param view
	 */
	onMapClick(key, view) {
		if (this.state.mapViews[key]) {
			this.setState({activeMapKey: key});
		} else {
			let mapViews = {...this.state.mapViews};
			mapViews[key] = view;

			this.setState({activeMapKey: key, mapViews});
		}
	}

	onMapResize(mapKey, width, height) {
		const mapsDimensions = {
			...this.state.mapsDimensions,
			[mapKey]: {width, height}
		}
		this.setState({mapsDimensions});
	}

	render() {
		return (
			<div className="ptr-map-set">
				<div className="ptr-map-set-maps">
					{this.renderMaps()}
				</div>
				<div className="ptr-map-set-controls">
					{this.renderControls()}
				</div>
			</div>
		);
	}

	renderControls() {
		let updateView, resetHeading, view, mapKey, activeMapDimensions;
		if (this.props.stateMapSetKey) {
			updateView = this.props.updateView;
			resetHeading = this.props.resetHeading;
			view = this.props.activeMapView || this.props.view;
			mapKey = this.props.activeMapKey;
			activeMapDimensions = this.props.activeMapViewport;
		} else {
			updateView = this.onViewChange.bind(this, null);
			resetHeading = this.onResetHeading.bind(this);
			view = mapUtils.view.mergeViews(this.state.view, this.state.mapViews[this.state.activeMapKey]);
			mapKey = this.state.activeMapKey;
			activeMapDimensions = this.state.mapsDimensions && this.state.mapsDimensions[this.state.activeMapKey];
		}


		return React.Children.map(this.props.children, (child) => {
			if (!(typeof child === "object" && child.type === Map)) {
				return React.cloneElement(child, {
					...child.props,
					view,
					updateView,
					resetHeading,
					mapKey,
					mapWidth: activeMapDimensions && activeMapDimensions.width,
					mapHeight: activeMapDimensions && activeMapDimensions.height
				});
			}
		});
	}

	renderMaps() {
		let maps = [];

		// For now, render either maps from state, OR from children

		if (this.props.stateMapSetKey) {
			// all from state
			if (this.props.maps && this.props.maps.length) {
				this.props.maps.map(mapKey => {
					let props = {
						key: mapKey,
						stateMapKey: mapKey,
						onResize: this.onMapResize.bind(this, mapKey)
					};

					maps.push(this.renderMap(this.props.connectedMapComponent, {...props, mapComponent: this.props.mapComponent}, null, mapKey === this.props.activeMapKey));
				});
			}
		} else {
			React.Children.map(this.props.children, (child,index) => {
				let {view, layers, backgroundLayer, mapKey, ...restProps} = child.props;
				let props = {
					...restProps,
					key: index,
					view: mapUtils.view.mergeViews(this.state.view, view, this.state.mapViews[mapKey]),
					backgroundLayer: backgroundLayer || this.props.backgroundLayer,
					layers: mapUtils.mergeLayers(this.props.layers, layers),
					onViewChange: this.onViewChange.bind(this, mapKey),
					onClick: this.onMapClick.bind(this, mapKey),
					onResize: this.onMapResize.bind(this, mapKey),
					mapKey
				};

				if (typeof child === "object" && (child.type === Map || child.type === this.props.connectedMapComponent)) {
					// layers from state
					maps.push(this.renderMap(this.props.connectedMapComponent, {...props, mapComponent: this.props.mapComponent}, null, mapKey === this.state.activeMapKey));
				} else if (typeof child === "object" && child.type === PresentationMap) {
					// all presentational
					maps.push(this.renderMap(this.props.mapComponent || child.props.mapComponent, props, child.props.children, mapKey === this.state.activeMapKey, true));
				}
			});
		}

		return (<MapGrid>{maps}</MapGrid>);
	}

	renderMap(mapComponent, props, children, active, renderWrapper) {
		// TODO custom wrapper component
		if (this.props.wrapper) {
			let wrapperProps = this.props.wrapperProps;
			if (this.props.onMapRemove && !this.props.disableMapRemoval) {
				wrapperProps = {...this.props.wrapperProps, onMapRemove: this.props.onMapRemove}
			}

			const allProps = {...props, ...wrapperProps, wrapper: this.props.wrapper, active};

			// Render wrapper here, if mapComponent is final (framework-specific) map component
			if (renderWrapper) {
				const wrapperComponent = (this.props.wrapper.prototype && this.props.wrapper.prototype.isReactComponent) || typeof this.props.wrapper === 'function' ? this.props.wrapper : MapWrapper;
				return React.createElement(
					wrapperComponent,
					allProps,
					React.createElement(mapComponent, props, children)
				);
			} else {
				return React.createElement(mapComponent, allProps, children);
			}
		} else {
			return React.createElement(mapComponent, props, children);
		}
	}
}

export const MapSetMap = Map;
export const MapSetPresentationMap = PresentationMap;

export default MapSet;
