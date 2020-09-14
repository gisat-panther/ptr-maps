import React from 'react';
import { Map, TileLayer, Pane } from 'react-leaflet';
import PropTypes from 'prop-types';
import L from "leaflet";
import Proj from "proj4leaflet";
import ReactResizeDetector from 'react-resize-detector';
import {mapConstants} from "gisatcz/ptr-core";
import {map as mapUtils} from '@gisatcz/ptr-utils';

import viewHelpers from "./viewHelpers";
import VectorLayer from "./layers/VectorLayer";
import _ from "lodash";
import DiagramLayer from "./layers/DiagramLayer";
import IndexedVectorLayer from "./layers/IndexedVectorLayer";
import WMSLayer from "./layers/WMSLayer";

import './style.scss';
import 'leaflet/dist/leaflet.css';
import constants from "../constants";

class ReactLeafletMap extends React.PureComponent {
    static propTypes = {
        backgroundLayer: PropTypes.oneOfType([
            PropTypes.object,
            PropTypes.array
        ]),
        name: PropTypes.string,
        crs: PropTypes.string,
        layers: PropTypes.array,
        mapKey: PropTypes.string.isRequired,
        onClick: PropTypes.func,
        onLayerClick: PropTypes.func,
        onViewChange: PropTypes.func,
        view: PropTypes.object
    };

    static getDerivedStateFromProps(props, state) {
        if (state.width && state.height) {
            return {
                leafletView: viewHelpers.getLeafletViewportFromViewParams(props.view, state.width, state.height)
            }
        }

        // Return null if the state hasn't changed
        return null;
    }

    constructor(props) {
        super(props);

        this.state = {
            view: null,
            crs: this.getCRS(props.crs)
        }

        this.onClick = this.onClick.bind(this);
        this.onLayerClick = this.onLayerClick.bind(this);
        this.onViewportChanged = this.onViewportChanged.bind(this);
        this.onResize = this.onResize.bind(this);
    }

    componentDidMount() {
        // Hack for ugly 1px tile borders in Chrome
        // Version of Leaflet package in dependencies should match version used by react-leaflet
        let originalInitTile = L.GridLayer.prototype._initTile;
        L.GridLayer.include({
            _initTile: function (tile) {
                originalInitTile.call(this, tile);

                var tileSize = this.getTileSize();

                tile.style.width = tileSize.x + 1 + 'px';
                tile.style.height = tileSize.y + 1 + 'px';
            }
        });
    }

    getCRS(code) {
        switch (code) {
            case 'EPSG:4326':
                return L.CRS.EPSG4326;
            case 'EPSG:5514':
                return new Proj.CRS("EPSG:5514",constants.projDefinitions.epsg5514,
                    {
                        resolutions: [102400, 51200, 25600, 12800, 6400, 3200, 1600, 800, 400, 200, 100, 50, 25, 12.5, 6.25, 3.125, 1.5625, 0.78125, 0.390625]
                    }
                );
            default:
                return L.CRS.EPSG3857;
        }
    }

    setZoomLevelsBounds(width, height) {
        const props = this.props;
        this.minZoom = mapConstants.defaultLevelsRange[0];
        this.maxZoom = mapConstants.defaultLevelsRange[1];
        if (props.viewLimits && props.viewLimits.boxRangeRange) {
            if (props.viewLimits.boxRangeRange[1]) {
                this.minZoom = mapUtils.getZoomLevelFromBoxRange(props.viewLimits.boxRangeRange[1], width, height);
            }

            if (props.viewLimits.boxRangeRange[0]) {
                this.maxZoom = mapUtils.getZoomLevelFromBoxRange(props.viewLimits.boxRangeRange[0], width, height);
            }
        }
    }

    onViewportChanged(viewport) {
        if (viewport) {
            let change = {};

            if (viewport.center && (viewport.center[0] !== this.state.leafletView.center[0] || viewport.center[1] !== this.state.leafletView.center[1])) {
                change.center = {
                    lat: viewport.center[0],
                    lon: viewport.center[1]
                }
            }

            if (viewport.hasOwnProperty('zoom') && Number.isFinite(viewport.zoom) && viewport.zoom !== this.state.leafletView.zoom) {
                change.boxRange = mapUtils.getBoxRangeFromZoomLevel(viewport.zoom, this.state.width, this.state.height);
            }

            if (!_.isEmpty(change) && this.props.onViewChange && !this.hasResized()) {
                this.props.onViewChange(change);
            }

            // TODO for IndexedVectorLayer rerender (see IndexedVectorLayer render method)
            if (!_.isEqual(viewport, this.state.viewport)) {
                this.setState({viewport});
            }
        }
    }

    hasResized() {
        const {x,y} = this.leafletMap._size;
        const widthChange = Math.abs(x - this.state.width) > 1;
        const heightChange = Math.abs(y - this.state.height) > 1;
        return widthChange || heightChange;
    }

    onResize(width, height) {
        if (this.leafletMap) {
            this.leafletMap.invalidateSize();
        }

        if (!this.maxZoom && !this.minZoom) {
            this.setZoomLevelsBounds(width, height);
        }

        this.setState({
            width, height, leafletView: viewHelpers.getLeafletViewportFromViewParams(this.props.view, this.state.width, this.state.height)
        });

        if (this.props.onResize) {
            this.props.onResize(width, height);
        }
    }

    render() {
        return (
            <>
                <ReactResizeDetector
                    handleHeight
                    handleWidth
                    onResize={this.onResize}
                    refreshMode="debounce"
                    refreshRate={500}
                />
                {this.state.width && this.state.height ? this.renderMap() : null}
            </>
        );
    }

    renderMap() {
        // fix for backward compatibility
        const backgroundLayersSource = _.isArray(this.props.backgroundLayer) ? this.props.backgroundLayer : [this.props.backgroundLayer];
        const backgroundLayersZindex = constants.defaultLeafletPaneZindex + 1;
        const backgroundLayers = backgroundLayersSource && backgroundLayersSource.map((layer, i) => this.getLayerByType(layer, i));

        const baseLayersZindex = constants.defaultLeafletPaneZindex + 100;
        const layers = this.props.layers && this.props.layers.map((layer, i) => <Pane key={layer.key || i} style={{zIndex: baseLayersZindex + i}}>{this.getLayerByType(layer, i)}</Pane>);

        return (
            <Map
                id={this.props.mapKey}
                ref={map => {this.leafletMap = map && map.leafletElement}}
                className="ptr-map ptr-leaflet-map"
                onViewportChanged={this.onViewportChanged}
                onClick={this.onClick}
                center={this.state.leafletView.center}
                zoom={this.state.leafletView.zoom}
                zoomControl={false}
                minZoom={this.minZoom} // non-dynamic prop
                maxZoom={this.maxZoom} // non-dynamic prop
                attributionControl={false}
                crs={this.state.crs}
            >
                <Pane style={{zIndex: backgroundLayersZindex}}>{backgroundLayers}</Pane>
                {layers}
                {this.props.children}
            </Map>
        );
    }

    getLayerByType(layer, i) {
        if (layer && layer.type){
            switch (layer.type) {
                case 'wmts':
                    return this.getTileLayer(layer, i);
                case 'wms':
                    return this.getWmsTileLayer(layer, i);
                case 'vector':
                    return this.getIndexedVectorLayer(layer, i);
                case 'diagram':
                    return this.getIndexedVectorLayer(layer, i, true);
                default:
                    return null;
            }
        } else {
            return null
        }
    }

    getTileLayer(layer, i) {
        let {url, ...restOptions} = layer.options;

        // fix for backward compatibility
        if (layer.options.urls) {
            url = layer.options.urls[0];
        }

        return (
            <TileLayer
                key={layer.key || i}
                url={url}
                {...restOptions}
            />
        );
    }

    getWmsTileLayer(layer, i) {
        const o = layer.options;
        let layers = (o.params && o.params.layers) || '';
        let crs = (o.params && o.params.crs && this.getCRS(o.params.crs)) || null;
        let imageFormat = (o.params && o.params.imageFormat) || 'image/png';
        const reservedParamsKeys = ['layers', 'crs', 'imageFormat', 'pane', 'maxZoom', 'styles'];
        let restParameters = (o.params && Object.entries(o.params).reduce((acc, [key, value]) => {
            if(reservedParamsKeys.includes(key)) {
                return acc
            } else {
                acc[key] = value;
                return acc;
            }
        }, {})) || {};

        return (
            <WMSLayer
                key={layer.key || i}
                url={o.url}
                crs={crs}
                singleTile={o.singleTile === true}
                params={{
                    layers:layers,
                    opacity:layer.opacity || 1,
                    transparent:true,
                    format:imageFormat,
                    ...restParameters
                }}
            />
        );
    }

    getIndexedVectorLayer(layer, i, isDiagram) {
        return (
            <IndexedVectorLayer
                component={isDiagram ? DiagramLayer : VectorLayer}
                key={layer.key || i}
                type={layer.type}
                layerKey={layer.key}
                opacity={layer.opacity || 1}
                view={this.state.view || this.props.view}
                viewport={this.state.viewport}
                onClick={this.onLayerClick}
                {...layer.options}
            />
        );
    }

    onLayerClick(layerKey, featureKeys) {
        if (this.props.onLayerClick) {
            this.props.onLayerClick(this.props.mapKey, layerKey, featureKeys);
        }
    }

    onClick() {
        if (this.props.onClick) {
            this.props.onClick(this.props.view);
        }
    }
}

export default ReactLeafletMap;