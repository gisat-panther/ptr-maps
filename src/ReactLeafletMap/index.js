import React from 'react';
import { Map, WMSTileLayer, TileLayer, Pane } from 'react-leaflet';
import PropTypes from 'prop-types';
import L from "leaflet";
import viewHelpers from "../LeafletMap/viewHelpers";
import viewUtils from "../viewUtils";
import VectorLayer from "./layers/VectorLayer";
import _ from "lodash";
import DiagramLayer from "./layers/DiagramLayer";
import LargeVectorLayer from "./layers/LargeVectorLayer";

import './style.scss';

class ReactLeafletMap extends React.PureComponent {
    static propTypes = {
        backgroundLayer: PropTypes.oneOfType([
            PropTypes.object,
            PropTypes.array
        ]),
        mapKey: PropTypes.string.isRequired,
        onLayerClick: PropTypes.func,
        onViewChange: PropTypes.func,
        view: PropTypes.object
    };

    constructor(props) {
        super(props);

        this.onLayerClick = this.onLayerClick.bind(this);
        this.onViewportChange = this.onViewportChange.bind(this);
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
        const center = {
            lat: viewport.center[0],
            lon: viewport.center[1]
        };

        const boxRange = viewUtils.getBoxRangeFromZoomLevelAndLatitude(viewport.zoom, center.lat);

        if (this.props.onViewChange) {
            this.props.onViewChange({center, boxRange});
        }
    }

    render() {
        // fix for backward compatibility
        const backgroundLayersSource = _.isArray(this.props.backgroundLayer) ? this.props.backgroundLayer : [this.props.backgroundLayer];

        const backgroundLayers = backgroundLayersSource && backgroundLayersSource.map((layer, i) => this.getLayerByType(layer, i));
        const layers = this.props.layers && this.props.layers.map((layer, i) => <Pane key={layer.key || i}>{this.getLayerByType(layer, i)}</Pane>);
        const view = viewHelpers.getLeafletViewportFromViewParams(this.props.view);

        return (
            <Map
                id={this.props.mapKey}
                className="ptr-map ptr-leaflet-map"
                onViewportChanged={this.onViewportChange}
                center={view.center}
                zoom={view.zoom}
                zoomControl={false}
                attributionControl={false}
            >
                {backgroundLayers}
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
                    return this.getVectorLayer(layer, i);
                case 'vector-large':
                    return this.getLargeVectorLayer(layer, i);
                case 'diagram':
                    return this.getDiagramLayer(layer, i);
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
                opacity={layer.opacity || 1}
                transparent={true}
                format={o.params && o.params.imageFormat || 'image/png'}
            />
        );
    }

    getLargeVectorLayer(layer, i) {
        const o = layer.options;
        return (
            <LargeVectorLayer
                key={layer.key || i}
                type={layer.type}
                layerKey={layer.key}
                opacity={layer.opacity || 1}
                features={o.features}
                selected={o.selected}
                hovered={o.hovered}
                style={o.style}
                pointAsMarker={o.pointAsMarker}
                fidColumnName={o.fidColumnName}
                boxRangeRange={o.boxRangeRange}
                view={this.props.view}
                onClick={this.onLayerClick}
            />
        );
    }

    getVectorLayer(layer, i) {
        const o = layer.options;
        return (
            <VectorLayer
                key={layer.key || i}
                type={layer.type}
                layerKey={layer.key}
                opacity={layer.opacity || 1}
                features={o.features}
                selected={o.selected}
                hovered={o.hovered}
                style={o.style}
                pointAsMarker={o.pointAsMarker}
                fidColumnName={o.fidColumnName}
                onClick={this.onLayerClick}
            />
        );
    }

    getDiagramLayer(layer, i) {
        const o = layer.options;
        return (
            <DiagramLayer
                key={layer.key || i}
                type={layer.type}
                layerKey={layer.key}
                opacity={layer.opacity || 1}
                features={o.features}
                selected={o.selected}
                hovered={o.hovered}
                style={o.style}
                fidColumnName={o.fidColumnName}
                onClick={this.onLayerClick}
            />
        );
    }

    onLayerClick(layerKey, featureKeys) {
        if (this.props.onLayerClick) {
            this.props.onLayerClick(this.props.mapKey, layerKey, featureKeys);
        }
    }
}

export default ReactLeafletMap;