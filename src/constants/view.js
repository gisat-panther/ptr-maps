const earthCircumference = 40080000; // in meters

/* Constants for levels-based map view handling */
/* TODO enable custom levels range */
const numberOfLevels = 18;
const defaultLevelsRange = [1,18];
const zoomCoefficient = 250;

/* Default box range limits */
const maxBoxRange = 50000000;
const minBoxRange = 1;

export default {
    earthCircumference,
    numberOfLevels,
    defaultLevelsRange,
    zoomCoefficient,
    maxBoxRange,
    minBoxRange
}