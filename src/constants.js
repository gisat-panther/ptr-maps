const numberOfLevels = 18;
const defaultLevelsRange = [1,18];
const zoomCoefficient = 500;

const vectorLayerDefaultFeatureStyle = {
	fillColor: null,
	fillOpacity: 0,
	strokeColor: "#444",
	strokeWidth: 2,
};

const vectorLayerDefaultSelectedFeatureStyle = {
	outlineWidth: 3,
	outlineColor: "#ff0000",
	outlineOpacity: 1,
	fillOpacity: 0,
};

const vectorLayerHighlightedFeatureStyle = {
	strokeColor: "#00FFFF",
	strokeWidth: 2,
};

export default {
	numberOfLevels,
	defaultLevelsRange,
	zoomCoefficient,
	vectorLayerDefaultFeatureStyle,
	vectorLayerHighlightedFeatureStyle,
	vectorLayerDefaultSelectedFeatureStyle
}