import React from 'react';
import PropTypes from 'prop-types';
import {withLeaflet} from "react-leaflet";
import {utils} from "@gisatcz/ptr-utils";

const geojsonRbush = require('geojson-rbush').default;

class IndexedVectorLayer extends React.PureComponent {
    static propTypes = {
        boxRangeRange: PropTypes.array,
        component: PropTypes.func
    };

    constructor(props) {
        super(props);

        this.indexTree = geojsonRbush();
        this.state = {
            treeStateKey: null
        }
    }

    componentDidMount() {
        this.indexFeatures();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        // TODO naive cleaning and populating whole tree on each change in features
        if (this.props.features !== prevProps.features) {
            this.indexTree.clear();
            this.indexFeatures();
        }
    }

    indexFeatures() {
        this.indexTree.load(this.props.features);
        this.setState({
            treeStateKey: utils.uuid()
        });
    }

    boxRangeFitsLimits() {
        const props = this.props;
        if (props.boxRangeRange) {
            const minBoxRange = props.boxRangeRange[0];
            const maxBoxRange = props.boxRangeRange[1];
            if (minBoxRange && maxBoxRange) {
                return minBoxRange <= props.view.boxRange && maxBoxRange >= props.view.boxRange;
            } else if (minBoxRange) {
                return minBoxRange <= props.view.boxRange;
            } else if (maxBoxRange) {
                return maxBoxRange >= props.view.boxRange;
            }
        } else {
            return true;
        }
    }

    render() {
        if (this.state.treeStateKey && this.boxRangeFitsLimits()) {

            // TODO if view was changed from outside, leaflet.map still has old bounds
            // Current view bounding box in leaflet format
            const bbox = this.props.leaflet.map.getBounds();

            // Bounding box in GeoJSON format
            const geoJsonBbox = {
                type: "Feature",
                bbox: [bbox._southWest.lng, bbox._southWest.lat, bbox._northEast.lng, bbox._northEast.lat]
            };

            // Find features in given bounding box
            const foundFeatureCollection = this.indexTree.search(geoJsonBbox);
            const foundFeatures = foundFeatureCollection && foundFeatureCollection.features || [];

            // Add filtered features only to Vector layer
            const props = {...this.props, features: foundFeatures};

            return React.createElement(this.props.component, props);
        } else {
            return null;
        }

    }
}

export default withLeaflet(IndexedVectorLayer);