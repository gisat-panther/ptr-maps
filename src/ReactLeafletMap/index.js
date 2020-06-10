import React from 'react';
import { Map, WMSTileLayer, TileLayer, Pane } from 'react-leaflet';
import PropTypes from 'prop-types';
import L from "leaflet";
import Proj from "proj4leaflet";
import ReactResizeDetector from 'react-resize-detector';
import viewHelpers from "../LeafletMap/viewHelpers";
import viewUtils from "../viewUtils";
import VectorLayer from "./layers/VectorLayer";
import _ from "lodash";
import DiagramLayer from "./layers/DiagramLayer";
import IndexedVectorLayer from "./layers/IndexedVectorLayer";

import './style.scss';
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

    constructor(props) {
        super(props);

        this.state = {
            view: null,
            crs: this.getCRS(props.crs)
        }

        this.minZoom = constants.defaultLevelsRange[0];
        this.maxZoom = constants.defaultLevelsRange[1];
        if (props.viewLimits && props.viewLimits.boxRangeRange) {
            if (props.viewLimits.boxRangeRange[1]) {
                this.minZoom = viewUtils.getZoomLevelFromView({boxRange: props.viewLimits.boxRangeRange[1]});
            }

            if (props.viewLimits.boxRangeRange[0]) {
                this.maxZoom = viewUtils.getZoomLevelFromView({boxRange: props.viewLimits.boxRangeRange[0]});
            }
        }

        this.onClick = this.onClick.bind(this);
        this.onLayerClick = this.onLayerClick.bind(this);
        this.onViewportChange = this.onViewportChange.bind(this);
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

    onViewportChange(viewport) {
        const change = {};
        // viewport.center could be undefined
        if(viewport && viewport.hasOwnProperty('center') && viewport.center) {
            const center = {
                lat: viewport.center[0],
                lon: viewport.center[1]
            };
            change['center'] = center;
        }
        
        // viewport.zoom could be undefined
        if(viewport && viewport.zoom) {
            const boxRange = viewUtils.getBoxRangeFromZoomLevel(viewport.zoom);
            change['boxRange'] = boxRange;
        }

        // TODO for IndexedVectorLayer rerender (see IndexedVectorLayer render method)
        let stateUpdate = {viewport};

        if (this.props.onViewChange) {
            this.props.onViewChange(change);
        } else {
            stateUpdate.view = change;
        }

        this.setState(stateUpdate);
    }

    onResize() {
        this.leafletMap.invalidateSize();
    }

    render() {
        // fix for backward compatibility
        const backgroundLayersSource = _.isArray(this.props.backgroundLayer) ? this.props.backgroundLayer : [this.props.backgroundLayer];
        const backgroundLayersZindex = constants.defaultLeafletPaneZindex + 1;
        const backgroundLayers = backgroundLayersSource && backgroundLayersSource.map((layer, i) => this.getLayerByType(layer, i));
        
        const baseLayersZindex = constants.defaultLeafletPaneZindex + 100;
        const layers = this.props.layers && this.props.layers.map((layer, i) => <Pane key={layer.key || i} style={{zIndex: baseLayersZindex + i}}>{this.getLayerByType(layer, i)}</Pane>);
        const view = viewHelpers.getLeafletViewportFromViewParams(this.state.view || this.props.view);

        return (
            <ReactResizeDetector handleHeight handleWidth onResize={this.onResize.bind(this)}>
                <Map
                    id={this.props.mapKey}
                    ref={map => {this.leafletMap = map && map.leafletElement}}
                    className="ptr-map ptr-leaflet-map"
                    onViewportChanged={this.onViewportChange}
                    onClick={this.onClick}
                    center={view.center}
                    zoom={view.zoom}
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
            </ReactResizeDetector>
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
        let url = layer.options.url;

        // fix for backward compatibility
        if (layer.options.urls) {
            url = layer.options.urls[0];
        }

        return (
            <TileLayer
                key={layer.key || i}
                url={url}
            />
        );
    }

    getWmsTileLayer(layer, i) {
        const o = layer.options;

        return (
            <WMSTileLayer
                key={layer.key || i}
                url={o.url}
                layers={o.params && o.params.layers}
                crs={o.params.crs ? this.getCRS(o.params.crs) : null}
                opacity={layer.opacity || 1}
                transparent={true}
                format={o.params && o.params.imageFormat || 'image/png'}
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
