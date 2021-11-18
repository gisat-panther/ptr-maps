import chroma from 'chroma-js';

function setPolygonStyle(context, style) {
	if (style.fill) {
		context.fillStyle = style.fill;
		if (style.fillOpacity || style.fillOpacity === 0) {
			context.fillStyle = chroma(style.fill).alpha(style.fillOpacity).hex();
		}

		context.fill();
	}

	if (style.outlineColor && style.outlineWidth) {
		context.lineWidth = style.outlineWidth;
		context.strokeStyle = style.outlineColor;
		if (style.outlineOpacity || style.outlineOpacity === 0) {
			context.strokeStyle = chroma(style.outlineColor)
				.alpha(style.outlineOpacity)
				.hex();
		}

		context.lineJoin = 'round';
		context.stroke();
	}
}

function setLineStyle(context, style) {
	if (style.outlineColor && style.outlineWidth) {
		context.lineWidth = style.outlineWidth;
		context.strokeStyle = style.outlineColor;
		if (style.outlineOpacity) {
			context.strokeStyle = chroma(style.outlineColor)
				.alpha(style.outlineOpacity)
				.hex();
		}

		context.lineJoin = 'round';
		context.lineCap = 'round';
		context.stroke();
	}
}

function getSize(definedSize, pixelSizeInMeters) {
	let size = pixelSizeInMeters ? definedSize / pixelSizeInMeters : definedSize;
	return size > 0.5 ? size : 0.5;
}

export default {
	setLineStyle,
	setPolygonStyle,
	getSize,
};
