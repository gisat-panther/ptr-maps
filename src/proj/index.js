import utms from './projections/UTM';
import krovak from './projections/krovak';
import proj4 from 'proj4';

// Adds proj4 as a global variable to be accessible for other libraries like Georaster
if(typeof window !== 'undefined') {
	window.proj4 = proj4;
}

/**
 * Adds all projection definitions to the Proj4js
 * @param {Object} projections Object where key is EPSG code a value is proj4js definition
 */
export const addProjections = (projections = {}) => {
    for(const [key, value] of Object.entries(projections)) {
        if(key && value) {
            proj4.defs(key, value);
        }
    }
}

export const projections = {
    utms,
    krovak,
}