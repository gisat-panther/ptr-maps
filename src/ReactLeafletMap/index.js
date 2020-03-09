import React from 'react';
import { Map, TileLayer } from 'react-leaflet';
import PropTypes from 'prop-types';
import viewHelpers from "../LeafletMap/viewHelpers";
import viewUtils from "../viewUtils";

class ReactLeafletMap extends React.PureComponent {
    static propTypes = {
        backgroundLayer: PropTypes.object,
        mapKey: PropTypes.string.isRequired,
        onViewChange: PropTypes.func,
        view: PropTypes.object
    };

    constructor(props) {
        super(props);
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
        const view = viewHelpers.getLeafletViewportFromViewParams(this.props.view);

        console.log(this.props.mapKey, view.center, view.zoom);
        return (
            <Map
                id={this.props.mapKey}
                className="ptr-map ptr-leaflet-map"
                onViewportChanged={this.onViewportChange}
                center={view.center}
                zoom={view.zoom}
                zoomControl={false}
            >
                {backgroundLayer}
                {this.props.children}
            </Map>
        );
    }

    getLayerByType(layer) {
        if (layer.type){
            switch (layer.type) {
                case 'wmts':
                    return this.getTileLayer(layer);
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
}

export default ReactLeafletMap;