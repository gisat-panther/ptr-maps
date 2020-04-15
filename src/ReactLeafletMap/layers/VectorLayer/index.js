import React from 'react';
import PropTypes from 'prop-types';
import _ from "lodash";
import * as turf from "@turf/turf";
import {mapStyle} from '@gisatcz/ptr-utils';
import {Pane, withLeaflet} from 'react-leaflet';

import constants from "../../../constants";
import Feature from "../Feature";

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
        return mapStyle.getStyleObject(feature.properties, this.props.style);
    }

    getHoveredStyleObject(styleDefinition) {
        if (styleDefinition) {
            const style = {"rules":[{"styles": [styleDefinition]}]};
            return mapStyle.getStyleObject(null, style, true);
        } else {
            return constants.vectorLayerDefaultHoveredFeatureStyle;
        }
    }

    getSelectedStyleObject(styleDefinition) {
        if (styleDefinition) {
            const style = {"rules":[{"styles": [styleDefinition]}]};
            return mapStyle.getStyleObject(null, style, true);
        } else {
            return constants.vectorLayerDefaultSelectedFeatureStyle;
        }
    }

    getSelectedHoveredStyleObject(styleDefinition) {
        if (styleDefinition) {
            const style = {"rules":[{"styles": [styleDefinition]}]};
            return mapStyle.getStyleObject(null, style, true);
        } else {
            return constants.vectorLayerDefaultSelectedHoveredFeatureStyle;
        }
    }

    getFeatureDefaultStyle(feature, defaultStyleObject) {
        return this.getFeatureLeafletStyle(feature, defaultStyleObject);
    }

    getFeatureAccentedStyle(feature, defaultStyleObject, accentedStyleObject) {
        const style = {...defaultStyleObject, ...accentedStyleObject};
        return this.getFeatureLeafletStyle(feature, style);
    }

    getFeatureLeafletStyle(feature, style) {
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

    onFeatureClick(fid) {
        if (this.props.onClick) {
            this.props.onClick(this.props.layerKey, [fid])
        }
    }

    prepareData(features) {
        if (features) {
            // TODO what about layers with mixed geometry type?
            const isPointLayer = features[0].geometry.type === "Point";
            const isPolygonLayer = features[0].geometry.type === "Polygon" || features[0].geometry.type === "MultiPolygon";

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
                const hoveredStyleObject = this.getHoveredStyleObject(this.props.hovered && this.props.hovered.style);
                const hoveredStyle = this.getFeatureAccentedStyle(feature, defaultStyleObject, hoveredStyleObject);

                // Prepare selected and selected hovered style, if selected
                if (selected) {
                    const selectedStyleObject = this.getSelectedStyleObject(selected.style);
                    const selectedHoveredStyleObject = this.getSelectedHoveredStyleObject(selected.hoveredStyle)
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
                {data.map((item) => this.renderFeature(item))}
            </Pane>
        ) : null;
    }

    renderFeature(data) {
        return (
            <Feature
                key={data.fid}
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

export default withLeaflet(VectorLayer);