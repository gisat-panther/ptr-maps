import React from 'react';
import {Circle, Polygon, FeatureGroup, Pane, withLeaflet} from 'react-leaflet';
import PropTypes from 'prop-types';
import _ from "lodash";
import {Context} from "@gisatcz/ptr-core";
const HoverContext = Context.getContext('HoverContext');

class Area extends React.PureComponent {
    static contextType = HoverContext;

    static propTypes = {
        feature: PropTypes.object,
        fidColumnName: PropTypes.string,
        defaultStyle: PropTypes.object,
        hoveredStyle: PropTypes.object,
        leafletCoordinates: PropTypes.array
    };

    constructor(props) {
        super(props);

        this.onClick = this.onClick.bind(this);
        this.onMouseMove = this.onMouseMove.bind(this);
        this.onMouseOut = this.onMouseOut.bind(this);

        this.state = {
            style: props.defaultStyle
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        const fid = this.props.feature.properties[this.props.fidColumnName];
        if (this.context && this.context.hoveredItems && _.indexOf(this.context.hoveredItems, fid) !== -1) {
            this.setState({
                style: this.props.hoveredStyle
            });
        } else if (this.state.style !== this.props.defaultStyle) {
            this.setState({
                style: this.props.defaultStyle
            });
        }
    }

    onClick(event) {
        if (event.target) {
            event.target.bringToFront();
        }

        const fid = this.props.feature.properties[this.props.fidColumnName];
        if (this.props.onClick && fid) {
            this.props.onClick(fid);
        }
    }

    onMouseMove(event) {
        // show feature on the top of others
        if (event.target) {
            event.target.bringToFront();
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

        if (this.state.style !== this.props.hoveredStyle) {
            this.setState({
                style: this.props.hoveredStyle
            });
        }
    }

    onMouseOut() {
        if (this.context && this.context.onHoverOut) {
            this.context.onHoverOut();
        }

        if (this.state.style !== this.props.defaultStyle) {
            this.setState({
                style: this.props.defaultStyle
            });
        }
    }

    render() {
        return (
            <Polygon
                onMouseMove={this.onMouseMove}
                onMouseOut={this.onMouseOut}
                positions={this.props.leafletCoordinates}
                {...this.state.style}
            />
        );
    }
}

export default withLeaflet(Area);