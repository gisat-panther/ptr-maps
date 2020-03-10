import React from 'react';
import {mapStyle, utils} from '@gisatcz/ptr-utils';
import {GeoJSON, withLeaflet } from 'react-leaflet';
import PropTypes from 'prop-types';

class VectorLayer extends React.PureComponent {
    static propTypes = {
        features: PropTypes.array,
        style: PropTypes.object
    };

    constructor(props) {
        super(props);
        this.state = {
            layerKey: utils.uuid()
        };

        this.setStyle = this.setStyle.bind(this);
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

    setStyle(feature) {
        const style = mapStyle.getStyleObject(feature.properties, this.props.style);
        return {
            color: style.outlineColor,
            weight: style.outlineWidth,
            opacity: style.outlineOpacity,
            fillColor: style.fill,
            fillOpacity: style.fillOpacity
        }
    }

    render() {
        return (
            <GeoJSON
                key={this.state.layerKey}
                opacity={this.props.opacity || 1}
                data={this.props.features}
                style={this.setStyle}
            />
        );
    }
}

export default withLeaflet(VectorLayer);