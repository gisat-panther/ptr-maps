/* Vector feature basic style */
const defaultVectorFeatureStyle = {
	fill: '#ffffff',
	fillOpacity: 0.8,
	outlineColor: '#000000',
	outlineWidth: 2,
	outlineOpacity: 1,
};

const selectedVectorFeatureStyle = {
	outlineWidth: 3,
	outlineColor: '#ff00ff',
	outlineOpacity: 1,
};

const hoveredVectorFeatureStyle = {
	outlineWidth: 3,
	outlineColor: '#00ffff',
	outlineOpacity: 1,
};

const selectedHoveredVectorFeatureStyle = {
	outlineWidth: 3,
	outlineColor: '#8800ff',
	outlineOpacity: 1,
};

const vectorFeatureStyle = {
	default: defaultVectorFeatureStyle,
	defaultFull: {rules: [{styles: [defaultVectorFeatureStyle]}]},
	hovered: hoveredVectorFeatureStyle,
	selected: selectedVectorFeatureStyle,
	selectedHovered: selectedHoveredVectorFeatureStyle,
};

/* Diagram basic style */
const defaultDiagramStyle = {
	diagramFill: '#87c7ff',
	diagramFillOpacity: 1,
	diagramOutlineColor: '#3b80ff',
	diagramOutlineWidth: 1,
	diagramOutlineOpacity: 1,
};

const selectedDiagramStyle = {
	diagramOutlineWidth: 2,
	diagramOutlineColor: '#ff00ff',
	diagramOutlineOpacity: 1,
};

const hoveredDiagramStyle = {
	diagramOutlineWidth: 2,
	diagramOutlineColor: '#00ffff',
	diagramOutlineOpacity: 1,
};

const selectedHoveredDiagramStyle = {
	diagramOutlineWidth: 2,
	diagramOutlineColor: '#8800ff',
	diagramOutlineOpacity: 1,
};

const diagramStyle = {
	default: defaultDiagramStyle,
	defaultFull: {rules: {styles: [defaultDiagramStyle]}},
	hovered: hoveredDiagramStyle,
	selected: selectedDiagramStyle,
	selectedHovered: selectedHoveredDiagramStyle,
};

/* TODO obsolete, remain due to backward compatibility */
const vectorLayerHighlightedFeatureStyle = {
	strokeColor: '#00FFFF',
	strokeWidth: 2,
};

const vectorLayerDefaultFeatureStyle = {
	fillColor: null,
	fillOpacity: 0,
	strokeColor: '#444',
	strokeWidth: 2,
};

export default {
	diagramStyle,
	vectorFeatureStyle,

	/* TODO obsolete */
	vectorLayerHighlightedFeatureStyle,
	vectorLayerDefaultFeatureStyle,
};
