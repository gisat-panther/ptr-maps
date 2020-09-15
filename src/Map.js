import React from "react";
import PropTypes from 'prop-types';
import _ from "lodash";
import {map as mapUtils} from '@gisatcz/ptr-utils';
import {Error} from '@gisatcz/ptr-atoms';
import {mapConstants} from '@gisatcz/ptr-core';
import MapWrapper from "./MapWrapper";

import './style.scss';

class PresentationMap extends React.PureComponent {

	static propTypes = {
		mapComponent: PropTypes.oneOfType([
			PropTypes.element,
			PropTypes.func
		]),
		wrapper: PropTypes.oneOfType([
			PropTypes.element,
			PropTypes.bool
		]),
		wrapperProps: PropTypes.object
	};

	constructor(props) {
		super(props);

		this.state = {
			width: null,
			height: null
		}
		
		if (!props.stateMapKey) {
			this.state.view = {...mapConstants.defaultMapView, ...props.view};
		}
		
		this.onViewChange = this.onViewChange.bind(this);
		this.resetHeading = this.resetHeading.bind(this);
		this.onResize = this.onResize.bind(this);
	}
	
	componentDidMount() {
		if (this.props.onMount) {
			this.props.onMount();
		}
	}
	
	componentDidUpdate(prevProps) {
		const props = this.props;
		if (props.view) {
			if (prevProps && prevProps.view) { //todo simplify
				if (!_.isEqual(props.view, prevProps.view)) {
					this.setState({
						view: {...mapConstants.defaultMapView, ...props.view}
					});
				}
			} else {
				this.setState({
					view: {...mapConstants.defaultMapView, ...props.view}
				});
			}
		}

		if (
			(props.layers && props.layers !== prevProps.layers)
			|| (props.backgroundLayer && props.backgroundLayer !== prevProps.backgroundLayer)
		) {
			// this.props.refreshUse();
		}
	}

	componentWillUnmount() {
		if (this.props.onUnmount) {
			this.props.onUnmount();
		}
	}
	
	onViewChange(update) {
		let view = {...this.state.view, ...update};
		view = mapUtils.view.ensureViewIntegrity(view);
		
		if (!_.isEqual(view, this.state.view)) {
			this.setState({view});
		}

		if (this.props.onViewChange) {
			this.props.onViewChange(view);
		}
	}
	
	resetHeading() {
		mapUtils.resetHeading(this.state.view.heading, (heading) => this.setState({
			view: {...this.state.view, heading}
		}));
	}

	onResize(width, height) {
	    if (this.props.onResize) {
	        this.props.onResize(width, height);
        }

		this.setState({width, height});
	}

	render() {
		const {children, mapComponent, wrapper, wrapperProps, ...props} = this.props;

		if (!mapComponent) {
			return (<Error centered>mapComponent not supplied to Map</Error>);
		} else {
			props.onResize = this.onResize;

			if (!props.stateMapKey) {
				props.view = this.state.view || props.view;
				props.onViewChange = this.onViewChange;
			}

			if (wrapper) {
				const wrapperComponent = this.props.wrapper.prototype && this.props.wrapper.prototype.isReactComponent ? this.props.wrapper : MapWrapper;

				return React.createElement(
					wrapperComponent,
					{...props, ...wrapperProps},
					this.renderContent(mapComponent, props, children)
				);
			} else {
				return this.renderContent(mapComponent, props, children);
			}
		}
	}

	renderContent(mapComponent, props, children) {
		let map = React.createElement(mapComponent, props);

		if (!children) {
			return map;
		} else {
			return (
				<div className="ptr-map-controls-wrapper">
					{map}
					{React.Children.map(children, child => {
						return React.cloneElement(child, {
							...child.props,
							view: this.props.stateMapKey ? this.props.view : (this.state.view || this.props.view),
							viewLimits: this.props.viewLimits,
							updateView: this.props.stateMapKey ? this.props.onViewChange : this.onViewChange,
							resetHeading: this.props.stateMapKey ? this.props.resetHeading : this.resetHeading,
							mapWidth: this.state.width,
							mapHeight: this.state.height
						});
					})}
				</div>
			);
		}
	}

}

export default PresentationMap;
