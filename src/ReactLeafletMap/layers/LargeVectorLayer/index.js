import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import VectorLayer from "../VectorLayer";
import {withLeaflet} from "react-leaflet";
import {utils} from "@gisatcz/ptr-utils";

const geojsonRbush = require('geojson-rbush').default;

class LargeVectorLayer extends React.PureComponent {
    static propTypes = {

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
        console.log("Indexing...");
        this.indexTree.load(this.props.features);
        this.setState({
            treeStateKey: utils.uuid()
        });
    }

    render() {
        if (this.state.treeStateKey && this.props.maxBoxRange && this.props.maxBoxRange >= this.props.view.boxRange) {
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

            return <VectorLayer {...props}/>
        } else {
            return null;
        }

    }
}

export default withLeaflet(LargeVectorLayer);