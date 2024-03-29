import WorldWind from 'webworldwind-esa';
import {QuadTree, Box, Point, Circle} from 'js-quadtree';
import {
	point as turfPoint,
	featureCollection as turfFeatureCollection,
} from '@turf/helpers';
import nearestPoint from '@turf/nearest-point';
import turfCentroid from '@turf/centroid';
import LargeDataLayerTile from './LargeDataLayerTile';
import {compact as _compact, each as _each} from 'lodash';
import {mapStyle} from '@gisatcz/ptr-utils';

const {Location, REDRAW_EVENT_TYPE, Sector, TiledImageLayer} = WorldWind;

// It supports GeoJSON as format with only points and maximum 1 000 000 points.
// Multipolygons are represented as points

// TODO: Highlight the selected points.
class LargeDataLayer extends TiledImageLayer {
	constructor(wwd, options, layer) {
		super(
			new Sector(-90, 90, -180, 180),
			new Location(45, 45),
			18,
			'image/png',
			layer.key,
			256,
			256
		);

		this.tileWidth = 256;
		this.tileHeight = 256;
		this.detailControl = 1;
		this.wwd = wwd;

		// At the moment the URL must contain the GeoJSON.
		this.processedTiles = {};
		this.quadTree = new QuadTree(new Box(0, 0, 360, 180));

		this.pantherProps = {
			features: options.features,
			fidColumnName: options.fidColumnName,
			hovered: {...options.hovered},
			selected: {...options.selected},
			key: layer.key,
			layerKey: layer.layerKey,
			onHover: options.onHover,
			onClick: options.onClick,
			pointHoverBuffer: options.pointHoverBuffer || mapStyle.DEFAULT_SIZE,
			style: options.style,
			wwd: wwd,
		};

		if (this.pantherProps.features) {
			this.addFeatures(this.pantherProps.features);
		} else {
			this.loadData(options.url);
		}

		this.onClick = this.onClick.bind(this, wwd);
		this.onMouseMove = this.onMouseMove.bind(this, wwd);
		wwd.addEventListener('click', this.onClick);
		wwd.addEventListener('mousemove', this.onMouseMove);
	}

	removeListeners() {
		this.pantherProps.wwd.removeEventListener('click', this.onClick);
		this.pantherProps.wwd.removeEventListener('mousemove', this.onMouseMove);
	}

	loadData(url) {
		fetch(url)
			.then(data => {
				return data.json();
			})
			.then(file => {
				if (file.features.length > 1000000) {
					throw new Error('Too many features.');
				}

				this.addFeatures(file.features);
			});
	}

	addFeatures(features) {
		features.forEach(feature => {
			const type = feature.geometry && feature.geometry.type;
			let point = null;
			let props = {...feature.properties};

			// TODO support other geometry types
			if (type === 'Point') {
				props.centroid = feature.geometry.coordinates;
				point = new Point(
					feature.geometry.coordinates[0] + 180,
					feature.geometry.coordinates[1] + 90,
					props
				);
			} else if (type === 'MultiPoint') {
				const coordinates = feature.geometry.coordinates[0];
				props.centroid = coordinates;
				point = new Point(coordinates[0] + 180, coordinates[1] + 90, props);
			} else if (type === 'MultiPolygon') {
				let centroid = turfCentroid(feature.geometry);
				props.centroid = centroid.geometry.coordinates;
				point = new Point(
					centroid.geometry.coordinates[0] + 180,
					centroid.geometry.coordinates[1] + 90,
					props
				);
			}

			if (point) {
				this.quadTree.insert(point);
			}
		});

		this.refresh();
	}

	handleEvent(wwd, event) {
		const x =
				(event.touches && event.touches[0] && event.touches[0].clientX) ||
				event.clientX,
			y =
				(event.touches && event.touches[0] && event.touches[0].clientY) ||
				event.clientY;

		const pageX =
			(event.touches && event.touches[0] && event.touches[0].pageX) ||
			event.pageX;
		const pageY =
			(event.touches && event.touches[0] && event.touches[0].pageY) ||
			event.pageY;

		const terrainObject = wwd
			.pickTerrain(wwd.canvasCoordinates(x, y))
			.terrainObject();

		let buffer = this.getPointHoverBuffer(wwd);

		if (terrainObject) {
			const position = terrainObject.position;
			let points = this.quadTree.query(
				new Circle(position.longitude + 180, position.latitude + 90, buffer)
			);

			// find nearest
			if (points.length > 1) {
				let targetPoint = turfPoint([position.longitude, position.latitude]);
				let features = points.map(point => {
					return turfPoint([point.data.centroid[0], point.data.centroid[1]], {
						...point,
					});
				});

				let featureCollection = turfFeatureCollection(features);
				let nearest = nearestPoint(targetPoint, featureCollection);
				points = [nearest.properties];
			}

			return {points, x: pageX, y: pageY};
		} else {
			return {points: [], x: pageX, y: pageY};
		}
	}

	onMouseMove(wwd, event) {
		this.onMouseMoveResult(this.handleEvent(wwd, event));
	}

	onClick(wwd, event) {
		this.onClickResult(this.handleEvent(wwd, event));
	}

	onClickResult(data) {
		if (this.pantherProps.onClick) {
			let gids = data.points.map(
				point => point.data[this.pantherProps.fidColumnName]
			);
			if (gids && gids.length) {
				this.pantherProps.onClick(this.pantherProps.layerKey, gids);
			}
		}
	}

	onMouseMoveResult(data) {
		if (this.pantherProps.onHover) {
			let gids = _compact(
				data.points.map(point => point.data[this.pantherProps.fidColumnName])
			);
			this.pantherProps.onHover(
				this.pantherProps.layerKey,
				gids,
				data.x,
				data.y,
				null,
				data.points,
				this.pantherProps.fidColumnName
			);
		}
	}

	retrieveTileImage(dc, tile, suppressRedraw) {
		this.processedTiles[tile.imagePath] = true;

		const sector = tile.sector;
		const extended = this.calculateExtendedSector(sector, 0.2, 0.2);
		const points = this.filterGeographically(extended.sector);

		if (points) {
			var imagePath = tile.imagePath,
				cache = dc.gpuResourceCache,
				layer = this;

			var canvas = this.createPointTile(points, {
				sector: sector,

				width: this.tileWidth,
				height: this.tileHeight,
			}).canvas();

			var texture = layer.createTexture(dc, tile, canvas);
			layer.removeFromCurrentRetrievals(imagePath);

			if (texture) {
				cache.putResource(imagePath, texture, texture.size);

				layer.currentTilesInvalid = true;
				layer.absentResourceList.unmarkResourceAbsent(imagePath);

				if (!suppressRedraw) {
					// Send an event to request a redraw.
					const e = document.createEvent('Event');
					e.initEvent(REDRAW_EVENT_TYPE, true, true);
					window.dispatchEvent(e);
				}
			}
		}
	}

	// TODO Original implementation from @jbalhar
	// retrieveTileImage(dc, tile, suppressRedraw) {
	// 	// if(tile.level.levelNumber < 14 || this.processedTiles[tile.imagePath]){
	// 	// 	return;
	// 	// }
	// 	this.processedTiles[tile.imagePath] = true;
	//
	// 	const sector = tile.sector;
	// 	const extended = this.calculateExtendedSector(sector, 0.2, 0.2);
	// 	const extendedWidth = Math.ceil(extended.extensionFactorWidth * this.tileWidth);
	// 	const extendedHeight = Math.ceil(extended.extensionFactorHeight * this.tileHeight);
	//
	// 	const points = this.filterGeographically(extended.sector);
	//
	// 	if(points) {
	// 		var imagePath = tile.imagePath,
	// 			cache = dc.gpuResourceCache,
	// 			layer = this;
	//
	// 		var canvas = this.createPointTile(points, {
	// 			sector: extended.sector,
	//
	// 			width: this.tileWidth + 2 * extendedWidth,
	// 			height: this.tileHeight + 2 * extendedHeight
	// 		}).canvas();
	//
	// 		var result = document.createElement('canvas');
	// 		result.height = this.tileHeight;
	// 		result.width = this.tileWidth;
	// 		result.getContext('2d').putImageData(
	// 			canvas.getContext('2d').getImageData(extendedWidth, extendedHeight, this.tileWidth, this.tileHeight),
	// 			0, 0
	// 		);
	//
	// 		var texture = layer.createTexture(dc, tile, result);
	// 		layer.removeFromCurrentRetrievals(imagePath);
	//
	// 		if (texture) {
	// 			cache.putResource(imagePath, texture, texture.size);
	//
	// 			layer.currentTilesInvalid = true;
	// 			layer.absentResourceList.unmarkResourceAbsent(imagePath);
	//
	// 			if (!suppressRedraw) {
	// 				// Send an event to request a redraw.
	// 				const e = document.createEvent('Event');
	// 				e.initEvent(REDRAW_EVENT_TYPE, true, true);
	// 				window.dispatchEvent(e);
	// 			}
	// 		}
	// 	}
	// }

	filterGeographically(sector) {
		const width = sector.maxLongitude - sector.minLongitude;
		const height = sector.maxLatitude - sector.minLatitude;
		return this.quadTree.query(
			new Box(sector.minLongitude + 180, sector.minLatitude + 90, width, height)
		);
	}

	calculateExtendedSector(sector, extensionFactorWidth, extensionFactorHeight) {
		var latitudeChange =
			(sector.maxLatitude - sector.minLatitude) * extensionFactorHeight;
		var longitudeChange =
			(sector.maxLongitude - sector.minLongitude) * extensionFactorWidth;
		return {
			sector: new Sector(
				sector.minLatitude - latitudeChange,
				sector.maxLatitude + latitudeChange,
				sector.minLongitude - longitudeChange,
				sector.maxLongitude + longitudeChange
			),
			extensionFactorHeight: extensionFactorHeight,
			extensionFactorWidth: extensionFactorWidth,
		};
	}

	createPointTile(data, options) {
		return new LargeDataLayerTile(
			data,
			options,
			this.pantherProps.style,
			this.pantherProps.fidColumnName,
			this.pantherProps.selected,
			this.pantherProps.hovered
		);
	}

	updateHoveredKeys(hoveredKeys, x, y) {
		this.pantherProps.hovered.keys = hoveredKeys;

		const terrainObject = this.wwd
			.pickTerrain(this.wwd.canvasCoordinates(x, y))
			.terrainObject();

		if (terrainObject) {
			const lat = terrainObject.position.latitude;
			const lon = terrainObject.position.longitude;

			_each(this.currentTiles, tile => {
				const s = tile.sector;
				const prev = this.previousHoveredCoordinates;

				const latDiff = Math.abs(s.maxLatitude - s.minLatitude);
				const lonDiff = Math.abs(s.maxLongitude - s.minLongitude);

				const latBuffer = latDiff / 10;
				const lonBuffer = lonDiff / 10;

				const hovered =
					lat <= s.maxLatitude + latBuffer &&
					lat >= s.minLatitude - latBuffer &&
					lon <= s.maxLongitude + lonBuffer &&
					lon >= s.minLongitude - lonBuffer;
				const previouslyHovered =
					prev &&
					prev.lat <= s.maxLatitude + latBuffer &&
					prev.lat >= s.minLatitude - latBuffer &&
					prev.lon <= s.maxLongitude + lonBuffer &&
					prev.lon >= s.minLongitude - lonBuffer;

				if (hovered || previouslyHovered) {
					this.retrieveTileImage(this.wwd.drawContext, tile, true);
				}
			});

			this.previousHoveredCoordinates = {lat, lon};
		}
	}

	/**
	 * naive point hover buffer determination
	 * @param wwd
	 * @return {number} buffer in degrees
	 */
	getPointHoverBuffer(wwd) {
		const canvasWidth = wwd.canvas.clientWidth;
		const range = wwd.navigator.range;
		const bufferInMeters =
			(range / canvasWidth) * this.pantherProps.pointHoverBuffer;
		return bufferInMeters * 0.00001;
	}
}

export default LargeDataLayer;
