import {
	forEach as _forEach,
	forIn as _forIn,
	includes as _includes,
	isArray as _isArray,
	orderBy as _orderBy,
} from 'lodash';

import {point as turfPoint} from '@turf/helpers';
import nearestPoint from '@turf/nearest-point';
import booleanPointInPolygon from '@turf/boolean-point-in-polygon';
import {mapConstants} from '@gisatcz/ptr-core';

import {CanvasLayer} from './genericCanvasLayer';
import shapes from './shapes/shapes';
import polygons from './shapes/polygons';
import lines from './shapes/lines';
import * as L from 'leaflet';
import {style as styleUtils} from '../../../utils/style';

const LeafletCanvasLayer = CanvasLayer.extend({
	onLayerDidMount: function () {
		this.customEvents = {
			click: this.onLayerClick,
		};
		this._map.on(this.customEvents, this);
	},

	onLayerWillUnmount: function () {
		this._map.off(this.customEvents, this);
	},

	boundsToQuery: function (bounds) {
		return {
			lat: bounds.getSouthWest().lat,
			lng: bounds.getSouthWest().lng,
			width: bounds.getNorthEast().lat - bounds.getSouthWest().lat,
			height: bounds.getNorthEast().lng - bounds.getSouthWest().lng,
		};
	},

	isPointInsideBounds: function (lat, lng, bounds) {
		return (
			lat >= bounds.lat &&
			lat <= bounds.lat + bounds.width &&
			lng >= bounds.lng &&
			lng <= bounds.lng + bounds.height
		);
	},

	onLayerClick: function (e) {
		if (this.props.selectable) {
			var pointsInsideBounds = [];
			var selectedPolygons = [];
			var mousePoint = e.containerPoint;

			const self = this;

			// TODO breakable loop?
			if (_isArray(this.features)) {
				this.features.forEach(feature => {
					const type = feature.original.geometry.type;
					if (type === 'Point') {
						const radius = feature.defaultStyle.size;
						var LatLngBounds = L.latLngBounds(
							this._map.containerPointToLatLng(
								mousePoint.add(L.point(radius, radius))
							),
							this._map.containerPointToLatLng(
								mousePoint.subtract(L.point(radius, radius))
							)
						);
						var BoundingBox = this.boundsToQuery(LatLngBounds);
						var coordinates = feature.original.geometry.coordinates;
						var lat = coordinates[1];
						var lng = coordinates[0];

						if (self.isPointInsideBounds(lat, lng, BoundingBox)) {
							pointsInsideBounds.push(feature.original);
						}
					} else if (type === 'Polygon' || type === 'MultiPolygon') {
						const point = this._map.containerPointToLatLng(
							L.point(mousePoint.x, mousePoint.y)
						);
						const pointFeature = turfPoint([point.lng, point.lat]);
						const insidePolygon = booleanPointInPolygon(
							pointFeature,
							feature.original.geometry
						);
						if (insidePolygon) {
							selectedPolygons.push(feature);
						}
					}
				});

				// select single point
				if (pointsInsideBounds.length) {
					const position = this._map.containerPointToLatLng(mousePoint);
					const nearest = nearestPoint(
						turfPoint([position.lng, position.lat]),
						{type: 'FeatureCollection', features: pointsInsideBounds}
					);
					self.props.onClick(self.props.layerKey, [
						nearest.properties[self.props.fidColumnName],
					]);
				} else if (selectedPolygons.length) {
					self.props.onClick(self.props.layerKey, [
						selectedPolygons[0].original.properties[self.props.fidColumnName],
					]);
				}

				// TODO select single line
			}
		}
	},

	setProps: function (data) {
		this.props = data;
		this.features = this.prepareFeatures(data.features);
		this.needRedraw();
	},

	setPaneZindex: function (paneName, zIndex) {
		let pane = this._map.getPane(paneName);
		if (pane) {
			pane.style.zIndex = zIndex;
		}
	},

	prepareFeatures: function (features) {
		const props = this.props;
		let pointFeatures = [];
		let polygonFeatures = [];
		let lineFeatures = [];

		_forEach(features, feature => {
			const type = feature && feature.geometry && feature.geometry.type;
			const fid =
				feature.id ||
				(props.fidColumnName && feature.properties[props.fidColumnName]);
			const defaultStyle = styleUtils.getDefaultStyleObject(
				feature,
				props.style
			);

			let preparedFeature = {
				original: feature,
				defaultStyle,
				fid,
			};

			if (props.selected && fid) {
				_forIn(props.selected, (selection, key) => {
					if (selection.keys && _includes(selection.keys, fid)) {
						preparedFeature.selected = true;
						preparedFeature.selectedStyle = {
							...defaultStyle,
							...styleUtils.getSelectedStyleObject(selection.style),
						};
					}
				});
			}

			// TODO add support for multipoints and multilines
			if (type === 'Point') {
				pointFeatures.push(preparedFeature);
			} else if (type === 'Polygon' || type === 'MultiPolygon') {
				polygonFeatures.push(preparedFeature);
			} else if (type === 'LineString') {
				lineFeatures.push(preparedFeature);
			}
		});

		// TODO what if diferrent geometry types in one layer?
		if (pointFeatures.length) {
			return _orderBy(
				pointFeatures,
				['defaultStyle.size', 'fid'],
				['desc', 'asc']
			);
		} else if (polygonFeatures.length) {
			if (props.selected) {
				return _orderBy(polygonFeatures, ['selected'], ['desc']);
			} else {
				return polygonFeatures;
			}
		} else if (lineFeatures.length) {
			if (props.selected) {
				return _orderBy(lineFeatures, ['selected'], ['desc']);
			} else {
				return lineFeatures;
			}
		} else {
			return null;
		}
	},

	onDrawLayer: function (params) {
		let context = params.canvas.getContext('2d');
		context.clearRect(0, 0, params.canvas.width, params.canvas.height);
		if (this.features) {
			// clear whole layer
			context.drawImage(this.renderOffScreen(params), 0, 0);
		}
	},

	renderOffScreen: function (params) {
		let pixelSizeInMeters = null;
		var offScreenCanvas = document.createElement('canvas');
		offScreenCanvas.width = params.canvas.width;
		offScreenCanvas.height = params.canvas.height;
		var context = offScreenCanvas.getContext('2d');

		if (!params.layer.props.pointAsMarker) {
			pixelSizeInMeters = mapConstants.getPixelSizeInLevelsForLatitude(
				mapConstants.pixelSizeInLevels,
				0
			)[params.zoom];
		}

		// redraw all features
		for (let i = 0; i < this.features.length; i++) {
			const feature = this.features[i];
			const omitFeature =
				this.props.omittedFeatureKeys?.length &&
				_includes(this.props.omittedFeatureKeys, feature.fid);

			if (!omitFeature) {
				this.drawFeature(
					context,
					params.layer,
					params.canvas,
					feature,
					pixelSizeInMeters
				);
			}
		}

		return offScreenCanvas;
	},

	/**
	 * @param ctx {Object} Canvas context
	 * @param layer {Object}
	 * @param canvas {Object}
	 * @param feature {Object} Feature data
	 * @param pixelSizeInMeters {number | null}
	 */
	drawFeature: function (ctx, layer, canvas, feature, pixelSizeInMeters) {
		const geometry = feature.original.geometry;
		const type = geometry.type;

		// TODO multipoints multilines
		if (type === 'Point') {
			const coordinates = geometry.coordinates;
			const center = layer._map.latLngToContainerPoint([
				coordinates[1],
				coordinates[0],
			]);

			if (
				center.x >= 0 &&
				center.y >= 0 &&
				center.x <= canvas.width &&
				center.y <= canvas.height
			) {
				let style = feature.defaultStyle;

				if (feature.selected) {
					style = feature.selectedStyle;
				}

				shapes.draw(ctx, center, style, pixelSizeInMeters);
			}
		} else if (type === 'Polygon' || type === 'MultiPolygon') {
			let coordinates = null;
			let style = feature.defaultStyle;

			if (feature.selected) {
				style = feature.selectedStyle;
			}

			if (type === 'Polygon') {
				coordinates = this.getPolygonCoordinates(geometry.coordinates, layer);
				polygons.drawPolygon(ctx, coordinates, style);
			} else {
				coordinates = geometry.coordinates.map(polygon =>
					this.getPolygonCoordinates(polygon, layer)
				);
				polygons.drawMultiPolygon(ctx, coordinates, style);
			}
		} else if (type === 'LineString') {
			let coordinates = null;
			let style = feature.defaultStyle;

			if (feature.selected) {
				style = feature.selectedStyle;
			}

			coordinates = this.getLineCoordinates(geometry.coordinates, layer);
			lines.drawLine(ctx, coordinates, style);
		}
	},

	getPolygonCoordinates: function (polygon, layer) {
		return polygon.map(linearRing =>
			this.getLineCoordinates(linearRing, layer)
		);
	},

	getLineCoordinates: function (line, layer) {
		return line.map(coordinates => {
			// TODO do not add the same points again?
			return layer._map.latLngToContainerPoint([
				coordinates[1],
				coordinates[0],
			]);
		});
	},
});

export default LeafletCanvasLayer;
