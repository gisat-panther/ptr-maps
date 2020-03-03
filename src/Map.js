import React from "react";
import PropTypes from 'prop-types';
import _ from "lodash";
import {map as mapUtils} from '@gisatcz/ptr-utils';
import {Error} from '@gisatcz/ptr-atoms';
import {mapConstants} from '@gisatcz/ptr-core';

import './style.scss';

class PresentationMap extends React.PureComponent {

	static propTypes = {
		mapComponent: PropTypes.oneOfType([
			PropTypes.element,
			PropTypes.func
		])
	};

	constructor(props) {
		super(props);
		
		if (!props.stateMapKey) {
			this.state = {
				view: {...mapConstants.defaultMapView, ...props.view}
			};
		}
		
		this.onViewChange = this.onViewChange.bind(this);
		this.resetHeading = this.resetHeading.bind(this);
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
		view = mapUtils.ensureViewIntegrity(view);
		
		if (!_.isEqual(view, this.state.view)) {
			this.setState({view});
		}
	}
	
	resetHeading() {
		mapUtils.resetHeading(this.state.view.heading, (heading) => this.setState({
			view: {...this.state.view, heading}
		}));
	}

	render() {
		const {children, mapComponent, ...props} = this.props;

		if (!mapComponent) {
			return (<Error centered>mapComponent not supplied to Map</Error>);
		} else {

			if (!props.stateMapKey) {
				props.view = this.state.view || props.view;
				props.onViewChange = this.onViewChange;
			}

			let map = React.createElement(mapComponent, props, children); //todo ptr-map-wrapper ?

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
								updateView: this.props.stateMapKey ? this.props.onViewChange : this.onViewChange,
								resetHeading: this.props.stateMapKey ? this.props.resetHeading : this.resetHeading
							});
						})}
					</div>
				);
			}

		}
	}

}

export default PresentationMap;
