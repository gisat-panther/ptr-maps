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
	outlineColor: "#ff00ff",
	outlineOpacity: 1
};

const vectorLayerDefaultSelectedDiagramStyle = {
	diagramOutlineWidth: 2,
	diagramOutlineColor: "#ff00ff",
	diagramOutlineOpacity: 1
};

const vectorLayerDefaultHoveredFeatureStyle = {
	outlineWidth: 3,
	outlineColor: "#00ffff",
	outlineOpacity: 1
};

const vectorLayerDefaultHoveredDiagramStyle = {
	diagramOutlineWidth: 2,
	diagramOutlineColor: "#00ffff",
	diagramOutlineOpacity: 1
};

const vectorLayerDefaultSelectedHoveredFeatureStyle = {
	outlineWidth: 3,
	outlineColor: "#8800ff",
	outlineOpacity: 1
};

const vectorLayerDefaultSelectedHoveredDiagramStyle = {
	diagramOutlineWidth: 2,
	diagramOutlineColor: "#8800ff",
	diagramOutlineOpacity: 1
};

// Obsolete?
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
	vectorLayerDefaultHoveredDiagramStyle,
	vectorLayerDefaultSelectedHoveredFeatureStyle,
	vectorLayerDefaultSelectedHoveredDiagramStyle
}