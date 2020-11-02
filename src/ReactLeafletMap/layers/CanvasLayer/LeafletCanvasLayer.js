import helpers from "../VectorLayer/helpers";
import genericCanvasLayer from "./genericCanvasLayer";


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
		var mousePoint = e.containerPoint;
		var LatLngBounds = L.latLngBounds(this._map.containerPointToLatLng(mousePoint.add(L.point(10, 10))),
			this._map.containerPointToLatLng(mousePoint.subtract(L.point(10, 10))))
		var BoundingBox = this.boundsToQuery(LatLngBounds)

		const self = this;
		this.features.forEach(feature => {
			var coordinates = feature.geometry.coordinates;
			var lat = coordinates[1];
			var lng = coordinates[0];

			if (self.isPointInsideBounds(lat, lng, BoundingBox)) {
				self.props.onClick(self.props.layerKey, [feature.properties[self.props.fidColumnName]])
			}
		});
	},

	setProps: function(data) {
		this.props = data;
		this.features = data.features;
		this.needRedraw();
	},

	setPane: function(paneName) {
		this._map.getPanes().overlayPane.removeChild(this._canvas);
		var pane = this._map.getPane(paneName);

		if (pane === undefined) {
			this._map.createPane(paneName);
		}
		this._map.getPane(paneName).appendChild(this._canvas);
	},

	onDrawLayer: function(params) {
		const props = this.props;

		let ctx = params.canvas.getContext('2d');
		ctx.clearRect(0, 0, params.canvas.width, params.canvas.height);
		let canvasOverlay = params.layer;

		for (let i = 0; i < this.features.length; i++) {
			const feature = this.features[i];
			const coordinates = feature.geometry.coordinates;
			const defaultStyle = helpers.getDefaultStyleObject(feature, props.style);

			ctx.fillStyle = defaultStyle.fill;

			// TODO solve selections properly, just for testing for now
			if (props.selected?.testSelection?.keys?.[0] === feature.properties[props.fidColumnName]) {
				ctx.fillStyle = "#ff0000";
			}

			ctx.lineWidth = defaultStyle.outlineWidth;
			ctx.strokeStyle = defaultStyle.outlineColor;
			ctx.globalAlpha = defaultStyle.fillOpacity || defaultStyle.outlineOpacity; // TODO solve opacity properly
			const center = canvasOverlay._map.latLngToContainerPoint([coordinates[1], coordinates[0]]);
			ctx.beginPath();
			ctx.arc(center.x, center.y, defaultStyle.size/2, 0, Math.PI * 2);
			ctx.fill();
			ctx.stroke();
			ctx.closePath();
		}
	}
});

export default LeafletCanvasLayer;