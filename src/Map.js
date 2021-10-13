import React from 'react';
import PropTypes from 'prop-types';
import {isEqual as _isEqual, isEmpty as _isEmpty} from 'lodash';
import {map as mapUtils} from '@gisatcz/ptr-utils';
import {Error} from '@gisatcz/ptr-atoms';
import {mapConstants} from '@gisatcz/ptr-core';
import MapWrapper from './MapWrapper';

import './style.scss';

class PresentationMap extends React.PureComponent {
	static propTypes = {
		backgroundLayer: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
		children: PropTypes.oneOfType([PropTypes.element, PropTypes.array]),
		layers: PropTypes.array,
		mapComponent: PropTypes.oneOfType([PropTypes.element, PropTypes.func]),
		onMount: PropTypes.func,
		onPropViewChange: PropTypes.func,
		onResize: PropTypes.func,
		onViewChange: PropTypes.func,
		resetHeading: PropTypes.func,
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
	};

	constructor(props) {
		super(props);

		this.state = {
			width: null,
			height: null,
		};

		if (!props.stateMapKey) {
			this.state.view = {...mapConstants.defaultMapView, ...props.view};
		}

		this.onViewChange = this.onViewChange.bind(this);
		this.onPropViewChange = this.onPropViewChange.bind(this);
		this.resetHeading = this.resetHeading.bind(this);
		this.onResize = this.onResize.bind(this);
	}

	componentDidMount() {
		if (this.props.onMount) {
			this.props.onMount(this.state.width, this.state.height);
		}
	}

	componentDidUpdate(prevProps) {
		const props = this.props;
		if (props.view) {
			const view = this.getValidView(props.view);
			if (prevProps && prevProps.view) {
				//todo simplify
				if (!_isEqual(props.view, prevProps.view)) {
					if (!this.props.stateMapKey) {
						this.saveViewChange(view, false);
					} else {
						this.onPropViewChange(view);
					}
				}
			} else {
				if (!this.props.stateMapKey) {
					this.saveViewChange(view, true);
				} else {
					this.onPropViewChange(view);
				}
			}
		}

		if (
			(props.layers && props.layers !== prevProps.layers) ||
			(props.backgroundLayer &&
				props.backgroundLayer !== prevProps.backgroundLayer)
		) {
			// this.props.refreshUse();
		}
	}

	componentWillUnmount() {
		if (this.props.onUnmount) {
			this.props.onUnmount();
		}
	}

	onViewChangeDecorator(onViewChange) {
		return update => {
			onViewChange(update, this.state.width, this.state.height);
		};
	}

	getValidView(update) {
		let view = {...mapConstants.defaultMapView, ...view};
		if (this.state.view && !_isEmpty(this.state.view)) {
			view = {...this.state.view, ...update};
		}
		view = mapUtils.view.ensureViewIntegrity(view);
		return view;
	}

	saveViewChange(view, checkViewEquality) {
		if (checkViewEquality && !_isEqual(view, this.state.view)) {
			if (!this.props.stateMapKey) {
				this.setState({view});
			}
		}
	}

	onViewChange(update) {
		const view = this.getValidView(update);
		this.saveViewChange(view, true);

		if (!_isEqual(view, this.state.view)) {
			if (this.props.onViewChange && !this.props.stateMapKey) {
				this.onViewChangeDecorator(this.props.onViewChange)(view);
			}
		}
	}

	onPropViewChange(view) {
		if (this.props.stateMapKey && this.props.onPropViewChange) {
			this.onViewChangeDecorator(this.props.onPropViewChange)(view);
		}
	}

	resetHeading() {
		mapUtils.resetHeading(this.state.view.heading, heading =>
			this.setState({
				view: {...this.state.view, heading},
			})
		);
	}

	onResize(width, height) {
		if (this.props.onResize) {
			this.props.onResize(width, height);
		}

		this.setState({width, height});
	}

	render() {
		const {children, mapComponent, wrapper, wrapperProps, ...props} =
			this.props;

		if (!mapComponent) {
			return <Error centered>mapComponent not supplied to Map</Error>;
		} else {
			props.onResize = this.onResize;

			if (!props.stateMapKey) {
				props.view = this.state.view || props.view;
				props.onViewChange = this.onViewChange;
			}

			if (wrapper) {
				// check if passed wrapper is React component or connected component
                                 const wrapperComponent = React.isValidElement(wrapper) || wrapper.WrappedComponent ? wrapper : MapWrapper
				}

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
							view: props.view,
							viewLimits: this.props.viewLimits,
							updateView: props.onViewChange,
							resetHeading: this.props.stateMapKey
								? this.props.resetHeading
								: this.resetHeading,
							mapWidth: this.props.stateMapKey
								? this.props.viewport?.width
								: this.state.width,
							mapHeight: this.props.stateMapKey
								? this.props.viewport?.height
								: this.state.height,
						});
					})}
				</div>
			);
		}
	}
}

export default PresentationMap;
