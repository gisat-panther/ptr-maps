function getHexCodeWithTransparency(colorCode, opacity) {
	const regex = /#[0-9A-Fa-f]{6}/g;

	if (regex.test(colorCode)) {
		if (opacity >= 0 && opacity < 1) {
			const alpha = Math.floor(opacity * 255).toString(16);
			return `${colorCode}${alpha}`;
		} else {
			return colorCode;
		}
	} else {
		console.warn("Not valid color code. Use valid 6-digit hex code!");
		return colorCode;
	}
}

export default {
	getHexCodeWithTransparency
}