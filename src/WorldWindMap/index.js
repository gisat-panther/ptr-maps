import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import {CyclicPickController, utils} from '@gisatcz/ptr-utils';

import WorldWind from 'webworldwind-esa';
import decorateWorldWindowController from './controllers/WorldWindowControllerDecorator';
import layersHelpers from './layers/helpers';
import navigator from './navigator/helpers';

import './style.scss';
import viewUtils from "../viewUtils";
import constants from "../constants";
import LargeDataLayer from "./layers/LargeDataLayerSource/LargeDataLayer";

import VectorLayer from "./layers/VectorLayer";

import {mapConstants} from "@gisatcz/ptr-core";
import Context from '@gisatcz/cross-package-react-context';
const HoverContext = Context.getContext('HoverContext');
const {WorldWindow, ElevationModel} = WorldWind;

class WorldWindMap extends React.PureComponent {
	static contextType = HoverContext;

	static defaultProps = {
		elevationModel: null
	};

	static propTypes = {
		backgroundLayer: PropTypes.oneOfType([
			PropTypes.object,
			PropTypes.array
		]),
		layers: PropTypes.array,
		name: PropTypes.string,
		view: PropTypes.object,
		viewLimits: PropTypes.object,

		onClick: PropTypes.func,
		onLayerClick: PropTypes.func,
		onViewChange: PropTypes.func,

		elevationModel: PropTypes.string,
	};

	constructor(props) {
		super(props);
		this.canvasId = utils.uuid();

		this.onClick = this.onClick.bind(this);
		this.onLayerHover = this.onLayerHover.bind(this);
		this.onWorldWindHover =  this.onWorldWindHover.bind(this);
		this.onLayerClick = this.onLayerClick.bind(this);
		this.onMouseOut = this.onMouseOut.bind(this);
		this.onZoomLevelsBased = this.onZoomLevelsBased.bind(this);
	}

	componentDidMount() {
		this.wwd = new WorldWindow(this.canvasId, this.getElevationModel());

		decorateWorldWindowController(this.wwd.worldWindowController, this.props.viewLimits);
		this.wwd.worldWindowController.onNavigatorChanged = this.onNavigatorChange.bind(this);

		if (this.props.levelsBased) {
			// rewrite default wheel listener.
			this.wwd.eventListeners.wheel.listeners = [this.onZoomLevelsBased.bind(this)];
		}

		new CyclicPickController(this.wwd, ['mousemove', 'mousedown', 'mouseup', 'mouseout', 'touchstart', 'touchmove', 'touchend'], this.onWorldWindHover, true);
		this.updateNavigator(mapConstants.defaultMapView);
		this.updateLayers();

	}

	onZoomLevelsBased(e) {
		e.preventDefault();
		if (e.wheelDelta) {
			let zoomLevel = viewUtils.getZoomLevelFromView(this.props.view);

			if (e.wheelDelta > 0) {
				zoomLevel++;
			} else {
				zoomLevel--;
			}

			// let levelsRange = this.props.levelsBased.length ? this.props.levelsBased : constants.defaultLevelsRange;
			let levelsRange = constants.defaultLevelsRange;
			const boxRangeRange = this.props.viewLimits && this.props.viewLimits.boxRangeRange;
			if (boxRangeRange) {
				const maxLevel = boxRangeRange[0] ?  viewUtils.getZoomLevelFromView({boxRange: boxRangeRange[0]}) : levelsRange[1];
				const minLevel = boxRangeRange[1] ?  viewUtils.getZoomLevelFromView({boxRange: boxRangeRange[1]}) : levelsRange[0];
				levelsRange = [minLevel, maxLevel];
			}

			if (zoomLevel <= levelsRange[1] && zoomLevel >= levelsRange[0]) {
				const boxRange = viewUtils.getBoxRangeFromZoomLevel(zoomLevel);
				if (this.props.onViewChange) {
					this.props.onViewChange({
						boxRange
					});
				}
			}
		}
	}

	componentDidUpdate(prevProps) {
		if (prevProps){
			if (this.props.view && prevProps.view !== this.props.view) {
				this.updateNavigator();
			}

			if (prevProps.layers !== this.props.layers || prevProps.backgroundLayer !== this.props.backgroundLayer) {
				this.updateLayers();
			}

			if (this.context && this.context.hoveredItems) {
				const currentHoveredItemsString = JSON.stringify(_.sortBy(this.context.hoveredItems));
				if (currentHoveredItemsString !== this.previousHoveredItemsString) {
					this.updateHoveredFeatures();
				}
			}
		}
	}

	updateLayers() {
		let layers = [];
		if (this.props.backgroundLayer) {
			// TODO fix for compatibility
			let backgroundLayers = _.isArray(this.props.backgroundLayer) ? this.props.backgroundLayer : [this.props.backgroundLayer];

			backgroundLayers.forEach((layer) => {
				layers.push(layersHelpers.getLayerByType(layer, this.wwd));
			});
		}

		if (this.props.layers) {
			this.props.layers.forEach((layer) => {
				const mapLayer = layersHelpers.getLayerByType(layer, this.wwd, this.onLayerHover, this.onLayerClick, this.props.pointAsMarker);
				layers.push(mapLayer);
			});
		}


		this.invalidateLayers(this.wwd.layers);
		this.wwd.layers = layers;
		this.wwd.redraw();
	}

	invalidateLayers(previousLayers) {
		previousLayers.forEach(prevLayer => {
			if (prevLayer instanceof LargeDataLayer) {
				prevLayer.removeListeners();
			}
		});
	}

	updateHoveredFeatures() {
		this.wwd.layers.forEach(layer => {
			if (layer instanceof LargeDataLayer) {
				layer.updateHoveredKeys(this.context.hoveredItems, this.context.x, this.context.y);
			} else if (layer instanceof VectorLayer) {
				layer.updateHoveredFeatures(this.context.hoveredItems);
			}
		});
		this.wwd.redraw();
		this.previousHoveredItemsString = JSON.stringify(_.sortBy(this.context.hoveredItems));
	}

	updateNavigator(defaultView) {
		let currentView = defaultView || navigator.getViewParamsFromWorldWindNavigator(this.wwd.navigator);
		let nextView = {...currentView, ...this.props.view};
		navigator.update(this.wwd, nextView);
	}

	/**
	 * @returns {null | elevation}
	 */
	getElevationModel() {
		switch (this.props.elevationModel) {
			case "default":
				return null;
			case null:
				const elevation = new ElevationModel();
				elevation.removeAllCoverages();
				return elevation;
		}
	}

	onNavigatorChange(event) {
		if (event) {
			const viewParams = navigator.getViewParamsFromWorldWindNavigator(event);
			const changedViewParams = navigator.getChangedViewParams({...mapConstants.defaultMapView, ...this.props.view}, viewParams);

			if(this.props.onViewChange) {
				if (!_.isEmpty(changedViewParams)) {
					if (this.props.delayedWorldWindNavigatorSync) {
						if (this.changedNavigatorTimeout) {
							clearTimeout(this.changedNavigatorTimeout);
						}
						this.changedNavigatorTimeout = setTimeout(() => {
							this.props.onViewChange(changedViewParams);
						}, this.props.delayedWorldWindNavigatorSync)
					} else {
						this.props.onViewChange(changedViewParams);
					}
				}
			}
		}
	}

	onClick() {
		if (this.props.onClick) {
			let currentView = navigator.getViewParamsFromWorldWindNavigator(this.wwd.navigator);
			this.props.onClick(currentView);
		}
	}

	onMouseOut() {
		if (this.context && this.context.onHoverOut) {
			this.context.onHoverOut();
		}
	}

	onLayerHover(layerKey, featureKeys, x, y, popupContent, data, fidColumnName) {
		// pass data to popup
		if (this.context && this.context.onHover && featureKeys.length) {
			this.context.onHover(featureKeys, {
				popup: {
					x,
					y,
					content: popupContent,
					data,
					fidColumnName
				}
			});
		}
	}

	onLayerClick(layerKey, featureKeys) {
		if (this.props.onLayerClick) {
			this.props.onLayerClick(this.props.mapKey, layerKey, featureKeys);
		}
	}

	onWorldWindHover(renderables, event) {
		// TODO can be hovered more than one renderable at one time?
		if (renderables.length && renderables.length === 1) {
			// TODO is this enough?
			const layerPantherProps = renderables[0].parentLayer.pantherProps;

			const data = renderables[0].userObject.userProperties;
			const featureKeys = [data[layerPantherProps.fidColumnName]];

			// TODO add support for touch events
			if (event.type === 'mousedown') {
				this.onLayerClick(layerPantherProps.layerKey, featureKeys);
			} else {
				this.onLayerHover(layerPantherProps.layerKey, featureKeys, event.pageX, event.pageY, <div>{featureKeys.join(",")}</div>, data, layerPantherProps.fidColumnName);
			}
		} else if (this.context && this.context.onHoverOut){
			this.context.onHoverOut();
		}
	}

	render() {
		return (
			<div className="ptr-map ptr-world-wind-map" onClick={this.onClick} onMouseOut={this.onMouseOut}>
				<canvas className="ptr-world-wind-map-canvas" id={this.canvasId}>
					Your browser does not support HTML5 Canvas.
				</canvas>
			</div>
		);

	}
}

export default WorldWindMap;
