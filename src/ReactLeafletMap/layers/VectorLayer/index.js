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
            let pointFeatures = [];
            let polygonFeatures = [];
            let lineFeatures = [];

            let sortedPointFeatures = null;
            let sortedPolygonFeatures = null;

            _.forEach(features, (feature) => {
                const type = feature && feature.geometry && feature.geometry.type;

                if (type) {
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
                    let hoveredStyleObject = null;
                    let hoveredStyle = null;
                    if (this.props.hovered?.style) {
                        hoveredStyleObject = this.props.hovered.style === "default" ? constants.vectorFeatureStyle.hovered : this.props.hovered.style;
                        hoveredStyle = this.getFeatureAccentedStyle(feature, defaultStyleObject, hoveredStyleObject);
                    }

                    // Prepare selected and selected hovered style, if selected
                    if (selected) {
                        let selectedStyleObject, selectedHoveredStyleObject = null;
                        if (selected.style) {
                            selectedStyleObject = selected.style === "default" ? constants.vectorFeatureStyle.selected : selected.style;
                            selectedStyle = this.getFeatureAccentedStyle(feature, defaultStyleObject, selectedStyleObject);
                        }
                        if (selected.hoveredStyle) {
                            selectedHoveredStyleObject = selected.hoveredStyle === "default" ? constants.vectorFeatureStyle.selectedHovered : selected.hoveredStyle;
                            selectedHoveredStyle = this.getFeatureAccentedStyle(feature, defaultStyleObject, selectedHoveredStyleObject);
                        }
                    }

                    const data = {
                        feature,
                        fid,
                        hoverable: this.props.hoverable,
                        selectable: this.props.selectable,
                        selected: !!selected,
                        defaultStyle,
                        hoveredStyle,
                        selectedStyle,
                        selectedHoveredStyle,
                        leafletCoordinates
                    };

                    switch (type) {
                        case "Point":
                        case "MultiPoint":
                            pointFeatures.push(data);
                            break;
                        case "Polygon":
                        case "MultiPolygon":
                            polygonFeatures.push(data);
                            break;
                        case "LineString":
                        case "MultiLineString":
                            lineFeatures.push(data);
                            break;
                        default:
                            break;
                    }
                }
            });

            // sort point features by radius
            if (pointFeatures.length) {
                sortedPointFeatures = _.orderBy(pointFeatures, ['defaultStyle.radius'], ['desc']);
            }

            // sort polygon features, if selected
            if (polygonFeatures.length) {
                if (this.props.selected) {
                    sortedPolygonFeatures = _.orderBy(polygonFeatures, ['selected'], ['asc']);
                } else {
                    sortedPolygonFeatures = polygonFeatures;
                }
            }

            return {
                polygons: sortedPolygonFeatures,
                points: sortedPointFeatures,
                lines: lineFeatures
            }
        } else {
            return null;
        }
    }

    render() {
        const data = this.prepareData(this.props.features);
        const style = this.props.opacity ? {opacity: this.props.opacity} : null;

        return data ? (
            <>
                <Pane style={style}>
                    {data.polygons ? (data.polygons.map((item, index) => this.renderFeature(item, index))) : null}
                </Pane>
                <Pane style={style}>
                    {data.lines ? (data.lines.map((item, index) => this.renderFeature(item, index))) : null}
                </Pane>
                <Pane style={style}>
                    {data.points ? (data.points.map((item, index) => this.renderFeature(item, index))) : null}
                </Pane>
            </>
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
                selectable={data.selectable}
                hoverable={data.hoverable}
                defaultStyle={data.defaultStyle}
                hoveredStyle={data.hoveredStyle}
                selectedStyle={data.selectedStyle}
                selectedHoveredStyle={data.selectedHoveredStyle}
            />
        );
    }
}

export default VectorLayer;