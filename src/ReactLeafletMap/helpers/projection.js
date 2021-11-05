import L from 'leaflet';
import Proj from 'proj4leaflet';
import constants from '../../constants';

/**
 * Get Proj CRS definition
 * @param code {string} EPSG:code
 * @returns {Proj.CRS|*}
 */
function getCRS(code) {
	switch (code) {
		case 'EPSG:4326':
			return L.CRS.EPSG4326;
		case 'EPSG:5514':
			return new Proj.CRS('EPSG:5514', constants.projDefinitions.epsg5514, {
				resolutions: [
					102400, 51200, 25600, 12800, 6400, 3200, 1600, 800, 400, 200, 100, 50,
					25, 12.5, 6.25, 3.125, 1.5625, 0.78125, 0.390625,
				],
			});
		default:
			return L.CRS.EPSG3857;
	}
}

export default {getCRS};
