/**
 * Round one viewport dimension (width or height)
 * @param dimension {number} original dimension (width or height)
 * @return {number} Rounded dimension
 */
const roundDimension = dimension => {
	return Math.ceil(dimension);
};

export default {
	roundDimension,
};
