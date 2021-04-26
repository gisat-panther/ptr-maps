"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

/* Vector feature basic style */
var defaultVectorFeatureStyle = {
  fill: '#ffffff',
  fillOpacity: 0.8,
  outlineColor: '#000000',
  outlineWidth: 2,
  outlineOpacity: 1
};
var selectedVectorFeatureStyle = {
  outlineWidth: 3,
  outlineColor: '#ff00ff',
  outlineOpacity: 1
};
var hoveredVectorFeatureStyle = {
  outlineWidth: 3,
  outlineColor: '#00ffff',
  outlineOpacity: 1
};
var selectedHoveredVectorFeatureStyle = {
  outlineWidth: 3,
  outlineColor: '#8800ff',
  outlineOpacity: 1
};
var vectorFeatureStyle = {
  "default": defaultVectorFeatureStyle,
  defaultFull: {
    rules: [{
      styles: [defaultVectorFeatureStyle]
    }]
  },
  hovered: hoveredVectorFeatureStyle,
  selected: selectedVectorFeatureStyle,
  selectedHovered: selectedHoveredVectorFeatureStyle
};
/* Diagram basic style */

var defaultDiagramStyle = {
  diagramFill: '#87c7ff',
  diagramFillOpacity: 1,
  diagramOutlineColor: '#3b80ff',
  diagramOutlineWidth: 1,
  diagramOutlineOpacity: 1
};
var selectedDiagramStyle = {
  diagramOutlineWidth: 2,
  diagramOutlineColor: '#ff00ff',
  diagramOutlineOpacity: 1
};
var hoveredDiagramStyle = {
  diagramOutlineWidth: 2,
  diagramOutlineColor: '#00ffff',
  diagramOutlineOpacity: 1
};
var selectedHoveredDiagramStyle = {
  diagramOutlineWidth: 2,
  diagramOutlineColor: '#8800ff',
  diagramOutlineOpacity: 1
};
var diagramStyle = {
  "default": defaultDiagramStyle,
  defaultFull: {
    rules: {
      styles: [defaultDiagramStyle]
    }
  },
  hovered: hoveredDiagramStyle,
  selected: selectedDiagramStyle,
  selectedHovered: selectedHoveredDiagramStyle
};
/* TODO obsolete, remain due to backward compatibility */

var vectorLayerHighlightedFeatureStyle = {
  strokeColor: '#00FFFF',
  strokeWidth: 2
};
var vectorLayerDefaultFeatureStyle = {
  fillColor: null,
  fillOpacity: 0,
  strokeColor: '#444',
  strokeWidth: 2
};
var _default = {
  diagramStyle: diagramStyle,
  vectorFeatureStyle: vectorFeatureStyle,

  /* TODO obsolete */
  vectorLayerHighlightedFeatureStyle: vectorLayerHighlightedFeatureStyle,
  vectorLayerDefaultFeatureStyle: vectorLayerDefaultFeatureStyle
};
exports["default"] = _default;