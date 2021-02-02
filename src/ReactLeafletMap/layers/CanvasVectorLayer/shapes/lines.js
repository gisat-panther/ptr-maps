import helpers from './helpers';

/**
 * Draw shape to the given canvas
 * @param context {Object} canvas context
 * @param coordinates {Array}
 * @param style {Object} Panther style definition
 */
function drawLine(context, coordinates, style) {
	context.beginPath();

	const start = coordinates[0];
	const rest = coordinates.slice(1);

	context.moveTo(Math.floor(start.x), Math.floor(start.y));
	rest.forEach(point => {
		context.lineTo(Math.floor(point.x), Math.floor(point.y));
	});

	helpers.setLineStyle(context, style);
}

export default {
	drawLine,
};
