import React from 'react';
import PropTypes from 'prop-types';
import {Circle, Polygon, CircleMarker} from 'react-leaflet';

import {Context} from "@gisatcz/ptr-core";
import _ from "lodash";
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
            hovered: false
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.context && this.context.hoveredItems) {
            if (!this.state.hovered && _.indexOf(this.context.hoveredItems, this.fid) !== -1) {
                this.setState({hovered: true});
            } else if (this.state.hovered && _.indexOf(this.context.hoveredItems, this.fid) === -1) {
                this.setState({hovered: false});
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

        this.setState({hovered: true});
    }

    onMouseOut(event) {
        if (!this.props.selected) {
            this.showOnBottom(event.target);
        }

        if (this.context && this.context.onHoverOut) {
            this.context.onHoverOut();
        }

        this.setState({hovered: false});
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
     * Show feature in the bottom, if it's a polygon
     * @param leafletFeature {Object}
     */
    showOnBottom(leafletFeature) {
        if (leafletFeature && (this.props.type === "Polygon" || this.props.type === "MultiPolygon")) {
            leafletFeature.bringToBack();
        }
    }

    render() {
        let style = this.props.defaultStyle;

        if (this.props.selected && this.state.hovered) {
            style = this.props.selectedHoveredStyle;
        } else if (this.state.hovered) {
            style = this.props.hoveredStyle;
        } else if (this.props.selected) {
            style = this.props.selectedStyle;
        }

        // TODO add support for other geometry types
        switch (this.props.type) {
            case "Polygon":
            case "MultiPolygon":
                return this.renderPolygon(style);
            case "Point":
                return this.renderPoint(style);
            default:
                return null;
        }
    }

    renderPolygon(style) {
        return (
            <Polygon
                onClick={this.onClick}
                onMouseMove={this.onMouseMove}
                onMouseOut={this.onMouseOut}
                positions={this.props.leafletCoordinates}
                {...style}
            />
        );
    }

    renderPoint(style) {
        if (this.props.pointAsMarker) {
            return (
                <CircleMarker
                    onClick={this.onClick}
                    onMouseMove={this.onMouseMove}
                    onMouseOut={this.onMouseOut}
                    center={this.props.leafletCoordinates}
                    {...style}
                />
            );
        } else {
            return (
                <Circle
                    onClick={this.onClick}
                    onMouseMove={this.onMouseMove}
                    onMouseOut={this.onMouseOut}
                    center={this.props.leafletCoordinates}
                    {...style}
                />
            );
        }
    }
}

export default Feature;