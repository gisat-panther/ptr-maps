import styles from "./styles";

// Frameworks
/** https://leafletjs.com/reference-1.6.0.html#map-overlaypane */
const defaultLeafletPaneZindex = 400;

/* Max number of features rendered as React element in leaflet vector layer  */
const maxFeaturesAsReactElement = 100;

// Projections
const projDefinitions = {
    epsg5514: "+proj=krovak +lat_0=49.5 +lon_0=24.83333333333333 +alpha=30.28813972222222 +k=0.9999 +x_0=0 +y_0=0 +ellps=bessel +towgs84=589,76,480,0,0,0,0 +units=m +no_defs"
}

export default {
    maxFeaturesAsReactElement,
    defaultLeafletPaneZindex,
    projDefinitions,
    ...styles,
}