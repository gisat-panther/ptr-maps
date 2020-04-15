import React from 'react';
import PropTypes from 'prop-types';
import {Circle, Polygon, withLeaflet, CircleMarker} from 'react-leaflet';

import {Context} from "@gisatcz/ptr-core";
const HoverContext = Context.getContext('HoverContext');

class Feature extends React.PureComponent {
    static contextType = HoverContext;

    static propTypes = {
        feature: PropTypes.object,
        fid: PropTypes.string,
        fidColumnName: PropTypes.string,
        defaultStyle: PropTypes.object,
        hoveredStyle: PropTypes.object,
        selectedStyle: PropTypes.object,
        selectedHoveredStyle: PropTypes.object,
        selected: PropTypes.bool,
        leafletCoordinates: PropTypes.array
    };

    constructor(props) {
        super(props);

        this.onClick = this.onClick.bind(this);
        this.onMouseMove = this.onMouseMove.bind(this);
        this.onMouseOut = this.onMouseOut.bind(this);

        this.fid = props.fid;

        this.state = {
            hovered: false,
            style: props.selected ? props.selectedStyle : props.defaultStyle
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.selected) {
            if (this.state.hovered && this.state.style !== this.props.selectedHoveredStyle) {
                this.setState({style: this.props.selectedHoveredStyle});
            }
        } else {
            if (this.state.hovered && this.state.style !== this.props.hoveredStyle) {
                this.setState({style: this.props.hoveredStyle});
            } else if (!this.state.hovered && this.state.style !== this.props.defaultStyle) {
                this.setState({style: this.props.defaultStyle});
            }
        }
    }

    onClick(event) {
        this.showOnTop(event.target);

        if (this.props.onClick && this.fid) {
            this.props.onClick(this.fid);
        }
    }

    onMouseMove(event) {
        this.showOnTop(event.target);

        if (this.fid && this.context && this.context.onHover) {
            this.context.onHover([this.fid], {
                popup: {
                    x: event.originalEvent.pageX,
                    y: event.originalEvent.pageY,
                    fidColumnName: this.props.fidColumnName,
                    data: this.props.feature.properties
                }
            });
        }

        if (this.props.selected) {
            this.setState({
                hovered: true,
                style: this.props.selectedHoveredStyle
            });
        } else if (this.state.style !== this.props.hoveredStyle) {
            this.setState({
                hovered: true,
                style: this.props.hoveredStyle
            });
        }
    }

    onMouseOut(event) {
        if (this.context && this.context.onHoverOut) {
            this.context.onHoverOut();
        }

        if (this.props.selected) {
            this.setState({
                hovered: false,
                style: this.props.selectedStyle
            });
        } else if (this.state.style !== this.props.defaultStyle) {
            this.showOnBottom(event.target);

            this.setState({
                hovered: false,
                style: this.props.defaultStyle
            });
        }
    }

    /**
     * Show feature on the top of others, if it's not a point
     * @param leafletFeature {Object}
     */
    showOnTop(leafletFeature) {
        if (leafletFeature && this.props.type !== "Point") {
            leafletFeature.bringToFront();
        }
    }

    /**
     * Show feature in the bottom
     * @param leafletFeature {Object}
     */
    showOnBottom(leafletFeature) {
        if (leafletFeature && (this.props.type === "Polygon" || this.props.type === "MultiPolygon")) {
            leafletFeature.bringToBack();
        }
    }

    render() {
        // TODO add support for other geometry types
        switch (this.props.type) {
            case "Polygon":
            case "MultiPolygon":
                return this.renderPolygon();
            case "Point":
                return this.renderPoint();
            default:
                return null;
        }
    }

    renderPolygon() {
        return (
            <Polygon
                onClick={this.onClick}
                onMouseMove={this.onMouseMove}
                onMouseOut={this.onMouseOut}
                positions={this.props.leafletCoordinates}
                {...this.state.style}
            />
        );
    }

    renderPoint() {
        if (this.props.pointAsMarker) {
            return (
                <CircleMarker
                    onClick={this.onClick}
                    onMouseMove={this.onMouseMove}
                    onMouseOut={this.onMouseOut}
                    center={this.props.leafletCoordinates}
                    {...this.state.style}
                />
            );
        } else {
            return (
                <Circle
                    onClick={this.onClick}
                    onMouseMove={this.onMouseMove}
                    onMouseOut={this.onMouseOut}
                    center={this.props.leafletCoordinates}
                    {...this.state.style}
                />
            );
        }
    }
}

export default withLeaflet(Feature);