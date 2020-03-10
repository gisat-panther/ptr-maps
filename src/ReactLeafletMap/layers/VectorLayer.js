import React from 'react';
import {mapStyle, utils} from '@gisatcz/ptr-utils';
import {GeoJSON, withLeaflet } from 'react-leaflet';
import PropTypes from 'prop-types';
import _ from "lodash";
import constants from "../../constants";

class VectorLayer extends React.PureComponent {
    static propTypes = {
        layerKey: PropTypes.string,
        features: PropTypes.array,
        selected: PropTypes.object,
        style: PropTypes.object,
        onClick: PropTypes.func
    };

    constructor(props) {
        super(props);
        this.state = {
            layerKey: utils.uuid()
        };

        this.setStyle = this.setStyle.bind(this);
        this.onEachFeature = this.onEachFeature.bind(this);
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

    setStyle(feature) {
        const defaultStyle = mapStyle.getStyleObject(feature.properties, this.props.style);
        const selectedStyle = this.getSelectedStyle(feature.properties);

        const style = {...defaultStyle, ...selectedStyle};

        return {
            color: style.outlineColor,
            weight: style.outlineWidth,
            opacity: style.outlineOpacity,
            fillColor: style.fill,
            fillOpacity: style.fillOpacity
        }
    }

    getSelectedStyle(featureProperties) {
        if (this.props.selected) {
            const featureKey = featureProperties[this.props.fidColumnName];
            let style = null;

            _.forIn(this.props.selected, (selection, key) => {
                if (selection.keys && _.includes(selection.keys, featureKey)) {
                    style = selection.style || constants.vectorLayerDefaultSelectedFeatureStyle;
                }
            });

            return mapStyle.getStyleObject(featureProperties, style, true);
        } else {
            return null;
        }
    }

    onEachFeature(feature, layer){
        layer.on({
            click: (e) => {
                const fid = feature.properties[this.props.fidColumnName];

                if (this.props.onClick) {
                    this.props.onClick(this.props.layerKey, [fid]);
                }
            }
        })
    }

    render() {
        return (
            <GeoJSON
                key={this.state.layerKey}
                opacity={this.props.opacity || 1}
                data={this.props.features}
                style={this.setStyle}
                onEachFeature={this.onEachFeature}
            />
        );
    }
}

export default withLeaflet(VectorLayer);