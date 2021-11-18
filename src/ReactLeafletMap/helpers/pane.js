/**
 * Get unique pane key across all maps
 * @param mapKey {string}
 * @param layer {Object|string}
 * @param index {number}
 * @returns {string}
 */
const getKey = (mapKey, layer, index) => {
	const layerKey = layer?.key || index || layer;
	return `${mapKey}-${layerKey}`;
};

export default {
	getKey,
};
