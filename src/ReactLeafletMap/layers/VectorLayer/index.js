import React from 'react';
import PropTypes from 'prop-types';
import _ from "lodash";
import * as turf from "@turf/turf";
import {mapStyle} from '@gisatcz/ptr-utils';
import {Pane} from 'react-leaflet';

import Feature from "./Feature";
import constants from "../../../constants";

class VectorLayer extends React.PureComponent {
    static propTypes = {
        layerKey: PropTypes.string,
        features: PropTypes.array,
        selected: PropTypes.object,
        hovered: PropTypes.object,
        style: PropTypes.object,
        pointAsMarker: PropTypes.bool,
        onClick: PropTypes.func
    };

    constructor(props) {
        super(props);
        this.onFeatureClick = this.onFeatureClick.bind(this);
    }

    getDefaultStyleObject(feature) {
        return mapStyle.getStyleObject(feature.properties, this.props.style || constants.vectorFeatureStyle.defaultFull);
    }


    getFeatureDefaultStyle(feature, defaultStyleObject) {
        return this.getFeatureLeafletStyle(feature, defaultStyleObject);
    }

    getFeatureAccentedStyle(feature, defaultStyleObject, accentedStyleObject) {
        const style = {...defaultStyleObject, ...accentedStyleObject};
        return this.getFeatureLeafletStyle(feature, style);
    }

    getFeatureLeafletStyle(feature, style) {
        let finalStyle = {};

        finalStyle.color = style.outlineColor ? style.outlineColor : null;
        finalStyle.weight = style.outlineWidth ? style.outlineWidth : 0;
        finalStyle.opacity = style.outlineOpacity ? style.outlineOpacity : 1;
        finalStyle.fillOpacity = style.fillOpacity ? style.fillOpacity : 1;
        finalStyle.fillColor = style.fill;

        if (!style.fill) {
            finalStyle.fillColor = null;
            finalStyle.fillOpacity = 0;
        }

        if (!style.outlineColor || !style.outlineWidth) {
            finalStyle.color = null;
            finalStyle.opacity = 0;
            finalStyle.weight = 0;
        }

        // for point features, set radius
        if (feature.geometry.type === 'Point') {
            if (style.size) {
                finalStyle.radius = style.size;
            } else if (style.volume) {
                finalStyle.radius = Math.sqrt(style.volume/Math.PI);
            }
        }

        if (style.shape) {
            finalStyle.shape = style.shape;
        }

        return finalStyle;
    }

    onFeatureClick(fid) {
        if (this.props.onClick) {
            this.props.onClick(this.props.layerKey, [fid])
        }
    }

    prepareData(features) {
        if (features) {
            // TODO what about layers with mixed geometry type?
            const isPointLayer = features[0] && features[0].geometry.type === "Point";
            const isPolygonLayer = features[0] && features[0].geometry.type === "Polygon" || features[0] && features[0].geometry.type === "MultiPolygon";

            let data = [];
            _.forEach(features, (feature) => {
                const fid = this.props.fidColumnName && feature.properties[this.props.fidColumnName];

                let selected = null;
                let selectedStyle = null;
                let selectedHoveredStyle = null;
                if (this.props.selected && fid) {
                    _.forIn(this.props.selected, (selection, key) => {
                        if (selection.keys && _.includes(selection.keys, fid)) {
                            selected = selection;
                        }
                    });
                }

                // Flip coordinates due to different leaflet implementation
                const flippedFeature = turf.flip(feature);
                const leafletCoordinates = flippedFeature && flippedFeature.geometry && flippedFeature.geometry.coordinates;

                // Prepare default style
                const defaultStyleObject = this.getDefaultStyleObject(feature);
                const defaultStyle = this.getFeatureDefaultStyle(feature, defaultStyleObject);

                // Prepare hovered style
                const hoveredStyleObject = (this.props.hovered && this.props.hovered.style) || constants.vectorFeatureStyle.hovered;
                const hoveredStyle = this.getFeatureAccentedStyle(feature, defaultStyleObject, hoveredStyleObject);

                // Prepare selected and selected hovered style, if selected
                if (selected) {
                    const selectedStyleObject = selected.style || constants.vectorFeatureStyle.selected;
                    const selectedHoveredStyleObject = selected.hoveredStyle || constants.vectorFeatureStyle.selectedHovered;
                    selectedStyle = this.getFeatureAccentedStyle(feature, defaultStyleObject, selectedStyleObject);
                    selectedHoveredStyle = this.getFeatureAccentedStyle(feature, defaultStyleObject, selectedHoveredStyleObject);
                }

                data.push({
                    feature,
                    fid,
                    selected: !!selected,
                    defaultStyle,
                    hoveredStyle,
                    selectedStyle,
                    selectedHoveredStyle,
                    leafletCoordinates
                });
            });

            // sort points by size to display smaller points on the top
            if (isPointLayer) {
                return _.orderBy(data, ['defaultStyle.radius'], ['desc']);
            }

            // sort polygons - selected to the top
            else if (isPolygonLayer && this.props.selected) {
                return _.orderBy(data, ['selected'], ['asc']);
            }

            else {
                return data;
            }

        } else {
            return null;
        }
    }

    render() {
        const data = this.prepareData(this.props.features);

        return data ? (
            <Pane>
                {data.map((item, index) => this.renderFeature(item, index))}
            </Pane>
        ) : null;
    }

    renderFeature(data, index) {
        return (
            <Feature
                key={data.fid || index}
                onClick={this.onFeatureClick}
                fid={data.fid}
                fidColumnName={this.props.fidColumnName}
                leafletCoordinates={data.leafletCoordinates}
                feature={data.feature}
                type={data.feature.geometry.type}
                pointAsMarker={this.props.pointAsMarker}
                selected={data.selected}
                defaultStyle={data.defaultStyle}
                hoveredStyle={data.hoveredStyle}
                selectedStyle={data.selectedStyle}
                selectedHoveredStyle={data.selectedHoveredStyle}
            />
        );
    }
}

export default VectorLayer;