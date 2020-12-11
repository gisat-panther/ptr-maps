import React from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import {withLeaflet} from "react-leaflet";
import memoize from "memoize-one";
import {utils} from "@gisatcz/ptr-utils";

const geojsonRbush = require('geojson-rbush').default;

function getBbox(map) {
    const calculatedBbox = map.getBounds();
    const northEastGeo = calculatedBbox._northEast;
    const southWestGeo = calculatedBbox._southWest;
    const northEastProjected = map.latLngToLayerPoint(northEastGeo);
    const southWestProjected = map.latLngToLayerPoint(southWestGeo);
    const corners = [
        map.layerPointToLatLng([northEastProjected.x, northEastProjected.y]),
        map.layerPointToLatLng([northEastProjected.x, southWestProjected.y]),
        map.layerPointToLatLng([southWestProjected.x, northEastProjected.y]),
        map.layerPointToLatLng([southWestProjected.x, southWestProjected.y])
    ];
    return [_.minBy(corners, 'lng').lng, _.minBy(corners, 'lat').lat, _.maxBy(corners, 'lng').lng, _.maxBy(corners, 'lat').lat];
}

class IndexedVectorLayer extends React.PureComponent {
    static propTypes = {
        boxRangeRange: PropTypes.array,
        component: PropTypes.oneOfType([
			PropTypes.func,
			PropTypes.object
		]),
		omittedFeatureKeys: PropTypes.array
    };

    constructor(props) {
        super(props);

        this.state = {
            rerender: null
        }

		this.indexTree = geojsonRbush();
        this.repopulateIndexTreeIfNeeded = memoize((features) => {
        	if (features) {
				this.indexTree.clear();
				this.indexTree.load(features);
			}
		});
    }

	componentDidUpdate(prevProps, prevState, snapshot) {
		// TODO fix for map view controlled from outside of the map
		setTimeout(() => {
			const bbox = getBbox(this.props.leaflet.map);
			if (JSON.stringify(this.bbox) !== JSON.stringify(bbox)) {
				this.setState({
					rerender: utils.uuid()
				});
			}
		}, 20)
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
    	const {view, zoom, component, ...props} = this.props;

        if (props.features && this.boxRangeFitsLimits()) {
        	this.repopulateIndexTreeIfNeeded(props.features);

			// Bounding box in GeoJSON format
			this.bbox = getBbox(props.leaflet.map);
			const geoJsonBbox = {
				type: "Feature",
				bbox: this.bbox
			};

            // Find features in given bounding box
            const foundFeatureCollection = this.indexTree.search(geoJsonBbox);
            const foundFeatures = foundFeatureCollection && foundFeatureCollection.features || [];

            // Add filtered features only to Vector layer
			if (props.features.length !== foundFeatures.length) {
				props.features = foundFeatures;
			}

            return React.createElement(component, props);
        } else {
            return null;
        }

    }
}

export default withLeaflet(IndexedVectorLayer);
