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
	outlineOpacity: 1
};

const vectorLayerDefaultSelectedDiagramStyle = {
	diagramOutlineWidth: 3,
	diagramOutlineColor: "#ff0000",
	diagramOutlineOpacity: 1
};

const vectorLayerDefaultHoveredFeatureStyle = {
	outlineWidth: 2,
	outlineColor: "#00ffff",
	outlineOpacity: 1
};

const vectorLayerDefaultHoveredDiagramStyle = {
	diagramOutlineWidth: 2,
	diagramOutlineColor: "#00ffff",
	diagramOutlineOpacity: 1
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
	vectorLayerDefaultSelectedFeatureStyle,
	vectorLayerDefaultSelectedDiagramStyle,
	vectorLayerDefaultHoveredFeatureStyle,
	vectorLayerDefaultHoveredDiagramStyle
}