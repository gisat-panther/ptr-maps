import React from 'react';
import {utils} from '@gisatcz/ptr-utils';
import {GeoJSON, withLeaflet} from 'react-leaflet';
import L from "leaflet";

class GeoJsonLayer extends React.PureComponent {
    static propTypes = {
    };

    constructor(props) {
        super(props);
        this.state = {
            layerKey: utils.uuid()
        };

        this.getStyle = this.getStyle.bind(this);
        this.onEachFeature = this.onEachFeature.bind(this);
        this.pointToLayer = this.pointToLayer.bind(this);
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        // return new instance when features has been changed
        // more: https://react-leaflet.js.org/docs/en/components#geojson
        if (this.props.features !== prevProps.features) {
            this.setState({
                layerKey: utils.uuid()
            })
        }
    }

    getStyle(feature) {
        let style = feature.defaultStyle;

        if (feature.selected) {
            style = feature.selectedStyle;
        }

        return style;
    }

    onEachFeature(feature, layer){
        const fid = feature.properties[this.props.fidColumnName] || feature.id;

        layer.on({
            click: (e) => {
                if (this.props.onFeatureClick && feature.selectable) {
                    this.props.onFeatureClick(fid);
                }
            },
            mousemove: (e) => {
                if (feature.hoverable) {
                    if (feature.selected && feature.selectedHoveredStyle) {
                        e.target.setStyle(feature.selectedHoveredStyle);
                    } else {
                        e.target.setStyle(feature.hoveredStyle);
                    }
                }
            },
            mouseout: (e) => {
                if (feature.hoverable) {
                    if (feature.selected && feature.selectedStyle) {
                        e.target.setStyle(feature.selectedStyle);
                    } else {
                        e.target.setStyle(feature.defaultStyle);
                    }
                }
            }
        })
    }

    // render points
    pointToLayer(feature, coord) {
        if (this.props.pointAsMarker) {
            return L.circleMarker(coord);
        } else {
            return L.circle(coord);
        }
    }

    render() {
        const features = this.props.features.map(item => {return {...item.feature, ...item}});

        return (
            <GeoJSON
                key={this.state.layerKey}
                data={features}
                style={this.getStyle}
                onEachFeature={this.onEachFeature}
                pointToLayer={this.pointToLayer}
            />
        );
    }
}

export default withLeaflet(GeoJsonLayer);