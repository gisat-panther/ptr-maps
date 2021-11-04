import React from 'react';
import PropTypes from 'prop-types';
import memoize from 'memoize-one';
import {map as mapUtils} from '@gisatcz/ptr-utils';
import {mapConstants} from '@gisatcz/ptr-core';

const geojsonRbush = require('geojson-rbush').default;

function getBoundingBox(view, width, height, crs, optLat) {
	// TODO extent calculations for non-mercator projections
	if (!crs || crs === 'EPSG:3857') {
		let boxRange = view.boxRange;

		// view.boxRange may differ from actual rance visible in map because of levels
		const calculatedBoxRange = mapUtils.view.getNearestZoomLevelBoxRange(
			width,
			height,
			view.boxRange
		);

		if (boxRange !== calculatedBoxRange) {
			boxRange = calculatedBoxRange;
		}

		return mapUtils.view.getBoundingBoxFromViewForEpsg3857(
			view.center,
			boxRange,
			width / height,
			optLat
		);
	} else {
		return {
			minLat: -90,
			maxLat: 90,
			minLon: -180,
			maxLon: 180,
		};
	}
}

class IndexedVectorLayer extends React.PureComponent {
	static propTypes = {
		boxRangeRange: PropTypes.array,
		component: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
		omittedFeatureKeys: PropTypes.array,
	};

	constructor(props) {
		super(props);

		this.state = {
			rerender: null,
		};

		this.indexTree = geojsonRbush();
		this.repopulateIndexTreeIfNeeded = memoize(features => {
			if (features) {
				this.indexTree.clear();
				this.indexTree.load(features);
			}
		});
	}

	boxRangeFitsLimits() {
		const props = this.props;
		if (props.boxRangeRange) {
			const minBoxRange = props.boxRangeRange[0];
			const maxBoxRange = props.boxRangeRange[1];
			if (minBoxRange && maxBoxRange) {
				return (
					minBoxRange <= props.view.boxRange &&
					maxBoxRange >= props.view.boxRange
				);
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
		const {view, zoom, component, width, height, crs, ...props} = this.props;

		if (props.features && this.boxRangeFitsLimits()) {
			this.repopulateIndexTreeIfNeeded(props.features);
			const bbox = getBoundingBox(
				view,
				width,
				height,
				crs,
				mapConstants.averageLatitude
			);
			const geoJsonBbox = {
				type: 'Feature',
				bbox: [bbox.minLon, bbox.minLat, bbox.maxLon, bbox.maxLat],
			};

			// Find features in given bounding box
			const foundFeatureCollection = this.indexTree.search(geoJsonBbox);
			const foundFeatures =
				(foundFeatureCollection && foundFeatureCollection.features) || [];

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

export default IndexedVectorLayer;
