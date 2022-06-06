import {useRef, createElement} from 'react';
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

const IndexedVectorLayer = ({
	view,
	zoom,
	component,
	width,
	height,
	crs,
	boxRangeRange,
	features,
	omittedFeatureKeys,
	style,
	mapKey,
	layerKey,
	uniqueLayerKey,
	onClick,
	opacity,
	resources,
	type,
	zIndex,
	fidColumnName,
	hovered,
	hoverable,
	hoveredStyleDefinition,
	pointAsMarker,
	selectable,
	selected,
}) => {
	const indexTree = useRef(geojsonRbush());
	const repopulateIndexTreeIfNeeded = useRef(
		memoize(features => {
			if (features) {
				indexTree.current?.clear();
				indexTree.current?.load(features);
			}
		})
	);

	const boxRangeFitsLimits = () => {
		if (boxRangeRange) {
			const minBoxRange = boxRangeRange[0];
			const maxBoxRange = boxRangeRange[1];
			if (minBoxRange && maxBoxRange) {
				return minBoxRange <= view.boxRange && maxBoxRange >= view.boxRange;
			} else if (minBoxRange) {
				return minBoxRange <= view.boxRange;
			} else if (maxBoxRange) {
				return maxBoxRange >= view.boxRange;
			}
		} else {
			return true;
		}
	};

	if (features && boxRangeFitsLimits()) {
		repopulateIndexTreeIfNeeded.current(features);
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
		const foundFeatureCollection = indexTree.current.search(geoJsonBbox);
		const foundFeatures =
			(foundFeatureCollection && foundFeatureCollection.features) || [];

		// Add filtered features only to Vector layer
		if (features.length !== foundFeatures.length) {
			features = foundFeatures;
		}

		return createElement(component, {
			view,
			zoom,
			width,
			height,
			crs,
			boxRangeRange,
			features,
			omittedFeatureKeys,
			style,

			mapKey,
			layerKey,
			uniqueLayerKey,
			onClick,
			opacity,
			resources,
			type,
			zIndex,
			fidColumnName,
			hoverable,
			hovered,
			hoveredStyleDefinition,
			pointAsMarker,
			selectable,
			selected,
		});
	} else {
		return null;
	}
};

IndexedVectorLayer.propTypes = {
	view: PropTypes.object,
	zoom: PropTypes.number,
	component: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
	width: PropTypes.number,
	height: PropTypes.number,
	crs: PropTypes.string,
	boxRangeRange: PropTypes.array,
	features: PropTypes.array,
	omittedFeatureKeys: PropTypes.array,
	style: PropTypes.object,
	mapKey: PropTypes.string,
	layerKey: PropTypes.string,
	uniqueLayerKey: PropTypes.string,
	onClick: PropTypes.func,
	opacity: PropTypes.number,
	resources: PropTypes.object,
	type: PropTypes.string,
	zIndex: PropTypes.number,
	fidColumnName: PropTypes.string,
	hovered: PropTypes.object,
	hoverable: PropTypes.bool,
	hoveredStyleDefinition: PropTypes.object,
	pointAsMarker: PropTypes.bool,
	selectable: PropTypes.bool,
	selected: PropTypes.object,
};

export default IndexedVectorLayer;
