import React from 'react';
import {utils} from '@gisatcz/ptr-utils';
import {GeoJSON, withLeaflet} from 'react-leaflet';
import L from "leaflet";
import helpers from "../helpers";

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
    	const styles = helpers.calculateStyle(feature.feature, this.props.styleDefinition, this.props.hoveredStyleDefinition, feature.selected, feature.selectedStyleDefinition, feature.selectedHoveredStyleDefinition);

        if (feature.selected) {
            return styles.selected;
        } else {
        	return styles.default;
		}
    }

    onEachFeature(feature, layer){
        const fid = feature.properties[this.props.fidColumnName] || feature.id;
        const geometryType = feature.geometry.type;
        const isPolygon = geometryType === "Polygon" || geometryType === "MultiPolygon";
        const isLine = geometryType === "Line" || geometryType === "LineString";

		const styles = helpers.calculateStyle(feature.feature, this.props.styleDefinition, this.props.hoveredStyleDefinition, feature.selected, feature.selectedStyleDefinition, feature.selectedHoveredStyleDefinition);

        layer.on({
            click: (e) => {
                if (this.props.onFeatureClick && this.props.selectable) {
                    this.props.onFeatureClick(fid);
                }
            },
            mousemove: (e) => {
                if (this.props.hoverable) {
                    if (feature.selected && styles.selectedHovered) {
                        e.target.setStyle(styles.selectedHovered);
                    } else {
                        e.target.setStyle(styles.hovered);
                    }

                    if (isPolygon ||isLine) {
                        layer.bringToFront();
                    }
                }
            },
            mouseout: (e) => {
                if (this.props.hoverable) {
                    if (feature.selected && styles.selected) {
                        e.target.setStyle(styles.selected);
                    } else {
                        e.target.setStyle(styles.default);
                    }

                    if ((isLine || isPolygon) && !feature.selected) {
                        layer.bringToBack();
                    }
                }
            }
        })
    }

    // render points
    pointToLayer(feature, coord) {
        if (this.props.pointAsMarker) {
            return L.circleMarker(coord, {pane: this.props.paneName});
        } else {
            return L.circle(coord);
        }
    }

    render() {
        const features = this.props.features.map(item => {return {...item.feature, ...item}});
		// console.log("GeoJson render, layerKey: ", this.props.layerKey)

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