import _ from "lodash";

import helpers from "../VectorLayer/helpers";
import genericCanvasLayer from "./genericCanvasLayer";
import shapes from "./shapes";

const LeafletCanvasLayer = L.CanvasLayer.extend({
	onLayerDidMount: function() {
		this.customEvents = {
			click: this.onLayerClick
		};
		this._map.on(this.customEvents, this);
	},

	onLayerWillUnmount: function() {
		this._map.off(this.customEvents, this);
	},

	boundsToQuery: function(bounds) {
		return {
			lat: bounds.getSouthWest().lat,
			lng: bounds.getSouthWest().lng,
			width: bounds.getNorthEast().lat - bounds.getSouthWest().lat,
			height: bounds.getNorthEast().lng - bounds.getSouthWest().lng
		};
	},

	isPointInsideBounds: function(lat,lng, bounds) {
		return (
			(lat >= bounds.lat) && (lat <= bounds.lat + bounds.width) &&
			(lng >= bounds.lng) && (lng <= bounds.lng + bounds.height)
		);
	},

	onLayerClick: function(e) {
		if (this.props.selectable) {
			var mousePoint = e.containerPoint;

			const self = this;
			this.features.forEach(feature => {
				const radius = feature.defaultStyle.size;
				var LatLngBounds = L.latLngBounds(this._map.containerPointToLatLng(mousePoint.add(L.point(radius, radius))),
					this._map.containerPointToLatLng(mousePoint.subtract(L.point(radius, radius))))
				var BoundingBox = this.boundsToQuery(LatLngBounds)
				var coordinates = feature.original.geometry.coordinates;
				var lat = coordinates[1];
				var lng = coordinates[0];

				if (self.isPointInsideBounds(lat, lng, BoundingBox)) {
					self.props.onClick(self.props.layerKey, [feature.original.properties[self.props.fidColumnName]])
				}
			});
		}
	},

	setProps: function(data) {
		this.props = data;
		this.features = this.prepareFeatures(data.features);
		this.needRedraw();
	},

	prepareFeatures: function (features) {
		const props = this.props;

		let preparedFeatures = features.map(feature => {
			const fid = feature.id || (props.fidColumnName && feature.properties[props.fidColumnName]);
			const defaultStyle = helpers.getDefaultStyleObject(feature, props.style);

			let preparedFeature = {
				original: feature,
				defaultStyle
			};

			if (props.selected && fid) {
				_.forIn(props.selected, (selection, key) => {
					if (selection.keys && _.includes(selection.keys, fid)) {
						preparedFeature.selected = true;
						preparedFeature.selectedStyle = {...defaultStyle, ...helpers.getSelectedStyleObject(selection.style)}
					}
				});
			}

			return preparedFeature;
		});

		return _.orderBy(preparedFeatures, ['defaultStyle.size', 'fid'], ['desc', 'asc']);
	},

	onDrawLayer: function(params) {
		let context = params.canvas.getContext('2d');

		// clear whole layer
		context.clearRect(0, 0, params.canvas.width, params.canvas.height);

		// redraw all features
		for (let i = 0; i < this.features.length; i++) {
			this.drawFeature(context, params.layer, params.canvas, this.features[i]);
		}
	},

	/**
	 * @param ctx {Object} Canvas context
	 * @param layer {Object}
	 * @param canvas {Object}
	 * @param feature {Object} Feature data
	 */
	drawFeature: function (ctx, layer, canvas, feature){
		const geometry = feature.original.geometry;

		// TODO currently supports points only
		if (geometry.type === "Point") {
			const coordinates = geometry.coordinates;
			const center = layer._map.latLngToContainerPoint([coordinates[1], coordinates[0]]);

			if (center.x >= 0 && center.y >= 0 && center.x <= canvas.width && center.y <= canvas.height) {
				let style = feature.defaultStyle;

				if (feature.selected) {
					style = feature.selectedStyle;
				}

				shapes.draw(ctx, center, style);
			}
		}
	}
});

export default LeafletCanvasLayer;