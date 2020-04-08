import React from 'react';
import {Circle, Polygon, FeatureGroup, Pane, withLeaflet} from 'react-leaflet';
import PropTypes from 'prop-types';
import _ from "lodash";
import {Context} from "@gisatcz/ptr-core";
const HoverContext = Context.getContext('HoverContext');

class DiagramFeature extends React.PureComponent {
    static contextType = HoverContext;

    static propTypes = {
        feature: PropTypes.object,
        fidColumnName: PropTypes.string,
        areaDefaultStyle: PropTypes.object,
        areaHoveredStyle: PropTypes.object,
        areaLeafletCoordinates: PropTypes.array,
        diagramDefaultStyle: PropTypes.object,
        diagramHoveredStyle: PropTypes.object,
        diagramLeafletCoordinates: PropTypes.array
    };

    constructor(props) {
        super(props);

        this.onClick = this.onClick.bind(this);
        this.onMouseMove = this.onMouseMove.bind(this);
        this.onMouseOut = this.onMouseOut.bind(this);

        this.state = {
            areaStyle: props.areaDefaultStyle,
            diagramStyle: props.diagramDefaultStyle
        }
    }

    onClick(event) {
        if (event.target && event.target._layers) {
            _.forEach(event.target._layers, layer => layer.bringToFront());
        }

        const fid = this.props.feature.properties[this.props.fidColumnName];
        if (this.props.onClick && fid) {
            this.props.onClick(fid);
        }
    }

    onMouseMove(event) {
        // show feature on the top of others
        if (event.target && event.target._layers) {
            _.forEach(event.target._layers, layer => layer.bringToFront());
        }

        if (this.context && this.context.onHover) {
            const fid = this.props.feature.properties[this.props.fidColumnName];
            this.context.onHover([fid], {
                popup: {
                    x: event.originalEvent.pageX,
                    y: event.originalEvent.pageY,
                    fidColumnName: this.props.fidColumnName,
                    data: this.props.feature.properties
                }
            });
        }

        if (this.state.areaStyle !== this.props.areaHoveredStyle || this.state.diagramStyle !== this.props.diagramHoveredStyle) {
            this.setState({
                areaStyle: this.props.areaHoveredStyle,
                diagramStyle: this.props.diagramHoveredStyle
            });
        }
    }

    onMouseOut() {
        if (this.context && this.context.onHoverOut) {
            this.context.onHoverOut();
        }

        if (this.state.areaStyle !== this.props.areaDefaultStyle || this.state.diagramStyle !== this.props.diagramDefaultStyle) {
            this.setState({
                areaStyle: this.props.areaDefaultStyle,
                diagramStyle: this.props.diagramDefaultStyle
            });
        }
    }

    render() {
        return (
            <FeatureGroup
                onMouseMove={this.onMouseMove}
                onMouseOut={this.onMouseOut}
            >
                {this.renderGeometry()}
                {this.renderDiagram()}
            </FeatureGroup>
        );
    }

    renderGeometry() {
        return (
            <Polygon
                positions={this.props.areaLeafletCoordinates}
                {...this.state.areaStyle}
            />
        );
    }

    renderDiagram() {
        return (
            <Pane>
                <Circle
                    center={this.props.diagramLeafletCoordinates}
                    {...this.state.diagramStyle}
                />
            </Pane>
        );
    }
}

export default withLeaflet(DiagramFeature);