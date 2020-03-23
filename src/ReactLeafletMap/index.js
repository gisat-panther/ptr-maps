import React from 'react';
import { Map, GeoJSON, WMSTileLayer, TileLayer, Pane } from 'react-leaflet';
import PropTypes from 'prop-types';
import L from "leaflet";
import viewHelpers from "../LeafletMap/viewHelpers";
import viewUtils from "../viewUtils";
import VectorLayer from "./layers/VectorLayer";
import _ from "lodash";

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
        const layers = this.props.layers && this.props.layers.map((layer, i) => <Pane>{this.getLayerByType(layer, i)}</Pane>);
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
                    return this.getTileLayer(layer);
                case 'wms':
                    return this.getWmsTileLayer(layer, i);
                case 'vector':
                case 'diagram':
                    return this.getVectorLayer(layer, i);
                default:
                    return null;
            }
        } else {
            return null
        }
    }

    getTileLayer(layer) {
        let url = layer.options.url;

        // fix for backward compatibility
        if (layer.options.urls) {
            url = layer.options.urls[0];
        }

        return (
            <TileLayer
                url={url}
            />
        );
    }

    getWmsTileLayer(layer, i) {
        const o = layer.options;

        return (
            <WMSTileLayer
                key={i}
                url={o.url}
                layers={o.params && o.params.layers}
                opacity={layer.opacity || 1}
                transparent={true}
                format={o.params && o.params.imageFormat || 'image/png'}
            />
        );
    }

    getVectorLayer(layer, i) {
        const o = layer.options;
        return (
            <VectorLayer
                key={i}
                type={layer.type}
                layerKey={layer.key}
                opacity={layer.opacity || 1}
                features={o.features}
                selected={o.selected}
                hovered={o.hovered}
                style={o.style}
                pointSizeInMeters={o.pointSizeInMeters}
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