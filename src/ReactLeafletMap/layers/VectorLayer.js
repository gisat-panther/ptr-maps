import React from 'react';
import {mapStyle, utils} from '@gisatcz/ptr-utils';
import {GeoJSON, withLeaflet} from 'react-leaflet';
import PropTypes from 'prop-types';
import _ from "lodash";
import L from "leaflet";
import constants from "../../constants";

import {Context} from "@gisatcz/ptr-core";
const HoverContext = Context.getContext('HoverContext');

class VectorLayer extends React.PureComponent {
    static contextType = HoverContext;

    static propTypes = {
        layerKey: PropTypes.string,
        features: PropTypes.array,
        selected: PropTypes.object,
        hovered: PropTypes.object,
        style: PropTypes.object,
        pointSizeInMeters: PropTypes.bool,
        onClick: PropTypes.func
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

    getStyle(feature, hovered) {
        const defaultStyle = mapStyle.getStyleObject(feature.properties, this.props.style);
        const selectedStyle = this.props.selected ? this.getSelectedStyle(feature.properties) : {};

        let hoveredStyle = null;
        if (hovered) {
            hoveredStyle = this.getHoveredStyle();
        }

        const style = {...defaultStyle, ...selectedStyle, ...hoveredStyle};

        return this.getFeatureStyle(feature, style);
    }

    getFeatureStyle(feature, style) {
        let finalStyle = {
            color: style.outlineColor,
            weight: style.outlineWidth,
            opacity: style.outlineOpacity,
            fillColor: style.fill,
            fillOpacity: style.fillOpacity
        };

        // for point features, set radius
        if (feature.geometry.type === 'Point') {
            if (style.size) {
                finalStyle.radius = style.size;
            } else if (style.volume) {
                finalStyle.radius = Math.sqrt(style.volume/Math.PI);
            }
        }

        return finalStyle;
    }

    getSelectedStyle(featureProperties) {
        if (this.props.selected) {
            const featureKey = featureProperties[this.props.fidColumnName];
            let style = null;

            // TODO solve for more than one selection
            _.forIn(this.props.selected, (selection, key) => {
                if (selection.keys && _.includes(selection.keys, featureKey)) {
                    const styleDef = selection.style || constants.vectorLayerDefaultSelectedFeatureStyle;
                    style = {"rules":[{"styles": [styleDef]}]};
                }
            });

            return style ? mapStyle.getStyleObject(featureProperties, style, true) : null;
        } else {
            return null;
        }
    }

    getHoveredStyle() {
        if (this.props.hovered && this.props.hovered.style) {
            const style = {"rules":[{"styles": [this.props.hovered.style]}]};
            return mapStyle.getStyleObject(null, style, true);
        } else {
            return constants.vectorLayerDefaultHoveredFeatureStyle;
        }
    }

    onEachFeature(feature, layer){
        const fid = feature.properties[this.props.fidColumnName];

        layer.on({
            click: (e) => {
                layer.bringToFront();

                if (this.props.onClick) {
                    this.props.onClick(this.props.layerKey, [fid]);
                }
            },
            mousemove: (e) => {
                layer.bringToFront();

                if (this.context && this.context.onHover) {
                    this.context.onHover([fid], {
                        popup: {
                            x: e.originalEvent.pageX,
                            y: e.originalEvent.pageY,
                            fidColumnName: this.props.fidColumnName,
                            data: feature.properties
                        }
                    });
                }
                e.target.setStyle(this.getStyle(feature, true));
            },
            mouseout: (e) => {
                if (this.context && this.context.onHoverOut) {
                    this.context.onHoverOut();
                }
                e.target.setStyle(this.getStyle(feature));
            }
        })
    }

    // render points
    pointToLayer(feature, coord) {
        const options = this.getStyle(feature);

        if (this.props.pointSizeInMeters) {
            return L.circle(coord, options);
        } else {
            return L.circleMarker(coord, options);
        }
    }

    render() {
        return (
            <GeoJSON
                key={this.state.layerKey}
                opacity={this.props.opacity || 1}
                data={this.props.features}
                style={this.getStyle}
                onEachFeature={this.onEachFeature}
                pointToLayer={this.pointToLayer}
            />
        );
    }
}

export default withLeaflet(VectorLayer);