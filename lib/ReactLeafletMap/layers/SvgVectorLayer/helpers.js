"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _ptrUtils = require("@gisatcz/ptr-utils");

var _constants = _interopRequireDefault(require("../../../constants"));

var _memoizeOne = _interopRequireDefault(require("memoize-one"));

var _flip = _interopRequireDefault(require("@turf/flip"));

var _shapes = _interopRequireDefault(require("./Feature/shapes"));

var _MarkerShape = _interopRequireDefault(require("./Feature/MarkerShape"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/**
 * @param feature {GeoJSONFeature}
 * @param styleDefinition {Object} Panther style definition
 * @return {Object}
 */
function getDefaultStyleObject(feature, styleDefinition) {
  return _ptrUtils.mapStyle.getStyleObject(feature.properties, styleDefinition || _constants["default"].vectorFeatureStyle.defaultFull);
}
/**
 * @param selectedStyleDefinition {Object} Panther style definition
 * @return {Object}
 */


function getSelectedStyleObject(selectedStyleDefinition) {
  return selectedStyleDefinition === 'default' ? _constants["default"].vectorFeatureStyle.selected : selectedStyleDefinition;
}
/**
 * @param feature {GeoJSONFeature}
 * @param defaultStyleObject {Object} Panther style definition
 * @return {Object}
 */


function getFeatureDefaultStyle(feature, defaultStyleObject) {
  return getFeatureLeafletStyle(feature, defaultStyleObject);
}
/**
 * @param feature {GeoJSONFeature}
 * @param defaultStyleObject {Object} Panther style definition
 * @param accentedStyleObject {Object} Panther style definition
 * @return {Object}
 */


function getFeatureAccentedStyle(feature, defaultStyleObject, accentedStyleObject) {
  var style = _objectSpread(_objectSpread({}, defaultStyleObject), accentedStyleObject);

  return getFeatureLeafletStyle(feature, style);
}
/**
 * @param feature {GeoJSONFeature}
 * @param style {Object} Panther style definition
 * @return {Object} Leaflet style definition
 */


function getFeatureLeafletStyle(feature, style) {
  var outlineColor = style.outlineColor,
      outlineWidth = style.outlineWidth,
      outlineOpacity = style.outlineOpacity,
      fillOpacity = style.fillOpacity,
      fill = style.fill,
      size = style.size,
      volume = style.volume,
      finalStyle = _objectWithoutProperties(style, ["outlineColor", "outlineWidth", "outlineOpacity", "fillOpacity", "fill", "size", "volume"]);

  finalStyle.color = style.outlineColor ? style.outlineColor : null;
  finalStyle.weight = style.outlineWidth ? style.outlineWidth : 0;
  finalStyle.opacity = style.outlineOpacity ? style.outlineOpacity : 1;
  finalStyle.fillOpacity = style.fillOpacity ? style.fillOpacity : 1;
  finalStyle.fillColor = style.fill;

  if (!style.fill) {
    finalStyle.fillColor = null;
    finalStyle.fillOpacity = 0;
  }

  if (!style.outlineColor || !style.outlineWidth) {
    finalStyle.color = null;
    finalStyle.opacity = 0;
    finalStyle.weight = 0;
  } // for point features, set radius


  if (feature.geometry.type === 'Point') {
    if (style.size) {
      finalStyle.radius = style.size;
    } else if (style.volume) {
      finalStyle.radius = Math.sqrt(style.volume / Math.PI);
    }
  }

  return finalStyle;
}
/**
 * Leaflet requires coordinates in different order than GeoJSON standard
 * @param feature {GeoJSONFeature}
 */


var convertCoordinatesMemo = (0, _memoizeOne["default"])(function (feature) {
  // TODO do we need turf for this?
  var flippedFeature = (0, _flip["default"])(feature);
  return flippedFeature && flippedFeature.geometry && flippedFeature.geometry.coordinates;
});

var getDefaultStyle = function getDefaultStyle(feature, styleDefinition) {
  var defaultStyleObject = getDefaultStyleObject(feature, styleDefinition);
  return getFeatureDefaultStyle(feature, defaultStyleObject);
};

var calculateStyle = function calculateStyle(feature, styleDefinition, hoveredStyleDefinition, selected, selectedStyleDefinition, selectedHoveredStyleDefinition) {
  // Prepare default style
  var defaultStyleObject = getDefaultStyleObject(feature, styleDefinition);
  var defaultStyle = getFeatureDefaultStyle(feature, defaultStyleObject); // Prepare hovered style

  var hoveredStyleObject = null;
  var hoveredStyle = null;

  if (hoveredStyleDefinition) {
    hoveredStyleObject = hoveredStyleDefinition === 'default' ? _constants["default"].vectorFeatureStyle.hovered : hoveredStyleDefinition;
    hoveredStyle = getFeatureAccentedStyle(feature, defaultStyleObject, hoveredStyleObject);
  } // Prepare selected and selected hovered style, if selected


  var selectedStyle = null;
  var selectedHoveredStyle = null;

  if (selected) {
    var selectedHoveredStyleObject = null;

    if (selectedStyleDefinition) {
      selectedStyle = getFeatureAccentedStyle(feature, defaultStyleObject, getSelectedStyleObject(selectedStyleDefinition));
    }

    if (selectedHoveredStyleDefinition) {
      selectedHoveredStyleObject = selectedHoveredStyleDefinition === 'default' ? _constants["default"].vectorFeatureStyle.selectedHovered : selectedHoveredStyleDefinition;
      selectedHoveredStyle = getFeatureAccentedStyle(feature, defaultStyleObject, selectedHoveredStyleObject);
    }
  }

  return {
    "default": defaultStyle,
    hovered: hoveredStyle,
    selected: selectedStyle,
    selectedHovered: selectedHoveredStyle
  };
};

var calculateStylesMemo = (0, _memoizeOne["default"])(calculateStyle);
/**
 * @param id {string}
 * @param style {Object} Leaflet style definition
 * @param options {Object}
 * @param options.icons {Object} see https://gisat.github.io/components/maps/map#resources
 * @param options.onMouseMove {function}
 * @param options.onMouseOver {function}
 * @param options.onMouseOut {function}
 * @param options.onClick {function}
 * @return {MarkerShape}
 */

var getMarkerShape = function getMarkerShape(id, style, options) {
  var shapeKey = style.shape;
  var iconKey = style.icon;
  var basicShape = true;
  var anchorShift = 0; // shift of anchor in pixels

  var anchorPositionX = 0.5; // relative anchor X position (0.5 means that the shape reference point is in the middle horizontally)

  var anchorPositionY = 0.5; // relative anchor Y position

  var shape, icon; // find shape by key in the internal set of shapes

  if (shapeKey) {
    shape = _shapes["default"][shapeKey] || null;
  } // find icon by key in the given set of icons


  if (iconKey) {
    var _options$icons;

    icon = (options === null || options === void 0 ? void 0 : (_options$icons = options.icons) === null || _options$icons === void 0 ? void 0 : _options$icons[iconKey]) || null;
  }

  if (shape || icon) {
    var _shape, _icon;

    basicShape = false; // get anchor positions from definitions, if exist

    if ((_shape = shape) !== null && _shape !== void 0 && _shape.anchorPoint) {
      anchorPositionX = shape.anchorPoint[0];
      anchorPositionY = shape.anchorPoint[1];
    } else if (!shape && (_icon = icon) !== null && _icon !== void 0 && _icon.anchorPoint) {
      anchorPositionX = icon.anchorPoint[0];
      anchorPositionY = icon.anchorPoint[1];
    } // if outline, shift the anchor point


    if (style !== null && style !== void 0 && style.weight) {
      anchorShift = style === null || style === void 0 ? void 0 : style.weight;
    }
  }

  return new _MarkerShape["default"]({
    basicShape: basicShape,
    id: id,
    style: style,
    iconAnchor: style.radius ? [(2 * style.radius + anchorShift) * anchorPositionX, (2 * style.radius + anchorShift) * anchorPositionY] : null,
    icon: icon,
    shape: shape,
    onMouseMove: options.onMouseMove,
    onMouseOut: options.onMouseOut,
    onMouseOver: options.onMouseOver,
    onClick: options.onClick
  });
};
/**
 * Prepare element style by shape
 * @param leafletStyle {Object} Leaflet style definition
 * @return {Object} calculated style object
 */


var getMarkerShapeCssStyle = function getMarkerShapeCssStyle(leafletStyle) {
  switch (leafletStyle.shape) {
    case 'square':
      return getMarkerShapeSquareStyle(leafletStyle);

    case 'diamond':
      return getMarkerShapeSquareStyle(leafletStyle, 45);

    case 'circle':
    default:
      return getMarkerShapeCircleStyle(leafletStyle);
  }
};
/**
 * @param leafletStyle {Object} Leaflet style definition
 * @return {Object} calculated style object
 */


var getMarkerShapeCircleStyle = function getMarkerShapeCircleStyle(leafletStyle) {
  return getMarkerShapeSquareStyle(leafletStyle, null, leafletStyle.radius);
};
/**
 * @param leafletStyle {Object} Leaflet style definition
 * @param rotation {number}
 * @param borderRadius {number}
 * @return {Object} calculated style object
 */


var getMarkerShapeSquareStyle = function getMarkerShapeSquareStyle(leafletStyle, rotation, borderRadius) {
  var style = {};

  if (leafletStyle.radius) {
    style.width = leafletStyle.radius * 2 + 'px';
    style.height = leafletStyle.radius * 2 + 'px';
  }

  if (leafletStyle.fillColor) {
    if (leafletStyle.fillOpacity && leafletStyle.fillOpacity !== 1) {
      var rgb = _ptrUtils.mapStyle.hexToRgb(leafletStyle.fillColor);

      style['backgroundColor'] = "rgba(".concat(rgb.r, ",").concat(rgb.g, ",").concat(rgb.b, ",").concat(leafletStyle.fillOpacity, ")");
    } else {
      style['backgroundColor'] = leafletStyle.fillColor;
    }
  }

  if (leafletStyle.color) {
    if (leafletStyle.opacity && leafletStyle.opacity !== 1) {
      var _rgb = _ptrUtils.mapStyle.hexToRgb(leafletStyle.color);

      style['borderColor'] = "rgba(".concat(_rgb.r, ",").concat(_rgb.g, ",").concat(_rgb.b, ",").concat(leafletStyle.opacity, ")");
    } else {
      style['borderColor'] = leafletStyle.color;
    }
  }

  if (leafletStyle.weight) {
    style['borderStyle'] = 'solid';
    style['borderWidth'] = leafletStyle.weight + 'px';
  }

  if (borderRadius) {
    style['borderRadius'] = borderRadius + 'px';
  }

  if (rotation) {
    style.transform = 'rotate(' + rotation + 'deg)';
  }

  return style;
};
/**
 * Prepare element style
 * @param leafletStyle {Object} Leaflet style definition
 * @param leafletStyle.color {string} hex code of outline color
 * @param leafletStyle.fillColor {string} hex code of fill color
 * @param leafletStyle.fillOpacity {number} range from 0 to 1, where 0 is transparent and 1 is fully opaque
 * @param leafletStyle.icon {string} icon id
 * @param leafletStyle.iconFill {string} hex code of icon fill color
 * @param leafletStyle.opacity {number} Outline opacity. range from 0 to 1, where 0 is transparent and 1 is fully opaque
 * @param leafletStyle.radius {number} Shape radius is a half of shape height/width
 * @param leafletStyle.shape {string} shape id
 * @param leafletStyle.weight {number} outline width
 * @return {Object} calculated style object suitable for SVG
 */


var getMarkerShapeSvgStyle = function getMarkerShapeSvgStyle(leafletStyle) {
  var style = {};

  if (leafletStyle.radius) {
    var size = leafletStyle.radius * 2 + (leafletStyle.weight || 0);
    style.width = size + 'px';
    style.height = size + 'px';
  }

  if (leafletStyle.fillColor) {
    style.fill = leafletStyle.fillColor;
  }

  if (leafletStyle.fillOpacity || leafletStyle.fillOpacity === 0) {
    style.fillOpacity = leafletStyle.fillOpacity;
  }

  if (leafletStyle.color) {
    style.stroke = leafletStyle.color;
  }

  if (leafletStyle.opacity) {
    style.strokeOpacity = leafletStyle.opacity;
  }

  if (leafletStyle.weight) {
    style.strokeWidth = leafletStyle.weight + 'px';
  }

  if (leafletStyle.iconFill) {
    style.iconFill = leafletStyle.iconFill;
  }

  return style;
};

var _default = {
  calculateStyle: calculateStyle,
  calculateStylesMemo: calculateStylesMemo,
  convertCoordinatesMemo: convertCoordinatesMemo,
  getDefaultStyle: getDefaultStyle,
  getDefaultStyleObject: getDefaultStyleObject,
  getFeatureAccentedStyle: getFeatureAccentedStyle,
  getFeatureDefaultStyle: getFeatureDefaultStyle,
  getFeatureLeafletStyle: getFeatureLeafletStyle,
  getMarkerShape: getMarkerShape,
  getMarkerShapeCssStyle: getMarkerShapeCssStyle,
  getMarkerShapeSvgStyle: getMarkerShapeSvgStyle,
  getSelectedStyleObject: getSelectedStyleObject
};
exports["default"] = _default;