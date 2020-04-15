import React from 'react';
import {mapStyle, utils} from '@gisatcz/ptr-utils';
import {Pane, withLeaflet} from 'react-leaflet';
import PropTypes from 'prop-types';
import _ from "lodash";
import constants from "../../../constants";

import * as turf from "@turf/turf";
import Diagram from "./Diagram";
import Area from "./Area";

class DiagramLayer extends React.PureComponent {
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
        this.getStyle = this.getStyle.bind(this);
        this.onFeatureClick = this.onFeatureClick.bind(this);
    }

    getStyle(feature, hovered, isDiagram) {
        const defaultStyle = mapStyle.getStyleObject(feature.properties, this.props.style);
        const selectedStyle = this.props.selected ? this.getSelectedStyle(feature.properties, isDiagram) : {};

        let hoveredStyle = null;
        if (hovered) {
            hoveredStyle = this.getHoveredStyle(isDiagram);
        }

        const style = {...defaultStyle, ...selectedStyle, ...hoveredStyle};

        return isDiagram ? this.getDiagramStyle(style) : this.getFeatureStyle(feature, style);
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

    getDiagramStyle(style) {
        let finalStyle = {
            color: style.diagramOutlineColor,
            weight: style.diagramOutlineWidth,
            opacity: style.diagramOutlineOpacity,
            fillColor: style.diagramFill,
            fillOpacity: style.diagramFillOpacity
        };

        if (style.diagramSize) {
            finalStyle.radius = style.diagramSize;
        } else if (style.diagramVolume) {
            finalStyle.radius = Math.sqrt(style.diagramVolume/Math.PI);
        }

        return finalStyle;
    }

    getSelectedStyle(featureProperties, isDiagram) {
        if (this.props.selected) {
            const featureKey = featureProperties[this.props.fidColumnName];
            let style = null;

            // TODO solve for more than one selection
            _.forIn(this.props.selected, (selection, key) => {
                if (selection.keys && _.includes(selection.keys, featureKey)) {
                    const styleDef = selection.style || (isDiagram ? constants.vectorLayerDefaultSelectedDiagramStyle : constants.vectorLayerDefaultSelectedFeatureStyle);
                    style = {"rules":[{"styles": [styleDef]}]};
                }
            });

            return style ? mapStyle.getStyleObject(featureProperties, style, true) : null;
        } else {
            return null;
        }
    }

    getHoveredStyle(isDiagram) {
        if (this.props.hovered && this.props.hovered.style) {
            const style = {"rules":[{"styles": [this.props.hovered.style]}]};
            return mapStyle.getStyleObject(null, style, true);
        } else {
            return isDiagram ? constants.vectorLayerDefaultHoveredDiagramStyle : constants.vectorLayerDefaultHoveredFeatureStyle;
        }
    }

    onFeatureClick(fid) {
        if (this.props.onClick) {
            this.props.onClick(this.props.layerKey, [fid])
        }
    }

    prepareData(features) {
        if (features) {
            let data = [];

            _.forEach(features, (feature) => {
                const centroid = turf.centerOfMass(feature.geometry);

                // Flip coordinates due to different leaflet implementation
                const flippedFeature = turf.flip(feature);
                const flippedCentroid = turf.flip(centroid);

                const diagramLeafletCoordinates = flippedCentroid && flippedCentroid.geometry && flippedCentroid.geometry.coordinates;
                const areaLeafletCoordinates = flippedFeature && flippedFeature.geometry && flippedFeature.geometry.coordinates;

                // Prepare default styles
                const areaDefaultStyle = this.getStyle(feature, false);
                const diagramDefaultStyle = this.getStyle(feature, false, true);

                // Prepare hovered styles
                const areaHoveredStyle = this.getStyle(feature, true);
                const diagramHoveredStyle = this.getStyle(feature, true, true);

                data.push({
                    feature,
                    areaDefaultStyle,
                    areaHoveredStyle,
                    areaLeafletCoordinates,
                    diagramDefaultStyle,
                    diagramHoveredStyle,
                    diagramLeafletCoordinates
                });
            });

            return _.orderBy(data, ['diagramDefaultStyle.radius'], ['desc']);
        } else {
            return null;
        }
    }

    render() {
        const data = this.prepareData(this.props.features);

        return (
            data ? (
                <>
                    <Pane>
                        {data.map((item, index) => this.renderArea(item, index))}
                    </Pane>
                    <Pane>
                        {data.map((item, index) => this.renderDiagram(item, index))}
                    </Pane>
                </>
            ) : null
        );
    }

    renderArea(data, index) {
        return (
            <Area
                key={index}
                onClick={this.onFeatureClick}
                fidColumnName={this.props.fidColumnName}
                defaultStyle={data.areaDefaultStyle}
                hoveredStyle={data.areaHoveredStyle}
                leafletCoordinates={data.areaLeafletCoordinates}
                feature={data.feature}
            />
        );
    }

    renderDiagram(data, index) {
        return (
            <Diagram
                key={index}
                onClick={this.onFeatureClick}
                fidColumnName={this.props.fidColumnName}
                defaultStyle={data.diagramDefaultStyle}
                hoveredStyle={data.diagramHoveredStyle}
                leafletCoordinates={data.diagramLeafletCoordinates}
                feature={data.feature}
            />
        );
    }
}

export default withLeaflet(DiagramLayer);