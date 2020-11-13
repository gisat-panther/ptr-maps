import colors from "../../../../utils/colors";

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

function setLineStyle(context, style) {
	if (style.outlineColor && style.outlineWidth) {
		context.lineWidth = style.outlineWidth;
		context.strokeStyle = style.outlineColor;
		if (style.outlineOpacity) {
			context.strokeStyle = colors.getHexCodeWithTransparency(style.outlineColor, style.outlineOpacity);
		}

		context.lineJoin = "round";
		context.lineCap = "round";
		context.stroke();
	}
}

function getSize(definedSize, pixelSizeInMeters) {
	let size = pixelSizeInMeters ? definedSize/pixelSizeInMeters : definedSize;
	return size < 0.5 ? 0.5 : size;
}

export default {
	setLineStyle,
	setPolygonStyle,
	getSize
}