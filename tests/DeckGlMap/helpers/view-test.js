import {assert} from 'chai';
import viewHelpers from '../../../src/DeckGlMap/helpers/view';

describe('utils/DeckGlMap/helpers/view', function () {
	describe('getZoomLevelFromPixelSize', function () {
		it('should be close to 0', function () {
			const zoomLevel = viewHelpers.getZoomLevelFromPixelSize(1000000);
			assert.approximately(zoomLevel, 0, 0.5);
		});

		it('should be close to 0 again', function () {
			const zoomLevel = viewHelpers.getZoomLevelFromPixelSize(100000);
			assert.approximately(zoomLevel, 0, 0.5);
		});

		it('should be close to 1', function () {
			const zoomLevel = viewHelpers.getZoomLevelFromPixelSize(70000);
			assert.approximately(zoomLevel, 1, 0.5);
		});

		it('should be close to 10', function () {
			const zoomLevel = viewHelpers.getZoomLevelFromPixelSize(120);
			assert.approximately(zoomLevel, 10, 0.5);
		});

		it('should be close to 20', function () {
			const zoomLevel = viewHelpers.getZoomLevelFromPixelSize(0.1);
			assert.approximately(zoomLevel, 20, 0.5);
		});

		it('should be close to 24', function () {
			const zoomLevel = viewHelpers.getZoomLevelFromPixelSize(0.001);
			assert.approximately(zoomLevel, 24, 0.5);
		});
	});

	describe('getZoomLevelFromBoxRange', function () {
		it('should be close to 0', function () {
			const zoomLevel = viewHelpers.getZoomLevelFromBoxRange(
				40000000,
				500,
				500
			);
			assert.approximately(zoomLevel, 0, 0.5);
		});
		it('should be close to 19', function () {
			const zoomLevel = viewHelpers.getZoomLevelFromBoxRange(100, 500, 500);
			assert.approximately(zoomLevel, 19, 0.5);
		});
		it('should be close to 20', function () {
			const zoomLevel = viewHelpers.getZoomLevelFromBoxRange(100, 1000, 1000);
			assert.approximately(zoomLevel, 20, 0.5);
		});
		it('should be close to 24', function () {
			const zoomLevel = viewHelpers.getZoomLevelFromBoxRange(5, 1000, 1000);
			assert.approximately(zoomLevel, 24, 0.5);
		});
		it('should be close to 24 again', function () {
			const zoomLevel = viewHelpers.getZoomLevelFromBoxRange(1, 1000, 1000);
			assert.approximately(zoomLevel, 24, 0.5);
		});
	});

	describe('getBoxRangeFromZoomLevel', function () {
		it('should be close to 50000000', function () {
			const zoomLevel = viewHelpers.getBoxRangeFromZoomLevel(0, 500, 500);
			assert.approximately(zoomLevel, 50000000, 5000000);
		});
		it('should be close to 100', function () {
			const zoomLevel = viewHelpers.getBoxRangeFromZoomLevel(19, 500, 500);
			assert.approximately(zoomLevel, 100, 10);
		});
		it('should be close to 100', function () {
			const zoomLevel = viewHelpers.getBoxRangeFromZoomLevel(20, 1000, 1000);
			assert.approximately(zoomLevel, 100, 10);
		});
		it('should be close to 5', function () {
			const zoomLevel = viewHelpers.getBoxRangeFromZoomLevel(24, 1000, 1000);
			assert.approximately(zoomLevel, 5, 1);
		});
	});

	describe('getDeckViewFromPantherViewParams', function () {
		it('should return expected view', function () {
			const pantherView = {
				boxRange: 100,
				center: {
					lon: 15,
					lat: 50,
				},
			};
			const width = 1000;
			const height = 1000;

			const expectedView = {
				zoom: 20,
				longitude: 15,
				latitude: 50,
				minZoom: 0,
				maxZoom: 19,
			};

			const output = viewHelpers.getDeckViewFromPantherViewParams(
				pantherView,
				width,
				height
			);

			assert.approximately(output.zoom, expectedView.zoom, 0.5);
			assert.approximately(output.minZoom, expectedView.minZoom, 0.5);
			assert.approximately(output.maxZoom, expectedView.maxZoom, 0.5);
			assert.hasAllDeepKeys(output, expectedView);
		});

		it('should return expected view 2', function () {
			const pantherView = {
				boxRange: 100,
				center: {
					lon: 15,
					lat: 50,
				},
			};
			const width = 1000;
			const height = 1000;
			const viewLimits = {
				boxRangeRange: [null, 5000],
			};

			const expectedView = {
				zoom: 20,
				longitude: 15,
				latitude: 50,
				minZoom: 14,
				maxZoom: 19,
			};

			const output = viewHelpers.getDeckViewFromPantherViewParams(
				pantherView,
				width,
				height,
				viewLimits
			);

			assert.approximately(output.zoom, expectedView.zoom, 0.5);
			assert.approximately(output.minZoom, expectedView.minZoom, 0.5);
			assert.approximately(output.maxZoom, expectedView.maxZoom, 0.5);
			assert.hasAllDeepKeys(output, expectedView);
		});

		it('should return expected view 3', function () {
			const pantherView = {
				boxRange: 100,
				center: {
					lon: 15,
					lat: 50,
				},
			};
			const width = 1000;
			const height = 1000;
			const viewLimits = {
				boxRangeRange: [1, 500000000],
			};

			const expectedView = {
				zoom: 20,
				longitude: 15,
				latitude: 50,
				minZoom: 0,
				maxZoom: 19,
			};

			const output = viewHelpers.getDeckViewFromPantherViewParams(
				pantherView,
				width,
				height,
				viewLimits
			);

			assert.approximately(output.zoom, expectedView.zoom, 0.5);
			assert.approximately(output.minZoom, expectedView.minZoom, 0.5);
			assert.approximately(output.maxZoom, expectedView.maxZoom, 0.5);
			assert.hasAllDeepKeys(output, expectedView);
		});
	});
});
