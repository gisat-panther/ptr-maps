import React from 'react';
import {Circle, withLeaflet} from 'react-leaflet';
import PropTypes from 'prop-types';
import _ from "lodash";
import {Context} from "@gisatcz/ptr-core";
const HoverContext = Context.getContext('HoverContext');

class Diagram extends React.PureComponent {
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

        this.fid = props.fidColumnName && props.feature.properties[props.fidColumnName];

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
        if (this.props.onClick && this.fid) {
            this.props.onClick(this.fid);
        }
    }

    onMouseMove(event) {
        if (this.context && this.context.onHover && this.fid) {
            this.context.onHover([this.fid], {
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
            <Circle
                onMouseMove={this.onMouseMove}
                onMouseOut={this.onMouseOut}
                center={this.props.leafletCoordinates}
                {...this.state.style}
            />
        );
    }
}

export default withLeaflet(Diagram);