import {assert} from 'chai';
import {describe, it} from 'mocha';

import viewHelpers from '../../../src/ReactLeafletMap/helpers/view';

describe('ReactLeafletMap/helpers/view', function () {
	describe('getLeafletViewFromViewParams', function () {
		it('return Leaflet view', function () {
			const width = 1000;
			const height = 1000;
			const view = {
				boxRange: 1000,
				center: {
					lat: 50,
					lon: 15,
				},
			};

			const expectedOutput = {
				zoom: 16,
				center: {
					lat: 50,
					lng: 15,
				},
			};

			const output = viewHelpers.getLeafletViewFromViewParams(
				view,
				width,
				height
			);
			assert.deepStrictEqual(output, expectedOutput);
		});
	});

	describe('getLeafletViewportFromViewParams', function () {
		it('return Leaflet viewport', function () {
			const width = 1000;
			const height = 1000;
			const view = {
				boxRange: 1000,
				center: {
					lat: 50,
					lon: 15,
				},
			};

			const expectedOutput = {
				zoom: 16,
				center: [50, 15],
			};

			const output = viewHelpers.getLeafletViewportFromViewParams(
				view,
				width,
				height
			);
			assert.deepStrictEqual(output, expectedOutput);
		});
	});

	describe('getPantherViewFromLeafletViewParams', function () {
		it('return Leaflet view', function () {
			const width = 1000;
			const height = 1000;
			const view = {
				zoom: 10,
				center: {
					lat: 50,
					lng: 15,
				},
			};

			const expectedOutput = {
				boxRange: 98264.54940594168,
				center: {
					lat: 50,
					lon: 15,
				},
			};

			const output = viewHelpers.getPantherViewFromLeafletViewParams(
				view,
				width,
				height
			);
			assert.deepStrictEqual(output, expectedOutput);
		});
	});

	describe('getCenterWhichFitsLimits', function () {
		it('return limited center', function () {
			const lat = 50;
			const lon = 15;
			const limits = {
				minLat: 51,
				maxLat: 52,
				minLon: 10,
				maxLon: 11,
			};

			const expectedOutput = {
				lat: 51,
				lon: 11,
			};

			const output = viewHelpers.getCenterWhichFitsLimits(limits, lat, lon);
			assert.deepStrictEqual(output, expectedOutput);
		});
	});
});
