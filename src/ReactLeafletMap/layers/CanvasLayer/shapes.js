import colors from "../../../utils/colors";

/**
 * Draw shape to the given canvas
 * @param context {Object} canvas context
 * @param center {Object} center point of the shape
 * @param style {Object} Panther style definition
 */
function draw(context, center, style) {

	// TODO add other shapes
	if (style.shape === "square") {
		square(context, center, style);
	} else {
		circle(context, center, style);
	}
}

function square(context, center, style) {
	const a = style.size; // side length
	context.beginPath();
	context.rect(center.x - a/2, center.y - a/2, a, a);
	setPolygonStyle(context, style);
	context.closePath();
}

function circle(context, center, style) {
	context.beginPath();
	context.arc(center.x, center.y, style.size/2, 0, Math.PI * 2);
	setPolygonStyle(context, style);
	context.closePath();
}

function setPolygonStyle(context, style) {
	if (style.fill) {
		context.fillStyle = style.fill;
		if (style.fillOpacity) {
			context.fillStyle = colors.getHexCodeWithTransparency(style.fill, style.fillOpacity);
		}

		context.fill();
	}

	if (style.outlineColor && style.outlineWidth) {
		context.lineWidth = style.outlineWidth;
		context.strokeStyle = style.outlineColor;
		if (style.outlineOpacity) {
			context.strokeStyle = colors.getHexCodeWithTransparency(style.outlineColor, style.outlineOpacity);
		}

		context.stroke();
	}
}

export default {
	draw
}