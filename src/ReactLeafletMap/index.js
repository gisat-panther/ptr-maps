import React from 'react';
import { Map, GeoJSON, WMSTileLayer, TileLayer } from 'react-leaflet';
import PropTypes from 'prop-types';
import viewHelpers from "../LeafletMap/viewHelpers";
import viewUtils from "../viewUtils";
import VectorLayer from "./layers/VectorLayer";

class ReactLeafletMap extends React.PureComponent {
    static propTypes = {
        backgroundLayer: PropTypes.object,
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
        const backgroundLayer = this.getLayerByType(this.props.backgroundLayer);
        const layers = this.props.layers && this.props.layers.map((layer, i) => this.getLayerByType(layer, i));
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
                {backgroundLayer}
                {layers}
                {this.props.children}
            </Map>
        );
    }

    getLayerByType(layer, i) {
        if (layer.type){
            switch (layer.type) {
                case 'wmts':
                    return this.getTileLayer(layer);
                case 'wms':
                    return this.getWmsTileLayer(layer, i);
                case 'vector':
                    return this.getVectorLayer(layer, i);
                default:
                    return null;
            }
        } else {
            return null
        }
    }

    getTileLayer(layer) {
        return (
            <TileLayer
                url={layer.options.url}
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