import _isArray2 from 'lodash/isArray';
import React$1 from 'react';
import PropTypes from 'prop-types';
import { Input, Icon, Button, Error as Error$1 } from '@gisatcz/ptr-atoms';
import classnames from 'classnames';
import { mapConstants, isServer } from '@gisatcz/ptr-core';
import utils$2, { map, mapStyle, utils, CyclicPickController } from '@gisatcz/ptr-utils';
import _pickBy2 from 'lodash/pickBy';
import _mapValues2 from 'lodash/mapValues';
import _isEmpty2 from 'lodash/isEmpty';
import _forEach2 from 'lodash/forEach';
import _isEqual2 from 'lodash/isEqual';
import { withLeaflet, MapLayer, Polygon, Polyline, Circle, Marker, GeoJSON, Pane, Map as Map$1, TileLayer as TileLayer$1 } from 'react-leaflet';
import L$1, { DomUtil, Point, Browser, Layer, Class, setOptions, Util, latLngBounds, point, extend, TileLayer, tileLayer, imageOverlay, CRS } from 'leaflet';
import Proj from 'proj4leaflet';
import ReactResizeDetector from 'react-resize-detector';
import _find2 from 'lodash/find';
import _orderBy2 from 'lodash/orderBy';
import _includes2 from 'lodash/includes';
import _forIn2 from 'lodash/forIn';
import { point as point$1, featureCollection } from '@turf/helpers';
import nearestPoint from '@turf/nearest-point';
import booleanPointInPolygon from '@turf/boolean-point-in-polygon';
import memoize from 'memoize-one';
import flip from '@turf/flip';
import ReactDOMServer from 'react-dom/server';
import chroma from 'chroma-js';
import { shallowEqualObjects } from 'shallow-equal';
import _indexOf2 from 'lodash/indexOf';
import Context from '@gisatcz/cross-package-react-context';
import _uniq2 from 'lodash/uniq';
import _findIndex2 from 'lodash/findIndex';
import isEqual from 'fast-deep-equal';
import { utils as utils$1, grid } from '@gisatcz/ptr-tile-grid';
import _sortBy2 from 'lodash/sortBy';
import WorldWind from 'webworldwind-esa';
import uriTemplates from 'uri-templates';
import _each2 from 'lodash/each';
import _compact2 from 'lodash/compact';
import { QuadTree, Box, Point as Point$1, Circle as Circle$1 } from 'js-quadtree';
import turfCentroid from '@turf/centroid';
import Loadable from 'react-loadable';

function _typeof(obj) {
  "@babel/helpers - typeof";

  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    _typeof = function (obj) {
      return typeof obj;
    };
  } else {
    _typeof = function (obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };
  }

  return _typeof(obj);
}

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

function _extends() {
  _extends = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  return _extends.apply(this, arguments);
}

function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);

  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);
    if (enumerableOnly) symbols = symbols.filter(function (sym) {
      return Object.getOwnPropertyDescriptor(object, sym).enumerable;
    });
    keys.push.apply(keys, symbols);
  }

  return keys;
}

function _objectSpread2(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};

    if (i % 2) {
      ownKeys(Object(source), true).forEach(function (key) {
        _defineProperty(target, key, source[key]);
      });
    } else if (Object.getOwnPropertyDescriptors) {
      Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
      ownKeys(Object(source)).forEach(function (key) {
        Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
      });
    }
  }

  return target;
}

function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function");
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      writable: true,
      configurable: true
    }
  });
  if (superClass) _setPrototypeOf(subClass, superClass);
}

function _getPrototypeOf(o) {
  _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
    return o.__proto__ || Object.getPrototypeOf(o);
  };
  return _getPrototypeOf(o);
}

function _setPrototypeOf(o, p) {
  _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };

  return _setPrototypeOf(o, p);
}

function _isNativeReflectConstruct() {
  if (typeof Reflect === "undefined" || !Reflect.construct) return false;
  if (Reflect.construct.sham) return false;
  if (typeof Proxy === "function") return true;

  try {
    Date.prototype.toString.call(Reflect.construct(Date, [], function () {}));
    return true;
  } catch (e) {
    return false;
  }
}

function _objectWithoutPropertiesLoose(source, excluded) {
  if (source == null) return {};
  var target = {};
  var sourceKeys = Object.keys(source);
  var key, i;

  for (i = 0; i < sourceKeys.length; i++) {
    key = sourceKeys[i];
    if (excluded.indexOf(key) >= 0) continue;
    target[key] = source[key];
  }

  return target;
}

function _objectWithoutProperties(source, excluded) {
  if (source == null) return {};

  var target = _objectWithoutPropertiesLoose(source, excluded);

  var key, i;

  if (Object.getOwnPropertySymbols) {
    var sourceSymbolKeys = Object.getOwnPropertySymbols(source);

    for (i = 0; i < sourceSymbolKeys.length; i++) {
      key = sourceSymbolKeys[i];
      if (excluded.indexOf(key) >= 0) continue;
      if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
      target[key] = source[key];
    }
  }

  return target;
}

function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return self;
}

function _possibleConstructorReturn(self, call) {
  if (call && (typeof call === "object" || typeof call === "function")) {
    return call;
  }

  return _assertThisInitialized(self);
}

function _createSuper(Derived) {
  var hasNativeReflectConstruct = _isNativeReflectConstruct();

  return function _createSuperInternal() {
    var Super = _getPrototypeOf(Derived),
        result;

    if (hasNativeReflectConstruct) {
      var NewTarget = _getPrototypeOf(this).constructor;

      result = Reflect.construct(Super, arguments, NewTarget);
    } else {
      result = Super.apply(this, arguments);
    }

    return _possibleConstructorReturn(this, result);
  };
}

function _superPropBase(object, property) {
  while (!Object.prototype.hasOwnProperty.call(object, property)) {
    object = _getPrototypeOf(object);
    if (object === null) break;
  }

  return object;
}

function _get(target, property, receiver) {
  if (typeof Reflect !== "undefined" && Reflect.get) {
    _get = Reflect.get;
  } else {
    _get = function _get(target, property, receiver) {
      var base = _superPropBase(target, property);

      if (!base) return;
      var desc = Object.getOwnPropertyDescriptor(base, property);

      if (desc.get) {
        return desc.get.call(receiver);
      }

      return desc.value;
    };
  }

  return _get(target, property, receiver || target);
}

function _slicedToArray(arr, i) {
  return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
}

function _toConsumableArray(arr) {
  return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
}

function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) return _arrayLikeToArray(arr);
}

function _arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
}

function _iterableToArray(iter) {
  if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter);
}

function _iterableToArrayLimit(arr, i) {
  if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return;
  var _arr = [];
  var _n = true;
  var _d = false;
  var _e = undefined;

  try {
    for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
      _arr.push(_s.value);

      if (i && _arr.length === i) break;
    }
  } catch (err) {
    _d = true;
    _e = err;
  } finally {
    try {
      if (!_n && _i["return"] != null) _i["return"]();
    } finally {
      if (_d) throw _e;
    }
  }

  return _arr;
}

function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}

function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;

  for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

  return arr2;
}

function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

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
var styles = {
  diagramStyle: diagramStyle,
  vectorFeatureStyle: vectorFeatureStyle,

  /* TODO obsolete */
  vectorLayerHighlightedFeatureStyle: vectorLayerHighlightedFeatureStyle,
  vectorLayerDefaultFeatureStyle: vectorLayerDefaultFeatureStyle
};

/** https://leafletjs.com/reference-1.6.0.html#map-overlaypane */

var defaultLeafletPaneZindex = 400;
/* Max number of features rendered as React element in leaflet vector layer  */

var maxFeaturesAsReactElement = 100; // Projections

var projDefinitions = {
  epsg5514: '+proj=krovak +lat_0=49.5 +lon_0=24.83333333333333 +alpha=30.28813972222222 +k=0.9999 +x_0=0 +y_0=0 +ellps=bessel +towgs84=589,76,480,0,0,0,0 +units=m +no_defs'
};
var constants = _objectSpread2({
  maxFeaturesAsReactElement: maxFeaturesAsReactElement,
  defaultLeafletPaneZindex: defaultLeafletPaneZindex,
  projDefinitions: projDefinitions
}, styles);

/**
 * Convert Web World Wind range to Panther boxRange
 * @param range {WorldWind.Navigator.range}
 * @param width {number} map width
 * @param height {number} map height
 * @return {number|*} Panther view box range
 */
function getBoxRangeFromWorldWindRange(range, width, height) {
  if (width && width >= height) {
    return range * height / width;
  } else {
    return range;
  }
}
/**
 * Convert Panther boxRange to Web World Wind range
 * @param boxRange {number} Panther view boxRange
 * @param width {number} map width
 * @param height {number} map height
 * @return {number|*} WorldWind navigator range
 */


function getWorldWindRangeFromBoxRange(boxRange, width, height) {
  if (width && width >= height) {
    return boxRange * width / height;
  } else {
    return boxRange;
  }
}
/**
 * Check if given boxRange is inside defined range. Lower limit is excluded, upper limit is included.
 * @param boxRange {number} map view boxRange
 * @param range {Array} boxRangeRange
 * @return {boolean}
 */


function isBoxRangeInRange(boxRange, range) {
  if (_isArray2(range)) {
    // both limits defined by number
    var fitsInLimits = boxRange > range[0] && boxRange <= range[1]; // without lower limit

    var noLowerLimitLessThanUpper = !range[0] && boxRange <= range[1]; // without upper limit

    var noUpperLimitMoreThanLower = boxRange > range[0] && !range[1];
    return fitsInLimits || noLowerLimitLessThanUpper || noUpperLimitMoreThanLower;
  } else {
    return false;
  }
}
/**
 * It compares center coordinates with limits. If given center is outside limit, adjusted center will be returned
 * @param center {{lat: number, lon: number}}
 * @param limit {{minLat: number, maxLat: number, minLon: number, maxLon: number}}
 * @return {{lat: number, lon: number}}
 */


function getCenterWhichFitsLimits(center, limit) {
  if (!limit) {
    return center;
  } else {
    var updatedLat = null;
    var updatedLon = null;
    var givenLat = center.lat;
    var givenLon = center.lon;
    var maxLat = limit.maxLat;
    var maxLon = limit.maxLon;
    var minLat = limit.minLat;
    var minLon = limit.minLon;

    if (givenLat >= maxLat) {
      updatedLat = maxLat;
    }

    if (givenLat <= minLat) {
      updatedLat = minLat;
    }

    if (givenLon >= maxLon) {
      updatedLon = maxLon;
    }

    if (givenLon <= minLon) {
      updatedLon = minLon;
    } // Don't mutate, if center fits limits


    if (!updatedLon && !updatedLat) {
      return center;
    } else {
      return {
        lat: updatedLat || center.lat,
        lon: updatedLon || center.lon
      };
    }
  }
}

var view = {
  getBoxRangeFromWorldWindRange: getBoxRangeFromWorldWindRange,
  getCenterWhichFitsLimits: getCenterWhichFitsLimits,
  getWorldWindRangeFromBoxRange: getWorldWindRangeFromBoxRange,
  isBoxRangeInRange: isBoxRangeInRange
};

var GoToPlace = /*#__PURE__*/function (_React$PureComponent) {
  _inherits(GoToPlace, _React$PureComponent);

  var _super = _createSuper(GoToPlace);

  function GoToPlace(props) {
    var _this;

    _classCallCheck(this, GoToPlace);

    _this = _super.call(this, props);
    _this.state = {
      text: null,
      previousSearching: null
    };
    _this.search = _this.search.bind(_assertThisInitialized(_this));
    _this.onTextChange = _this.onTextChange.bind(_assertThisInitialized(_this));
    return _this;
  }

  _createClass(GoToPlace, [{
    key: "onTextChange",
    value: function onTextChange(text) {
      this.setState({
        text: text
      });
    }
  }, {
    key: "search",
    value: function search(e) {
      if (e.charCode === 13 && this.props.goToPlace && this.state.text !== this.state.previousSearching) {
        this.props.goToPlace(this.state.text);
        this.state.previousSearching = this.state.text;
      }
    }
  }, {
    key: "render",
    value: function render() {
      return /*#__PURE__*/React$1.createElement("div", {
        className: "ptr-go-to-place-box",
        onKeyPress: this.search
      }, /*#__PURE__*/React$1.createElement(Input, {
        placeholder: "Zoom to",
        onChange: this.onTextChange,
        value: this.state.text
      }, /*#__PURE__*/React$1.createElement(Icon, {
        icon: "search"
      })));
    }
  }]);

  return GoToPlace;
}(React$1.PureComponent);

GoToPlace.propTypes = {
  goToPlace: PropTypes.func
};

var MapGrid = /*#__PURE__*/function (_React$PureComponent) {
  _inherits(MapGrid, _React$PureComponent);

  var _super = _createSuper(MapGrid);

  function MapGrid(props) {
    var _this;

    _classCallCheck(this, MapGrid);

    _this = _super.call(this, props);
    _this.ref = /*#__PURE__*/React$1.createRef();
    _this.state = {
      width: null,
      height: null
    };
    return _this;
  }

  _createClass(MapGrid, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      this.resize();
      if (typeof window !== 'undefined') window.addEventListener('resize', this.resize.bind(this), {
        passive: true
      }); //todo IE
    }
  }, {
    key: "resize",
    value: function resize() {
      if (this.ref && this.ref.current) {
        var width = this.ref.current.clientWidth;
        var height = this.ref.current.clientHeight;
        this.setState({
          width: width,
          height: height
        });
      }
    }
  }, {
    key: "render",
    value: function render() {
      return /*#__PURE__*/React$1.createElement("div", {
        className: "ptr-map-grid",
        ref: this.ref
      }, this.renderMaps());
    }
  }, {
    key: "renderMaps",
    value: function renderMaps() {
      var availableWidth = this.state.width;
      var availableHeight = this.state.height;

      if (this.props.children.length && availableWidth && availableHeight) {
        var sizeRatio = availableWidth / availableHeight;
        var rows = 1,
            columns = 1;

        switch (this.props.children.length) {
          case 1:
            break;

          case 2:
            if (sizeRatio > 1) {
              columns = 2;
            } else {
              rows = 2;
            }

            break;

          case 3:
            if (sizeRatio > 2) {
              columns = 3;
            } else if (sizeRatio < 0.6666) {
              rows = 3;
            } else {
              columns = 2;
              rows = 2;
            }

            break;

          case 4:
            if (sizeRatio > 3) {
              columns = 4;
            } else if (sizeRatio < 0.5) {
              rows = 4;
            } else {
              columns = 2;
              rows = 2;
            }

            break;

          case 5:
          case 6:
            if (sizeRatio > 1) {
              columns = 3;
              rows = 2;
            } else {
              columns = 2;
              rows = 3;
            }

            break;

          case 7:
          case 8:
            if (sizeRatio > 2) {
              columns = 4;
              rows = 2;
            } else if (sizeRatio < 0.6666) {
              columns = 2;
              rows = 4;
            } else {
              columns = 3;
              rows = 3;
            }

            break;

          case 9:
            if (sizeRatio > 2.5) {
              columns = 5;
              rows = 2;
            } else if (sizeRatio < 0.5) {
              columns = 2;
              rows = 5;
            } else {
              columns = 3;
              rows = 3;
            }

            break;

          default:
            if (sizeRatio > 1) {
              columns = 4;
              rows = 3;
            } else {
              columns = 3;
              rows = 4;
            }

        }

        var width = +(100 / columns).toFixed(4) + '%';
        var height = +(100 / rows).toFixed(4) + '%';
        var style = {
          width: width,
          height: height
        };
        return this.props.children.map(function (map, index) {
          index++;
          var rowNo = Math.ceil(index / columns);
          var colNo = index % columns || columns;
          var wrapperClasses = classnames('ptr-map-grid-cell', 'row' + rowNo, 'col' + colNo, map.props.wrapperClasses);
          return /*#__PURE__*/React$1.createElement("div", {
            key: 'map-grid-cell-' + index,
            className: wrapperClasses,
            style: style
          }, map);
        });
      } else {
        return null;
      }
    }
  }]);

  return MapGrid;
}(React$1.PureComponent);

var MapControls = /*#__PURE__*/function (_React$PureComponent) {
  _inherits(MapControls, _React$PureComponent);

  var _super = _createSuper(MapControls);

  function MapControls() {
    var _this;

    _classCallCheck(this, MapControls);

    _this = _super.call(this);
    _this.tiltIncrement = 5;
    _this.headingIncrement = 1.0;
    _this.zoomIncrement = 0.04;
    _this.exaggerationIncrement = 1;
    _this.state = {
      resetHeadingDisabled: false
    };
    return _this;
  }

  _createClass(MapControls, [{
    key: "componentDidUpdate",
    value: function componentDidUpdate(prevProps, prevState, snapshot) {
      if (this.state.resetHeadingDisabled && (!this.props.view.heading || this.props.heading === '360')) {
        this.setState({
          resetHeadingDisabled: false
        });
      }
    }
  }, {
    key: "handleTiltUp",
    value: function handleTiltUp() {
      var update = {
        tilt: this.props.view.tilt - this.tiltIncrement
      };
      this.props.updateView(update, this.props.mapKey);
    }
  }, {
    key: "handleTiltDown",
    value: function handleTiltDown() {
      var update = {
        tilt: this.props.view.tilt + this.tiltIncrement
      };
      this.props.updateView(update, this.props.mapKey);
    }
  }, {
    key: "handleHeadingRight",
    value: function handleHeadingRight() {
      var update = {
        heading: this.props.view.heading - this.headingIncrement
      };
      this.props.updateView(update, this.props.mapKey);
    }
  }, {
    key: "handleHeadingLeft",
    value: function handleHeadingLeft() {
      var update = {
        heading: this.props.view.heading + this.headingIncrement
      };
      this.props.updateView(update, this.props.mapKey);
    }
  }, {
    key: "handleZoomIn",
    value: function handleZoomIn() {
      var update = null;

      if (this.props.levelsBased && this.props.view && this.props.view.boxRange) {
        // remove 1 from box range to prevent rounding issues
        update = {
          boxRange: (this.props.view.boxRange - 1) / 2
        };
      } else {
        update = {
          boxRange: this.props.view.boxRange * (1 - this.zoomIncrement)
        };
      }

      this.props.updateView(update, this.props.mapKey);
    }
  }, {
    key: "handleZoomOut",
    value: function handleZoomOut() {
      var update;

      if (this.props.levelsBased && this.props.view && this.props.view.boxRange) {
        // add 1 to box range to prevent rounding issues
        update = {
          boxRange: this.props.view.boxRange * 2 + 1
        };
      } else {
        update = {
          boxRange: this.props.view.boxRange * (1 + this.zoomIncrement)
        };
      }

      this.props.updateView(update, this.props.mapKey);
    }
  }, {
    key: "handleResetHeading",
    value: function handleResetHeading() {
      this.props.resetHeading(this.props.mapKey);
      this.setState({
        resetHeadingDisabled: true
      });
    }
  }, {
    key: "handleExaggeratePlus",
    value: function handleExaggeratePlus() {// const update = {elevation: this.props.view.elevation + this.exaggerationIncrement};
      // this.props.updateView(update, this.props.mapKey);
    }
  }, {
    key: "handleExaggerateMinus",
    value: function handleExaggerateMinus() {// const update = {elevation: Math.max(1, this.props.view.elevation - this.exaggerationIncrement)};
      // this.props.updateView(update, this.props.mapKey);
    }
  }, {
    key: "isZoomButtonActive",
    value: function isZoomButtonActive(type) {
      var definedLimits = this.props.viewLimits && this.props.viewLimits.boxRangeRange;
      var currentBoxRange = this.props.view && this.props.view.boxRange;

      if (this.props.levelsBased) {
        var currentLevel = map.view.getZoomLevelFromBoxRange(currentBoxRange, this.props.mapWidth, this.props.mapHeight);

        if (type === 'in') {
          var maxZoom = mapConstants.defaultLevelsRange[1];

          if (definedLimits && definedLimits[0]) {
            var definedLimitAsLevel = map.view.getZoomLevelFromBoxRange(definedLimits[0], this.props.mapWidth, this.props.mapHeight);

            if (definedLimitAsLevel < maxZoom) {
              maxZoom = definedLimitAsLevel;
            }
          }

          return currentLevel < maxZoom;
        } else {
          var minZoom = mapConstants.defaultLevelsRange[0];

          if (definedLimits && definedLimits[1]) {
            var _definedLimitAsLevel = map.view.getZoomLevelFromBoxRange(definedLimits[1], this.props.mapWidth, this.props.mapHeight);

            if (_definedLimitAsLevel > minZoom) {
              minZoom = _definedLimitAsLevel;
            }
          }

          return currentLevel > minZoom;
        }
      } else {
        if (type === 'in') {
          var limit = definedLimits && definedLimits[0] || mapConstants.minBoxRange;
          return currentBoxRange * (1 - this.zoomIncrement) >= limit;
        } else {
          var _limit = definedLimits && definedLimits[1] || mapConstants.maxBoxRange;

          return currentBoxRange * (1 + this.zoomIncrement) <= _limit;
        }
      }
    }
  }, {
    key: "render",
    value: function render() {
      var _this2 = this;

      // TODO different controls for 2D
      return /*#__PURE__*/React$1.createElement("div", {
        className: "ptr-map-controls"
      }, /*#__PURE__*/React$1.createElement("div", {
        className: "zoom-control control"
      }, /*#__PURE__*/React$1.createElement(Button, {
        onHold: function onHold() {
          _this2.handleZoomIn();
        },
        onClick: function onClick() {
          _this2.handleZoomIn();
        },
        disabled: !this.isZoomButtonActive('in')
      }, /*#__PURE__*/React$1.createElement(Icon, {
        icon: "plus-thick"
      })), /*#__PURE__*/React$1.createElement(Button, {
        onHold: function onHold() {
          _this2.handleZoomOut();
        },
        onClick: function onClick() {
          _this2.handleZoomOut();
        },
        disabled: !this.isZoomButtonActive('out')
      }, /*#__PURE__*/React$1.createElement(Icon, {
        icon: "minus-thick"
      }))), !this.props.zoomOnly ? /*#__PURE__*/React$1.createElement(React$1.Fragment, null, /*#__PURE__*/React$1.createElement("div", {
        className: "rotate-control control"
      }, /*#__PURE__*/React$1.createElement(Button, {
        onHold: function onHold() {
          _this2.handleHeadingRight();
        },
        onClick: function onClick() {
          _this2.handleHeadingRight();
        }
      }, /*#__PURE__*/React$1.createElement(Icon, {
        icon: "rotate-right"
      })), /*#__PURE__*/React$1.createElement(Button, {
        onClick: function onClick() {
          _this2.handleResetHeading();
        },
        disabled: this.state.resetHeadingDisabled
      }, /*#__PURE__*/React$1.createElement(Icon, {
        style: {
          transform: "rotate(".concat(this.props.view ? -this.props.view.heading : 0, "deg)")
        },
        icon: "north-arrow"
      })), /*#__PURE__*/React$1.createElement(Button, {
        onHold: function onHold() {
          _this2.handleHeadingLeft();
        },
        onClick: function onClick() {
          _this2.handleHeadingLeft();
        }
      }, /*#__PURE__*/React$1.createElement(Icon, {
        icon: "rotate-left"
      }))), /*#__PURE__*/React$1.createElement("div", {
        className: "tilt-control control"
      }, /*#__PURE__*/React$1.createElement(Button, {
        className: "tilt-more-control",
        onHold: function onHold() {
          _this2.handleTiltDown();
        },
        onClick: function onClick() {
          _this2.handleTiltDown();
        }
      }, /*#__PURE__*/React$1.createElement(Icon, {
        icon: "tilt-more"
      })), /*#__PURE__*/React$1.createElement(Button, {
        className: "tilt-more-control",
        onHold: function onHold() {
          _this2.handleTiltUp();
        },
        onClick: function onClick() {
          _this2.handleTiltUp();
        }
      }, /*#__PURE__*/React$1.createElement(Icon, {
        icon: "tilt-less"
      })))) : null);
    }
  }]);

  return MapControls;
}(React$1.PureComponent);

MapControls.propTypes = {
  view: PropTypes.object,
  viewLimits: PropTypes.object,
  updateView: PropTypes.func,
  resetHeading: PropTypes.func,
  mapKey: PropTypes.string,
  zoomOnly: PropTypes.bool,
  levelsBased: PropTypes.oneOfType([PropTypes.bool, PropTypes.array]),
  mapHeight: PropTypes.number,
  mapWidth: PropTypes.number
};

var index = /*#__PURE__*/Object.freeze({
  __proto__: null,
  'default': MapControls
});

var MapWrapper = /*#__PURE__*/function (_React$PureComponent) {
  _inherits(MapWrapper, _React$PureComponent);

  var _super = _createSuper(MapWrapper);

  function MapWrapper() {
    _classCallCheck(this, MapWrapper);

    return _super.apply(this, arguments);
  }

  _createClass(MapWrapper, [{
    key: "render",
    value: function render() {
      var props = this.props;
      var wrapperClasses = classnames('ptr-map-wrapper', {
        active: this.props.active
      });
      return /*#__PURE__*/React$1.createElement("div", {
        className: wrapperClasses
      }, /*#__PURE__*/React$1.createElement("div", {
        className: "ptr-map-wrapper-header"
      }, props.onMapRemove ? this.renderCloseButton() : null, props.title ? this.renderTitle() : null), this.props.children);
    }
  }, {
    key: "renderTitle",
    value: function renderTitle() {
      var title = this.props.title;

      if (title === true) {
        title = this.props.name || this.props.mapKey || 'Map';
      }

      return /*#__PURE__*/React$1.createElement("div", {
        className: "ptr-map-wrapper-title",
        title: title
      }, title);
    }
  }, {
    key: "renderCloseButton",
    value: function renderCloseButton() {
      var mapKey = this.props.stateMapKey || this.props.mapKey;
      return /*#__PURE__*/React$1.createElement("div", {
        className: "ptr-map-wrapper-close-button"
      }, /*#__PURE__*/React$1.createElement(Button, {
        icon: "times",
        inverted: true,
        invisible: true,
        onClick: this.props.onMapRemove.bind(this, mapKey)
      }));
    }
  }]);

  return MapWrapper;
}(React$1.PureComponent);

MapWrapper.propTypes = {
  active: PropTypes.bool,
  title: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
  onMapRemove: PropTypes.func
};
MapWrapper.defaultProps = {
  title: false
};

var Map = /*#__PURE__*/function (_React$PureComponent) {
  _inherits(Map, _React$PureComponent);

  var _super = _createSuper(Map);

  function Map() {
    _classCallCheck(this, Map);

    return _super.apply(this, arguments);
  }

  _createClass(Map, [{
    key: "render",
    value: function render() {
      return null;
    }
  }]);

  return Map;
}(React$1.PureComponent);

var PresentationMap = /*#__PURE__*/function (_React$PureComponent2) {
  _inherits(PresentationMap, _React$PureComponent2);

  var _super2 = _createSuper(PresentationMap);

  function PresentationMap() {
    _classCallCheck(this, PresentationMap);

    return _super2.apply(this, arguments);
  }

  _createClass(PresentationMap, [{
    key: "render",
    value: function render() {
      return null;
    }
  }]);

  return PresentationMap;
}(React$1.PureComponent);

var MapSet = /*#__PURE__*/function (_React$PureComponent3) {
  _inherits(MapSet, _React$PureComponent3);

  var _super3 = _createSuper(MapSet);

  function MapSet(props) {
    var _this;

    _classCallCheck(this, MapSet);

    _this = _super3.call(this, props);

    if (!props.stateMapSetKey) {
      _this.state = {
        view: map.view.mergeViews(mapConstants.defaultMapView, props.view),
        activeMapKey: props.activeMapKey,
        mapViews: {},
        mapsDimensions: {}
      };

      _forEach2(_this.props.children, function (child) {
        if (child && _typeof(child) === 'object' && (child.type === Map || child.type === _this.props.connectedMapComponent || child.type === PresentationMap) && child.props.mapKey === props.activeMapKey) {
          _this.state.mapViews[child.props.mapKey] = map.view.mergeViews(mapConstants.defaultMapView, props.view, child.props.view);
        }
      });
    } else {
      _this.state = {
        mapsDimensions: {}
      };
    }

    return _this;
  }

  _createClass(MapSet, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      if (this.props.onMount) {
        this.props.onMount();
      }
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      if (this.props.onUnmount) {
        this.props.onUnmount();
      }
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate(prevProps, prevState, snapshot) {
      var props = this.props;

      if (!props.stateMapSetKey) {
        if (prevProps.view !== props.view) {
          var mapViews = _mapValues2(this.state.mapViews, function (view) {
            return _objectSpread2(_objectSpread2({}, view), props.view);
          });

          this.setState({
            // TODO sync props to view only?
            view: _objectSpread2(_objectSpread2({}, this.state.view), props.view),
            mapViews: mapViews
          });
        }

        if (props.layers && props.layers !== prevProps.layers || props.backgroundLayer && props.backgroundLayer !== prevProps.backgroundLayer) {
          if (props.refreshUse) ;
        }
      }
    }
  }, {
    key: "onViewChange",
    value: function onViewChange(mapKey, update) {
      var _this2 = this;

      var syncUpdate;
      update = map.view.ensureViewIntegrity(update);
      mapKey = mapKey || this.state.activeMapKey;

      if (this.props.sync) {
        syncUpdate = _pickBy2(update, function (updateVal, updateKey) {
          return _this2.props.sync[updateKey];
        });
        syncUpdate = map.view.ensureViewIntegrity(syncUpdate);
      } // merge views of all maps


      var mapViews = _mapValues2(this.state.mapViews, function (view) {
        return map.view.mergeViews(view, syncUpdate);
      }); // merge views of given map


      mapViews[mapKey] = map.view.mergeViews(this.state.mapViews[mapKey], update);

      if (syncUpdate && !_isEmpty2(syncUpdate)) {
        var mergedView = map.view.mergeViews(this.state.view, syncUpdate);
        this.setState({
          view: mergedView,
          mapViews: mapViews
        });

        if (this.props.onViewChange) {
          this.props.onViewChange(mergedView);
        }
      } else {
        this.setState({
          mapViews: mapViews
        });
      }
    }
  }, {
    key: "onResetHeading",
    value: function onResetHeading() {
      var _this3 = this;

      map.resetHeading(this.state.mapViews[this.state.activeMapKey].heading, function (heading) {
        return _this3.onViewChange(_this3.state.activeMapKey, {
          heading: heading
        });
      });
    }
    /**
     * Called in uncontrolled map set
     * @param key
     * @param view
     */

  }, {
    key: "onMapClick",
    value: function onMapClick(key, view) {
      if (this.state.mapViews[key]) {
        this.setState({
          activeMapKey: key
        });
      } else {
        var mapViews = _objectSpread2({}, this.state.mapViews);

        mapViews[key] = view;
        this.setState({
          activeMapKey: key,
          mapViews: mapViews
        });
      }
    }
  }, {
    key: "onMapResize",
    value: function onMapResize(mapKey, width, height) {
      var mapsDimensions = _objectSpread2(_objectSpread2({}, this.state.mapsDimensions), {}, _defineProperty({}, mapKey, {
        width: width,
        height: height
      }));

      this.setState({
        mapsDimensions: mapsDimensions
      });
    }
  }, {
    key: "render",
    value: function render() {
      return /*#__PURE__*/React$1.createElement("div", {
        className: "ptr-map-set"
      }, /*#__PURE__*/React$1.createElement("div", {
        className: "ptr-map-set-maps"
      }, this.renderMaps()), /*#__PURE__*/React$1.createElement("div", {
        className: "ptr-map-set-controls"
      }, this.renderControls()));
    }
  }, {
    key: "renderControls",
    value: function renderControls() {
      var updateView, resetHeading, view, mapKey, activeMapDimensions;

      if (this.props.stateMapSetKey) {
        updateView = this.props.updateView;
        resetHeading = this.props.resetHeading;
        view = this.props.activeMapView || this.props.view;
        mapKey = this.props.activeMapKey;
        activeMapDimensions = this.props.activeMapViewport;
      } else {
        updateView = this.onViewChange.bind(this, null);
        resetHeading = this.onResetHeading.bind(this);
        view = map.view.mergeViews(this.state.view, this.state.mapViews[this.state.activeMapKey]);
        mapKey = this.state.activeMapKey;
        activeMapDimensions = this.state.mapsDimensions && this.state.mapsDimensions[this.state.activeMapKey];
      }

      return React$1.Children.map(this.props.children, function (child) {
        if (!(_typeof(child) === 'object' && child.type === Map)) {
          return /*#__PURE__*/React$1.cloneElement(child, _objectSpread2(_objectSpread2({}, child.props), {}, {
            view: view,
            updateView: updateView,
            resetHeading: resetHeading,
            mapKey: mapKey,
            mapWidth: activeMapDimensions && activeMapDimensions.width,
            mapHeight: activeMapDimensions && activeMapDimensions.height
          }));
        }
      });
    }
  }, {
    key: "renderMaps",
    value: function renderMaps() {
      var _this4 = this;

      var maps = []; // For now, render either maps from state, OR from children

      if (this.props.stateMapSetKey) {
        // all from state
        if (this.props.maps && this.props.maps.length) {
          this.props.maps.map(function (mapKey) {
            var props = {
              key: mapKey,
              stateMapKey: mapKey,
              onResize: _this4.onMapResize.bind(_this4, mapKey)
            };
            maps.push(_this4.renderMap(_this4.props.connectedMapComponent, _objectSpread2(_objectSpread2({}, props), {}, {
              mapComponent: _this4.props.mapComponent
            }), null, mapKey === _this4.props.activeMapKey));
          });
        }
      } else {
        React$1.Children.map(this.props.children, function (child, index) {
          var _child$props = child.props,
              view = _child$props.view,
              layers = _child$props.layers,
              backgroundLayer = _child$props.backgroundLayer,
              mapKey = _child$props.mapKey,
              restProps = _objectWithoutProperties(_child$props, ["view", "layers", "backgroundLayer", "mapKey"]);

          var props = _objectSpread2(_objectSpread2({}, restProps), {}, {
            key: index,
            view: map.view.mergeViews(_this4.state.view, view, _this4.state.mapViews[mapKey]),
            backgroundLayer: backgroundLayer || _this4.props.backgroundLayer,
            layers: map.mergeLayers(_this4.props.layers, layers),
            onViewChange: _this4.onViewChange.bind(_this4, mapKey),
            onClick: _this4.onMapClick.bind(_this4, mapKey),
            onResize: _this4.onMapResize.bind(_this4, mapKey),
            mapKey: mapKey
          });

          if (_typeof(child) === 'object' && (child.type === Map || child.type === _this4.props.connectedMapComponent)) {
            // layers from state
            maps.push(_this4.renderMap(_this4.props.connectedMapComponent, _objectSpread2(_objectSpread2({}, props), {}, {
              mapComponent: _this4.props.mapComponent
            }), null, mapKey === _this4.state.activeMapKey));
          } else if (_typeof(child) === 'object' && child.type === PresentationMap) {
            // all presentational
            maps.push(_this4.renderMap(_this4.props.mapComponent || child.props.mapComponent, props, child.props.children, mapKey === _this4.state.activeMapKey, true));
          }
        });
      }

      return /*#__PURE__*/React$1.createElement(MapGrid, null, maps);
    }
  }, {
    key: "renderMap",
    value: function renderMap(mapComponent, props, children, active, renderWrapper) {
      // TODO custom wrapper component
      if (this.props.wrapper) {
        var wrapperProps = this.props.wrapperProps;

        if (this.props.onMapRemove && !this.props.disableMapRemoval) {
          wrapperProps = _objectSpread2(_objectSpread2({}, this.props.wrapperProps), {}, {
            onMapRemove: this.props.onMapRemove
          });
        }

        var allProps = _objectSpread2(_objectSpread2(_objectSpread2({}, props), wrapperProps), {}, {
          wrapper: this.props.wrapper,
          active: active
        }); // Render wrapper here, if mapComponent is final (framework-specific) map component


        if (renderWrapper) {
          var wrapperComponent = this.props.wrapper.prototype && this.props.wrapper.prototype.isReactComponent || typeof this.props.wrapper === 'function' ? this.props.wrapper : MapWrapper;
          return /*#__PURE__*/React$1.createElement(wrapperComponent, allProps, /*#__PURE__*/React$1.createElement(mapComponent, props, children));
        } else {
          return /*#__PURE__*/React$1.createElement(mapComponent, allProps, children);
        }
      } else {
        return /*#__PURE__*/React$1.createElement(mapComponent, props, children);
      }
    }
  }]);

  return MapSet;
}(React$1.PureComponent);

MapSet.defaultProps = {
  disableMapRemoval: false
};
MapSet.propTypes = {
  activeMapKey: PropTypes.string,
  activeMapView: PropTypes.object,
  activeMapViewport: PropTypes.object,
  disableMapRemoval: PropTypes.bool,
  mapSetKey: PropTypes.string,
  maps: PropTypes.array,
  mapComponent: PropTypes.func,
  view: PropTypes.object,
  stateMapSetKey: PropTypes.string,
  sync: PropTypes.object,
  wrapper: PropTypes.oneOfType([PropTypes.elementType, PropTypes.element, PropTypes.bool]),
  wrapperProps: PropTypes.object
};
var MapSetMap = Map;
var MapSetPresentationMap = PresentationMap;

var index$1 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  MapSetMap: MapSetMap,
  MapSetPresentationMap: MapSetPresentationMap,
  'default': MapSet
});

var MapTools = (function (props) {
  return /*#__PURE__*/React$1.createElement("div", {
    className: "map-tools"
  }, props.children);
});

var PresentationMap$1 = /*#__PURE__*/function (_React$PureComponent) {
  _inherits(PresentationMap, _React$PureComponent);

  var _super = _createSuper(PresentationMap);

  function PresentationMap(props) {
    var _this;

    _classCallCheck(this, PresentationMap);

    _this = _super.call(this, props);
    _this.state = {
      width: null,
      height: null
    };

    if (!props.stateMapKey) {
      _this.state.view = _objectSpread2(_objectSpread2({}, mapConstants.defaultMapView), props.view);
    }

    _this.onViewChange = _this.onViewChange.bind(_assertThisInitialized(_this));
    _this.onPropViewChange = _this.onPropViewChange.bind(_assertThisInitialized(_this));
    _this.resetHeading = _this.resetHeading.bind(_assertThisInitialized(_this));
    _this.onResize = _this.onResize.bind(_assertThisInitialized(_this));
    return _this;
  }

  _createClass(PresentationMap, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      if (this.props.onMount) {
        this.props.onMount(this.state.width, this.state.height);
      }
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate(prevProps) {
      var props = this.props;

      if (props.view) {
        var view = this.getValidView(props.view);

        if (prevProps && prevProps.view) {
          //todo simplify
          if (!_isEqual2(props.view, prevProps.view)) {
            if (!this.props.stateMapKey) {
              this.saveViewChange(view, false);
            } else {
              this.onPropViewChange(view);
            }
          }
        } else {
          if (!this.props.stateMapKey) {
            this.saveViewChange(view, true);
          } else {
            this.onPropViewChange(view);
          }
        }
      }

      if (props.layers && props.layers !== prevProps.layers || props.backgroundLayer && props.backgroundLayer !== prevProps.backgroundLayer) ;
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      if (this.props.onUnmount) {
        this.props.onUnmount();
      }
    }
  }, {
    key: "onViewChangeDecorator",
    value: function onViewChangeDecorator(onViewChange) {
      var _this2 = this;

      return function (update) {
        onViewChange(update, _this2.state.width, _this2.state.height);
      };
    }
  }, {
    key: "getValidView",
    value: function getValidView(update) {
      var view = _objectSpread2(_objectSpread2({}, mapConstants.defaultMapView), view);

      if (this.state.view && !_isEmpty2(this.state.view)) {
        view = _objectSpread2(_objectSpread2({}, this.state.view), update);
      }

      view = map.view.ensureViewIntegrity(view);
      return view;
    }
  }, {
    key: "saveViewChange",
    value: function saveViewChange(view, checkViewEquality) {
      if (checkViewEquality && !_isEqual2(view, this.state.view)) {
        if (!this.props.stateMapKey) {
          this.setState({
            view: view
          });
        }
      }
    }
  }, {
    key: "onViewChange",
    value: function onViewChange(update) {
      var view = this.getValidView(update);
      this.saveViewChange(view, true);

      if (!_isEqual2(view, this.state.view)) {
        if (this.props.onViewChange && !this.props.stateMapKey) {
          this.onViewChangeDecorator(this.props.onViewChange)(view);
        }
      }
    }
  }, {
    key: "onPropViewChange",
    value: function onPropViewChange(view) {
      if (this.props.stateMapKey && this.props.onPropViewChange) {
        this.onViewChangeDecorator(this.props.onPropViewChange)(view);
      }
    }
  }, {
    key: "resetHeading",
    value: function resetHeading() {
      var _this3 = this;

      map.resetHeading(this.state.view.heading, function (heading) {
        return _this3.setState({
          view: _objectSpread2(_objectSpread2({}, _this3.state.view), {}, {
            heading: heading
          })
        });
      });
    }
  }, {
    key: "onResize",
    value: function onResize(width, height) {
      if (this.props.onResize) {
        this.props.onResize(width, height);
      }

      this.setState({
        width: width,
        height: height
      });
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props = this.props,
          children = _this$props.children,
          mapComponent = _this$props.mapComponent,
          wrapper = _this$props.wrapper,
          wrapperProps = _this$props.wrapperProps,
          props = _objectWithoutProperties(_this$props, ["children", "mapComponent", "wrapper", "wrapperProps"]);

      if (!mapComponent) {
        return /*#__PURE__*/React$1.createElement(Error$1, {
          centered: true
        }, "mapComponent not supplied to Map");
      } else {
        props.onResize = this.onResize;

        if (!props.stateMapKey) {
          props.view = this.state.view || props.view;
          props.onViewChange = this.onViewChange;
        }

        if (wrapper) {
          var wrapperComponent = this.props.wrapper.prototype && this.props.wrapper.prototype.isReactComponent || typeof this.props.wrapper === 'function' ? this.props.wrapper : MapWrapper;
          return /*#__PURE__*/React$1.createElement(wrapperComponent, _objectSpread2(_objectSpread2({}, props), wrapperProps), this.renderContent(mapComponent, props, children));
        } else {
          return this.renderContent(mapComponent, props, children);
        }
      }
    }
  }, {
    key: "renderContent",
    value: function renderContent(mapComponent, props, children) {
      var _this4 = this;

      var map = /*#__PURE__*/React$1.createElement(mapComponent, props);

      if (!children) {
        return map;
      } else {
        return /*#__PURE__*/React$1.createElement("div", {
          className: "ptr-map-controls-wrapper"
        }, map, React$1.Children.map(children, function (child) {
          var _this4$props$viewport, _this4$props$viewport2;

          return /*#__PURE__*/React$1.cloneElement(child, _objectSpread2(_objectSpread2({}, child.props), {}, {
            view: props.view,
            viewLimits: _this4.props.viewLimits,
            updateView: props.onViewChange,
            resetHeading: _this4.props.stateMapKey ? _this4.props.resetHeading : _this4.resetHeading,
            mapWidth: _this4.props.stateMapKey ? (_this4$props$viewport = _this4.props.viewport) === null || _this4$props$viewport === void 0 ? void 0 : _this4$props$viewport.width : _this4.state.width,
            mapHeight: _this4.props.stateMapKey ? (_this4$props$viewport2 = _this4.props.viewport) === null || _this4$props$viewport2 === void 0 ? void 0 : _this4$props$viewport2.height : _this4.state.height
          }));
        }));
      }
    }
  }]);

  return PresentationMap;
}(React$1.PureComponent);

PresentationMap$1.propTypes = {
  backgroundLayer: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  children: PropTypes.element,
  layers: PropTypes.array,
  mapComponent: PropTypes.oneOfType([PropTypes.element, PropTypes.func]),
  onMount: PropTypes.func,
  onPropViewChange: PropTypes.func,
  onResize: PropTypes.func,
  onViewChange: PropTypes.func,
  resetHeading: PropTypes.func,
  stateMapKey: PropTypes.string,
  view: PropTypes.object,
  viewport: PropTypes.object,
  viewLimits: PropTypes.object,
  wrapper: PropTypes.oneOfType([PropTypes.elementType, PropTypes.element, PropTypes.bool]),
  wrapperProps: PropTypes.object
};

var _Map = /*#__PURE__*/Object.freeze({
  __proto__: null,
  'default': PresentationMap$1
});

function getLeafletViewFromViewParams(view, width, height) {
  var completeView = _objectSpread2(_objectSpread2({}, mapConstants.defaultMapView), view);

  return {
    zoom: map.view.getZoomLevelFromBoxRange(completeView.boxRange, width, height),
    center: {
      lat: completeView.center.lat,
      lng: completeView.center.lon
    }
  };
}

function getLeafletViewportFromViewParams(view, width, height) {
  var leafletView = getLeafletViewFromViewParams(view, width, height);
  return {
    zoom: leafletView.zoom,
    center: [leafletView.center.lat, leafletView.center.lng]
  };
}

function update(map, view, width, height) {
  var stateCenter = map.getCenter();
  var stateZoom = map.getZoom();
  var leafletUpdate = getLeafletViewFromViewParams(view, width, height);

  if (stateCenter.lat !== leafletUpdate.center.lat || stateCenter.lng !== leafletUpdate.center.lng || stateZoom !== leafletUpdate.zoom) {
    map.setView(leafletUpdate.center || stateCenter, leafletUpdate.zoom || stateZoom);
  }
}

var viewHelpers = {
  getLeafletViewportFromViewParams: getLeafletViewportFromViewParams,
  update: update
};

var svg = (function (props) {
  var svgSize = 32;
  var offset = 0;

  if (props.outlineWidth) {
    svgSize += props.outlineWidth;
    offset = props.outlineWidth / 2;
  }

  return /*#__PURE__*/React$1.createElement("svg", {
    version: "1.1",
    xmlns: "http://www.w3.org/2000/svg",
    xmlnsXlink: "http://www.w3.org/1999/xlink",
    x: "0px",
    y: "0px",
    width: svgSize + 'px',
    height: svgSize + 'px',
    viewBox: "0 0 ".concat(svgSize, " ").concat(svgSize),
    xmlSpace: "preserve",
    className: "ptr-map-shape ".concat(props.className || ''),
    style: props.style
  }, /*#__PURE__*/React$1.createElement(props.children, _objectSpread2(_objectSpread2({}, props), {}, {
    offset: offset
  })));
});

var Cross = function Cross(props) {
  return /*#__PURE__*/React$1.createElement("g", {
    transform: "translate(".concat(props.offset, " ").concat(props.offset, ")")
  }, /*#__PURE__*/React$1.createElement("path", {
    vectorEffect: "non-scaling-stroke",
    d: "M 1,1 31,31"
  }), /*#__PURE__*/React$1.createElement("path", {
    vectorEffect: "non-scaling-stroke",
    d: "M 1,31 31,1"
  }));
};

var Cross$1 = (function (props) {
  return /*#__PURE__*/React$1.createElement(svg, props, Cross);
});

var Pin = function Pin(props) {
  return /*#__PURE__*/React$1.createElement("g", {
    transform: "translate(".concat(props.offset, " ").concat(props.offset + props.offset / 4, ")")
  }, /*#__PURE__*/React$1.createElement("path", {
    vectorEffect: "non-scaling-stroke",
    d: "M 27,10.999999 C 26.999936,4.924849 22.075087,0 16,0 9.9249129,0 5.0000636,4.924849 5,10.999999 4.9998451,13.460703 6.2398215,15.834434 8.6666665,18.857143 11.093512,21.879851 13.424935,25.819509 16,32 18.614084,25.725879 20.878951,21.8993 23.333333,18.857143 25.787715,15.814985 26.999857,13.488539 27,10.999999 Z"
  }), props.icon ? /*#__PURE__*/React$1.createElement("g", {
    transform: "translate(9 3.5) scale(0.4375 0.4375)"
  }, props.icon) : null);
};

var Pin$1 = (function (props) {
  return /*#__PURE__*/React$1.createElement(svg, props, Pin);
});

var shapes = {
  cross: {
    anchorPoint: [0.5, 0.5],
    component: Cross$1
  },
  pin: {
    anchorPoint: [0.5, 1],
    component: Pin$1
  }
};

/**
 * It enables to draw various shapes as marker icon.
 * @augments L.DivIcon
 * @param props {object}
 * @param props.basicShape {bool} If true -> DIV element, if false -> SVG element
 * @param props.icon {Object} Icon definition
 * @param props.icon.component {React.Component}
 * @param props.icon.componentProps {React.Object} Additional icon component props
 * @param props.id {string}
 * @param props.iconAnchor {string} https://leafletjs.com/reference-1.7.1.html#icon-iconanchor
 * @param props.onClick {function} onclick callback
 * @param props.onMouseMove {function} mousemove callback
 * @param props.onMouseOver {function} mouseover callback
 * @param props.onMouseOut {function} mouseout callback
 * @param props.shape {Object} Shape definition
 * @param props.shape.component {React.Component}
 * @param props.shape.componentProps {React.Object} Additional shape component props
 * @param props.style {string} Extended Leaflet style (see getSvgStyle method for details)
 */

var MarkerShape = /*#__PURE__*/function (_L$DivIcon) {
  _inherits(MarkerShape, _L$DivIcon);

  var _super = _createSuper(MarkerShape);

  function MarkerShape(props) {
    var _this;

    _classCallCheck(this, MarkerShape);

    _this = _super.call(this, props); // Needed by L.DivIcon

    _this.iconAnchor = props.iconAnchor;
    _this.basicShape = props.basicShape;
    _this.id = props.id;
    _this.style = props.style;
    _this.shape = props.shape;
    _this.icon = props.icon;
    _this.onMouseMove = props.onMouseMove;
    _this.onMouseOver = props.onMouseOver;
    _this.onMouseOut = props.onMouseOut;
    _this.onClick = props.onClick;
    return _this;
  }
  /**
   * Overwrite ancestor's method
   * @param oldShape
   * @return {HTMLDivElement}
   */


  _createClass(MarkerShape, [{
    key: "createIcon",
    value: function createIcon(oldShape) {
      var div;

      if (oldShape && oldShape.tagName === 'DIV') {
        div = oldShape;
      } else {
        div = document.createElement('div');
        div.id = this.id;

        if (this.onMouseMove) {
          div.addEventListener('mousemove', this.onMouseMove);
        }

        if (this.onMouseOver) {
          div.addEventListener('mouseover', this.onMouseOver);
        }

        if (this.onMouseOut) {
          div.addEventListener('mouseout', this.onMouseOut);
        }

        if (this.onClick) {
          div.addEventListener('click', this.onClick);
        }
      }

      var html = this.getShapeHtml();

      if (html instanceof Element) {
        div.appendChild(html);
      } else {
        div.innerHTML = html !== false ? html : '';
      }

      this._setIconStyles(div, 'icon');

      return div;
    }
    /**
     * Prepare html of the icon based on shape and icon components
     * @return {string}
     */

  }, {
    key: "getShapeHtml",
    value: function getShapeHtml() {
      // Basic shape -> no need for svg
      if (this.basicShape) {
        var style = helpers.getMarkerShapeCssStyle(this.style);
        return ReactDOMServer.renderToString( /*#__PURE__*/React$1.createElement("div", {
          style: style
        }));
      } else {
        var finalShape;

        var _style = helpers.getMarkerShapeSvgStyle(this.style); // Combined shape and icon
        // Currently only shape="pin" is suitable for combination


        if (this.shape && this.icon) {
          finalShape = this.getShapeWithIcon(_style);
        } // Just shape
        else if (this.shape) {
            finalShape = this.getShape(_style);
          } // No shape, but icon? Use icon as shape
          else if (this.icon) {
              finalShape = this.getIcon(_style);
            }

        return ReactDOMServer.renderToString(finalShape);
      }
    }
    /**
     * @param style {Object} style object suitable for SVG
     * @return {React.DetailedReactHTMLElement<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>}
     */

  }, {
    key: "getShape",
    value: function getShape(style) {
      var props = this.shape.componentProps ? _objectSpread2(_objectSpread2({}, this.shape.componentProps), {}, {
        style: style
      }) : {
        style: style
      };
      return /*#__PURE__*/React$1.createElement(this.shape.component, _objectSpread2(_objectSpread2({}, props), {}, {
        outlineWidth: this.style.weight
      }));
    }
    /**
     * @param style {Object} style object suitable for SVG
     * @return {React.DetailedReactHTMLElement<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>}
     */

  }, {
    key: "getIcon",
    value: function getIcon(style) {
      var iconStyle = _objectSpread2(_objectSpread2({}, style), {}, {
        fill: style.iconFill ? style.iconFill : style.fill
      });

      var props = this.icon.componentProps ? _objectSpread2(_objectSpread2({}, this.icon.componentProps), {}, {
        style: iconStyle
      }) : {
        style: iconStyle
      };
      return /*#__PURE__*/React$1.createElement(this.icon.component, props);
    }
    /**
     * @param style {Object} style object suitable for SVG
     * @return {React.DetailedReactHTMLElement<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>}
     */

  }, {
    key: "getShapeWithIcon",
    value: function getShapeWithIcon(style) {
      var iconStyle = {
        strokeWidth: 0
      }; // TODO think about icons styling inside shape

      var iconFill = style.iconFill,
          shapeStyle = _objectWithoutProperties(style, ["iconFill"]);

      if (iconFill) {
        iconStyle.fill = iconFill;
      } else {
        iconStyle.fill = shapeStyle.stroke;
      }

      var iconProps = this.icon.componentProps ? _objectSpread2(_objectSpread2({}, this.icon.componentProps), {}, {
        style: iconStyle
      }) : {
        style: iconStyle
      };
      var iconComponent = /*#__PURE__*/React$1.createElement(this.icon.component, iconProps);
      var props = this.shape.componentProps ? _objectSpread2(_objectSpread2({}, this.shape.componentProps), {}, {
        style: shapeStyle
      }) : {
        style: shapeStyle
      };
      return /*#__PURE__*/React$1.createElement(this.shape.component, _objectSpread2(_objectSpread2({}, props), {}, {
        icon: iconComponent,
        outlineWidth: this.style.weight
      }));
    }
    /**
     * Set style of element
     * @param style {Object} Leaflet style definition
     * @param id {string} id of the shape
     * @param isBasicShape {bool} If true -> DIV element, if false -> SVG element
     */

  }, {
    key: "setStyle",
    value: function setStyle(style, id, isBasicShape) {
      var _element$children;

      id = id || this.id;
      isBasicShape = isBasicShape || this.basicShape;
      var shapeStyle = isBasicShape ? helpers.getMarkerShapeCssStyle(style) : helpers.getMarkerShapeSvgStyle(style);
      var element = document.getElementById(id);
      var shape = element === null || element === void 0 ? void 0 : (_element$children = element.children) === null || _element$children === void 0 ? void 0 : _element$children[0];

      if (shape) {
        _forIn2(shapeStyle, function (value, key) {
          shape.style[key] = value;
        });
      }
    }
  }]);

  return MarkerShape;
}(L$1.DivIcon);

/**
 * @param feature {GeoJSONFeature}
 * @param styleDefinition {Object} Panther style definition
 * @return {Object}
 */

function getDefaultStyleObject(feature, styleDefinition) {
  return mapStyle.getStyleObject(feature.properties, styleDefinition || constants.vectorFeatureStyle.defaultFull);
}
/**
 * @param selectedStyleDefinition {Object} Panther style definition
 * @return {Object}
 */


function getSelectedStyleObject(selectedStyleDefinition) {
  return selectedStyleDefinition === 'default' ? constants.vectorFeatureStyle.selected : selectedStyleDefinition;
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
  var style = _objectSpread2(_objectSpread2({}, defaultStyleObject), accentedStyleObject);

  return getFeatureLeafletStyle(feature, style);
}
/**
 * @param feature {GeoJSONFeature}
 * @param style {Object} Panther style definition
 * @return {Object} Leaflet style definition
 */


function getFeatureLeafletStyle(feature, style) {
  style.outlineColor;
      style.outlineWidth;
      style.outlineOpacity;
      style.fillOpacity;
      style.fill;
      style.size;
      style.volume;
      var finalStyle = _objectWithoutProperties(style, ["outlineColor", "outlineWidth", "outlineOpacity", "fillOpacity", "fill", "size", "volume"]);

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


var convertCoordinatesMemo = memoize(function (feature) {
  // TODO do we need turf for this?
  var flippedFeature = flip(feature);
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
    hoveredStyleObject = hoveredStyleDefinition === 'default' ? constants.vectorFeatureStyle.hovered : hoveredStyleDefinition;
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
      selectedHoveredStyleObject = selectedHoveredStyleDefinition === 'default' ? constants.vectorFeatureStyle.selectedHovered : selectedHoveredStyleDefinition;
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

var calculateStylesMemo = memoize(calculateStyle);
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
    shape = shapes[shapeKey] || null;
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

  return new MarkerShape({
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
      var rgb = mapStyle.hexToRgb(leafletStyle.fillColor);
      style['backgroundColor'] = "rgba(".concat(rgb.r, ",").concat(rgb.g, ",").concat(rgb.b, ",").concat(leafletStyle.fillOpacity, ")");
    } else {
      style['backgroundColor'] = leafletStyle.fillColor;
    }
  }

  if (leafletStyle.color) {
    if (leafletStyle.opacity && leafletStyle.opacity !== 1) {
      var _rgb = mapStyle.hexToRgb(leafletStyle.color);

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

var helpers = {
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

/*
  Generic  Canvas Layer for leaflet 0.7 and 1.0-rc, 1.2, 1.3
  copyright Stanislav Sumbera,  2016-2018, sumbera.com , license MIT
  originally created and motivated by L.CanvasOverlay  available here: https://gist.github.com/Sumbera/11114288

  also thanks to contributors: heyyeyheman,andern,nikiv3, anyoneelse ?
  enjoy !
*/

DomUtil.setTransform = DomUtil.setTransform || function (el, offset, scale) {
  var pos = offset || new Point(0, 0);
  el.style[DomUtil.TRANSFORM] = (Browser.ie3d ? 'translate(' + pos.x + 'px,' + pos.y + 'px)' : 'translate3d(' + pos.x + 'px,' + pos.y + 'px,0)') + (scale ? ' scale(' + scale + ')' : '');
}; // -- support for both  0.0.7 and 1.0.0 rc2 leaflet


var CanvasLayer = (Layer ? Layer : Class).extend({
  // -- initialized is called on prototype
  initialize: function initialize(options) {
    this._paneName = options.paneName;
    this._paneZindex = options.paneZindex;
    this._map = null;
    this._canvas = null;
    this._frame = null;
    this._delegate = null;
    setOptions(this, options);
  },
  delegate: function delegate(del) {
    this._delegate = del;
    return this;
  },
  needRedraw: function needRedraw() {
    if (!this._frame) {
      this._frame = Util.requestAnimFrame(this.drawLayer, this);
    }

    return this;
  },
  //-------------------------------------------------------------
  _onLayerDidResize: function _onLayerDidResize(resizeEvent) {
    this._canvas.width = resizeEvent.newSize.x;
    this._canvas.height = resizeEvent.newSize.y;
  },
  //-------------------------------------------------------------
  _onLayerDidMove: function _onLayerDidMove(e) {
    var _this$_topLeft;

    var topLeft = this._map.containerPointToLayerPoint([0, 0]);

    if (topLeft.x !== ((_this$_topLeft = this._topLeft) === null || _this$_topLeft === void 0 ? void 0 : _this$_topLeft.x) || topLeft.y !== this._topLeft.y) {
      this._topLeft = topLeft;
      DomUtil.setPosition(this._canvas, topLeft);
      this.drawLayer();
    }
  },
  _onLayerDidZoom: function _onLayerDidZoom(e) {
    if (this.props.type !== 'tiledVector') {
      var topLeft = this._map.containerPointToLayerPoint([0, 0]);

      DomUtil.setPosition(this._canvas, topLeft);
      this.needRedraw();
    }
  },
  //-------------------------------------------------------------
  getEvents: function getEvents() {
    var events = {
      resize: this._onLayerDidResize,
      moveend: this._onLayerDidMove,
      zoom: this._onLayerDidZoom
    };

    if (this._map.options.zoomAnimation && Browser.any3d) {
      events.zoomanim = this._animateZoom;
    }

    return events;
  },
  //-------------------------------------------------------------
  onAdd: function onAdd(map) {
    this._map = map;
    this._canvas = DomUtil.create('canvas', 'leaflet-layer');
    this.tiles = {};

    var size = this._map.getSize();

    this._canvas.width = size.x;
    this._canvas.height = size.y;
    var animated = this._map.options.zoomAnimation && Browser.any3d;
    DomUtil.addClass(this._canvas, 'leaflet-zoom-' + (animated ? 'animated' : 'hide'));

    var topLeft = this._map.containerPointToLayerPoint([0, 0]);

    DomUtil.setPosition(this._canvas, topLeft);

    var pane = this._map.getPane(this._paneName);

    if (!pane) {
      pane = this._map.createPane(this._paneName);
      pane.style.zIndex = this._paneZindex;
    }

    pane.appendChild(this._canvas);
    map.on(this.getEvents(), this);
    var del = this._delegate || this;
    del.onLayerDidMount && del.onLayerDidMount(); // -- callback

    this.needRedraw();
  },
  //-------------------------------------------------------------
  onRemove: function onRemove(map) {
    var del = this._delegate || this;
    del.onLayerWillUnmount && del.onLayerWillUnmount(); // -- callback

    if (this._frame) {
      Util.cancelAnimFrame(this._frame);
    }

    map.getPane(this._paneName).removeChild(this._canvas);
    map.off(this.getEvents(), this);
    this._canvas = null;
  },
  //------------------------------------------------------------
  addTo: function addTo(map) {
    map.addLayer(this);
    return this;
  },
  // --------------------------------------------------------------------------------
  LatLonToMercator: function LatLonToMercator(latlon) {
    return {
      x: latlon.lng * 6378137 * Math.PI / 180,
      y: Math.log(Math.tan((90 + latlon.lat) * Math.PI / 360)) * 6378137
    };
  },
  //------------------------------------------------------------------------------
  drawLayer: function drawLayer() {
    if (this._map) {
      var size = this._map.getSize();

      var bounds = this._map.getBounds();

      var zoom = this._map.getZoom();

      var center = this.LatLonToMercator(this._map.getCenter());
      var corner = this.LatLonToMercator(this._map.containerPointToLatLng(this._map.getSize()));
      var del = this._delegate || this;
      del.onDrawLayer && del.onDrawLayer({
        layer: this,
        canvas: this._canvas,
        bounds: bounds,
        size: size,
        zoom: zoom,
        center: center,
        corner: corner
      });
      this._frame = null;
    }
  },
  // -- L.DomUtil.setTransform from leaflet 1.0.0 to work on 0.0.7
  //------------------------------------------------------------------------------
  _setTransform: function _setTransform(el, offset, scale) {
    var pos = offset || new Point(0, 0);
    el.style[DomUtil.TRANSFORM] = (Browser.ie3d ? 'translate(' + pos.x + 'px,' + pos.y + 'px)' : 'translate3d(' + pos.x + 'px,' + pos.y + 'px,0)') + (scale ? ' scale(' + scale + ')' : '');
  },
  //------------------------------------------------------------------------------
  _animateZoom: function _animateZoom(e) {
    var scale = this._map.getZoomScale(e.zoom); // -- different calc of animation zoom  in leaflet 1.0.3 thanks @peterkarabinovic, @jduggan1


    var offset = Layer ? this._map._latLngBoundsToNewLayerBounds(this._map.getBounds(), e.zoom, e.center).min : this._map._getCenterOffset(e.center)._multiplyBy(-scale).subtract(this._map._getMapPanePos());
    DomUtil.setTransform(this._canvas, offset, scale);
  }
});

function setPolygonStyle(context, style) {
  if (style.fill) {
    context.fillStyle = style.fill;

    if (style.fillOpacity) {
      context.fillStyle = chroma(style.fill).alpha(style.fillOpacity).hex();
    }

    context.fill();
  }

  if (style.outlineColor && style.outlineWidth) {
    context.lineWidth = style.outlineWidth;
    context.strokeStyle = style.outlineColor;

    if (style.outlineOpacity) {
      context.strokeStyle = chroma(style.outlineColor).alpha(style.outlineOpacity).hex();
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
      context.strokeStyle = chroma(style.outlineColor).alpha(style.outlineOpacity).hex();
    }

    context.lineJoin = 'round';
    context.lineCap = 'round';
    context.stroke();
  }
}

function getSize(definedSize, pixelSizeInMeters) {
  var size = pixelSizeInMeters ? definedSize / pixelSizeInMeters : definedSize;
  return size < 0.5 ? 0.5 : size;
}

var helpers$1 = {
  setLineStyle: setLineStyle,
  setPolygonStyle: setPolygonStyle,
  getSize: getSize
};

/**
 * Draw shape to the given canvas
 * @param context {Object} canvas context
 * @param center {Object} center point of the shape
 * @param style {Object} Panther style definition
 * @param pixelSizeInMeters {number | null}
 */

function draw(context, center, style, pixelSizeInMeters) {
  // TODO add other shapes
  if (style.shape === 'square') {
    square(context, center, style, pixelSizeInMeters);
  } else {
    circle(context, center, style, pixelSizeInMeters);
  }
}

function square(context, center, style, pixelSizeInMeters) {
  var size = helpers$1.getSize(style.size, pixelSizeInMeters);
  var a = 2 * size; // side length

  context.beginPath();
  context.rect(center.x - a / 2, center.y - a / 2, a, a);
  helpers$1.setPolygonStyle(context, style);
  context.closePath();
}

function circle(context, center, style, pixelSizeInMeters) {
  context.beginPath();
  var size = helpers$1.getSize(style.size, pixelSizeInMeters);
  context.arc(Math.floor(center.x), Math.floor(center.y), size, 0, Math.PI * 2);
  helpers$1.setPolygonStyle(context, style);
  context.closePath();
}

var shapes$1 = {
  draw: draw
};

/**
 * Draw shape to the given canvas
 * @param context {Object} canvas context
 * @param coordinates {Array}
 * @param style {Object} Panther style definition
 */

function drawPolygon(context, coordinates, style) {
  context.beginPath();
  coordinates.forEach(function (linearRing) {
    var start = linearRing[0];
    var rest = linearRing.slice(1);
    context.moveTo(Math.floor(start.x), Math.floor(start.y));
    rest.forEach(function (point) {
      context.lineTo(Math.floor(point.x), Math.floor(point.y));
    });
    context.closePath();
  });
  helpers$1.setPolygonStyle(context, style);
}

function drawMultiPolygon(context, coordinates, style) {
  coordinates.map(function (polygon) {
    return drawPolygon(context, polygon, style);
  });
}

var polygons = {
  drawPolygon: drawPolygon,
  drawMultiPolygon: drawMultiPolygon
};

/**
 * Draw shape to the given canvas
 * @param context {Object} canvas context
 * @param coordinates {Array}
 * @param style {Object} Panther style definition
 */

function drawLine(context, coordinates, style) {
  context.beginPath();
  var start = coordinates[0];
  var rest = coordinates.slice(1);
  context.moveTo(Math.floor(start.x), Math.floor(start.y));
  rest.forEach(function (point) {
    context.lineTo(Math.floor(point.x), Math.floor(point.y));
  });
  helpers$1.setLineStyle(context, style);
}

var lines = {
  drawLine: drawLine
};

var LeafletCanvasLayer = CanvasLayer.extend({
  onLayerDidMount: function onLayerDidMount() {
    this.customEvents = {
      click: this.onLayerClick
    };

    this._map.on(this.customEvents, this);
  },
  onLayerWillUnmount: function onLayerWillUnmount() {
    this._map.off(this.customEvents, this);
  },
  boundsToQuery: function boundsToQuery(bounds) {
    return {
      lat: bounds.getSouthWest().lat,
      lng: bounds.getSouthWest().lng,
      width: bounds.getNorthEast().lat - bounds.getSouthWest().lat,
      height: bounds.getNorthEast().lng - bounds.getSouthWest().lng
    };
  },
  isPointInsideBounds: function isPointInsideBounds(lat, lng, bounds) {
    return lat >= bounds.lat && lat <= bounds.lat + bounds.width && lng >= bounds.lng && lng <= bounds.lng + bounds.height;
  },
  onLayerClick: function onLayerClick(e) {
    var _this = this;

    if (this.props.selectable) {
      var pointsInsideBounds = [];
      var selectedPolygons = [];
      var mousePoint = e.containerPoint;
      var self = this; // TODO breakable loop?

      if (_isArray2(this.features)) {
        this.features.forEach(function (feature) {
          var type = feature.original.geometry.type;

          if (type === 'Point') {
            var radius = feature.defaultStyle.size;
            var LatLngBounds = latLngBounds(_this._map.containerPointToLatLng(mousePoint.add(point(radius, radius))), _this._map.containerPointToLatLng(mousePoint.subtract(point(radius, radius))));

            var BoundingBox = _this.boundsToQuery(LatLngBounds);

            var coordinates = feature.original.geometry.coordinates;
            var lat = coordinates[1];
            var lng = coordinates[0];

            if (self.isPointInsideBounds(lat, lng, BoundingBox)) {
              pointsInsideBounds.push(feature.original);
            }
          } else if (type === 'Polygon' || type === 'MultiPolygon') {
            var point$2 = _this._map.containerPointToLatLng(point(mousePoint.x, mousePoint.y));

            var pointFeature = point$1([point$2.lng, point$2.lat]);
            var insidePolygon = booleanPointInPolygon(pointFeature, feature.original.geometry);

            if (insidePolygon) {
              selectedPolygons.push(feature);
            }
          }
        }); // select single point

        if (pointsInsideBounds.length) {
          var position = this._map.containerPointToLatLng(mousePoint);

          var nearest = nearestPoint(point$1([position.lng, position.lat]), {
            type: 'FeatureCollection',
            features: pointsInsideBounds
          });
          self.props.onClick(self.props.layerKey, [nearest.properties[self.props.fidColumnName]]);
        } else if (selectedPolygons.length) {
          self.props.onClick(self.props.layerKey, [selectedPolygons[0].original.properties[self.props.fidColumnName]]);
        } // TODO select single line

      }
    }
  },
  setProps: function setProps(data) {
    this.props = data;
    this.features = this.prepareFeatures(data.features);
    this.needRedraw();
  },
  prepareFeatures: function prepareFeatures(features) {
    var props = this.props;
    var pointFeatures = [];
    var polygonFeatures = [];
    var lineFeatures = [];

    _forEach2(features, function (feature) {
      var type = feature && feature.geometry && feature.geometry.type;
      var fid = feature.id || props.fidColumnName && feature.properties[props.fidColumnName];
      var defaultStyle = helpers.getDefaultStyleObject(feature, props.style);
      var preparedFeature = {
        original: feature,
        defaultStyle: defaultStyle,
        fid: fid
      };

      if (props.selected && fid) {
        _forIn2(props.selected, function (selection, key) {
          if (selection.keys && _includes2(selection.keys, fid)) {
            preparedFeature.selected = true;
            preparedFeature.selectedStyle = _objectSpread2(_objectSpread2({}, defaultStyle), helpers.getSelectedStyleObject(selection.style));
          }
        });
      } // TODO add support for multipoints and multilines


      if (type === 'Point') {
        pointFeatures.push(preparedFeature);
      } else if (type === 'Polygon' || type === 'MultiPolygon') {
        polygonFeatures.push(preparedFeature);
      } else if (type === 'LineString') {
        lineFeatures.push(preparedFeature);
      }
    }); // TODO what if diferrent geometry types in one layer?


    if (pointFeatures.length) {
      return _orderBy2(pointFeatures, ['defaultStyle.size', 'fid'], ['desc', 'asc']);
    } else if (polygonFeatures.length) {
      if (props.selected) {
        return _orderBy2(polygonFeatures, ['selected'], ['desc']);
      } else {
        return polygonFeatures;
      }
    } else if (lineFeatures.length) {
      if (props.selected) {
        return _orderBy2(lineFeatures, ['selected'], ['desc']);
      } else {
        return lineFeatures;
      }
    } else {
      return null;
    }
  },
  onDrawLayer: function onDrawLayer(params) {
    var context = params.canvas.getContext('2d');
    context.clearRect(0, 0, params.canvas.width, params.canvas.height);

    if (this.features) {
      // clear whole layer
      context.drawImage(this.renderOffScreen(params), 0, 0);
    }
  },
  renderOffScreen: function renderOffScreen(params) {
    var pixelSizeInMeters = null;
    var offScreenCanvas = document.createElement('canvas');
    offScreenCanvas.width = params.canvas.width;
    offScreenCanvas.height = params.canvas.height;
    var context = offScreenCanvas.getContext('2d');

    if (!params.layer.props.pointAsMarker) {
      pixelSizeInMeters = mapConstants.getPixelSizeInLevelsForLatitude(mapConstants.pixelSizeInLevels, 0)[params.zoom];
    } // redraw all features


    for (var i = 0; i < this.features.length; i++) {
      var _this$props$omittedFe;

      var feature = this.features[i];

      var omitFeature = ((_this$props$omittedFe = this.props.omittedFeatureKeys) === null || _this$props$omittedFe === void 0 ? void 0 : _this$props$omittedFe.length) && _includes2(this.props.omittedFeatureKeys, feature.fid);

      if (!omitFeature) {
        this.drawFeature(context, params.layer, params.canvas, feature, pixelSizeInMeters);
      }
    }

    return offScreenCanvas;
  },

  /**
   * @param ctx {Object} Canvas context
   * @param layer {Object}
   * @param canvas {Object}
   * @param feature {Object} Feature data
   * @param pixelSizeInMeters {number | null}
   */
  drawFeature: function drawFeature(ctx, layer, canvas, feature, pixelSizeInMeters) {
    var _this2 = this;

    var geometry = feature.original.geometry;
    var type = geometry.type; // TODO multipoints multilines

    if (type === 'Point') {
      var coordinates = geometry.coordinates;

      var center = layer._map.latLngToContainerPoint([coordinates[1], coordinates[0]]);

      if (center.x >= 0 && center.y >= 0 && center.x <= canvas.width && center.y <= canvas.height) {
        var style = feature.defaultStyle;

        if (feature.selected) {
          style = feature.selectedStyle;
        }

        shapes$1.draw(ctx, center, style, pixelSizeInMeters);
      }
    } else if (type === 'Polygon' || type === 'MultiPolygon') {
      var _coordinates = null;
      var _style = feature.defaultStyle;

      if (feature.selected) {
        _style = feature.selectedStyle;
      }

      if (type === 'Polygon') {
        _coordinates = this.getPolygonCoordinates(geometry.coordinates, layer);
        polygons.drawPolygon(ctx, _coordinates, _style);
      } else {
        _coordinates = geometry.coordinates.map(function (polygon) {
          return _this2.getPolygonCoordinates(polygon, layer);
        });
        polygons.drawMultiPolygon(ctx, _coordinates, _style);
      }
    } else if (type === 'LineString') {
      var _coordinates2 = null;
      var _style2 = feature.defaultStyle;

      if (feature.selected) {
        _style2 = feature.selectedStyle;
      }

      _coordinates2 = this.getLineCoordinates(geometry.coordinates, layer);
      lines.drawLine(ctx, _coordinates2, _style2);
    }
  },
  getPolygonCoordinates: function getPolygonCoordinates(polygon, layer) {
    var _this3 = this;

    return polygon.map(function (linearRing) {
      return _this3.getLineCoordinates(linearRing, layer);
    });
  },
  getLineCoordinates: function getLineCoordinates(line, layer) {
    return line.map(function (coordinates) {
      // TODO do not add the same points again?
      return layer._map.latLngToContainerPoint([coordinates[1], coordinates[0]]);
    });
  }
});

var CanvasVectorLayer = /*#__PURE__*/function (_MapLayer) {
  _inherits(CanvasVectorLayer, _MapLayer);

  var _super = _createSuper(CanvasVectorLayer);

  function CanvasVectorLayer() {
    _classCallCheck(this, CanvasVectorLayer);

    return _super.apply(this, arguments);
  }

  _createClass(CanvasVectorLayer, [{
    key: "createLeafletElement",
    value: function createLeafletElement(props) {
      var layer = new LeafletCanvasLayer({
        paneName: props.uniqueLayerKey,
        paneZindex: props.zIndex
      });
      layer.setProps(props);
      return layer;
    }
  }, {
    key: "updateLeafletElement",
    value: function updateLeafletElement(fromProps, toProps) {
      _get(_getPrototypeOf(CanvasVectorLayer.prototype), "updateLeafletElement", this).call(this, fromProps, toProps); // TODO


      if (fromProps.selected !== toProps.selected || fromProps.features !== toProps.features || fromProps.style !== toProps.style || fromProps.omittedFeatureKeys !== this.props.omittedFeatureKeys) {
        this.leafletElement.setProps(toProps);
      }
    }
  }]);

  return CanvasVectorLayer;
}(MapLayer);

var CanvasVectorLayer$1 = withLeaflet(CanvasVectorLayer);

var geojsonRbush = require('geojson-rbush')["default"];

function getBoundingBox(view, width, height, crs, optLat) {
  // TODO extent calculations for non-mercator projections
  if (!crs || crs === 'EPSG:3857') {
    var boxRange = view.boxRange; // view.boxRange may differ from actual rance visible in map because of levels

    var calculatedBoxRange = map.view.getNearestZoomLevelBoxRange(width, height, view.boxRange);

    if (boxRange !== calculatedBoxRange) {
      boxRange = calculatedBoxRange;
    }

    return map.view.getBoundingBoxFromViewForEpsg3857(view.center, boxRange, width / height, optLat);
  } else {
    return {
      minLat: -90,
      maxLat: 90,
      minLon: -180,
      maxLon: 180
    };
  }
}

var IndexedVectorLayer = /*#__PURE__*/function (_React$PureComponent) {
  _inherits(IndexedVectorLayer, _React$PureComponent);

  var _super = _createSuper(IndexedVectorLayer);

  function IndexedVectorLayer(props) {
    var _this;

    _classCallCheck(this, IndexedVectorLayer);

    _this = _super.call(this, props);
    _this.state = {
      rerender: null
    };
    _this.indexTree = geojsonRbush();
    _this.repopulateIndexTreeIfNeeded = memoize(function (features) {
      if (features) {
        _this.indexTree.clear();

        _this.indexTree.load(features);
      }
    });
    return _this;
  }

  _createClass(IndexedVectorLayer, [{
    key: "boxRangeFitsLimits",
    value: function boxRangeFitsLimits() {
      var props = this.props;

      if (props.boxRangeRange) {
        var minBoxRange = props.boxRangeRange[0];
        var maxBoxRange = props.boxRangeRange[1];

        if (minBoxRange && maxBoxRange) {
          return minBoxRange <= props.view.boxRange && maxBoxRange >= props.view.boxRange;
        } else if (minBoxRange) {
          return minBoxRange <= props.view.boxRange;
        } else if (maxBoxRange) {
          return maxBoxRange >= props.view.boxRange;
        }
      } else {
        return true;
      }
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props = this.props,
          view = _this$props.view;
          _this$props.zoom;
          var component = _this$props.component,
          width = _this$props.width,
          height = _this$props.height,
          crs = _this$props.crs,
          props = _objectWithoutProperties(_this$props, ["view", "zoom", "component", "width", "height", "crs"]);

      if (props.features && this.boxRangeFitsLimits()) {
        this.repopulateIndexTreeIfNeeded(props.features);
        var bbox = getBoundingBox(view, width, height, crs, mapConstants.averageLatitude);
        var geoJsonBbox = {
          type: 'Feature',
          bbox: [bbox.minLon, bbox.minLat, bbox.maxLon, bbox.maxLat]
        }; // Find features in given bounding box

        var foundFeatureCollection = this.indexTree.search(geoJsonBbox);
        var foundFeatures = foundFeatureCollection && foundFeatureCollection.features || []; // Add filtered features only to Vector layer

        if (props.features.length !== foundFeatures.length) {
          props.features = foundFeatures;
        }

        return /*#__PURE__*/React$1.createElement(component, props);
      } else {
        return null;
      }
    }
  }]);

  return IndexedVectorLayer;
}(React$1.PureComponent);

IndexedVectorLayer.propTypes = {
  boxRangeRange: PropTypes.array,
  component: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
  omittedFeatureKeys: PropTypes.array
};

var HoverContext = Context.getContext('HoverContext');
function contextWrapper(WrappedFeature) {
  var _class, _temp;

  return _temp = _class = /*#__PURE__*/function (_React$PureComponent) {
    _inherits(_class, _React$PureComponent);

    var _super = _createSuper(_class);

    function _class(props) {
      var _this;

      _classCallCheck(this, _class);

      _this = _super.call(this, props);
      _this.hoveredFromContext = false;
      _this.changeContext = _this.changeContext.bind(_assertThisInitialized(_this));
      return _this;
    }

    _createClass(_class, [{
      key: "changeContext",
      value: function changeContext(hoveredItems, options) {
        if (hoveredItems && this.context && this.context.onHover) {
          this.context.onHover(hoveredItems, options);
        } else if (!hoveredItems && this.context && this.context.onHoverOut) {
          this.context.onHoverOut();
        }
      }
    }, {
      key: "render",
      value: function render() {
        if (this.props.fid && this.context && this.context.hoveredItems) {
          this.hoveredFromContext = _indexOf2(this.context.hoveredItems, this.props.fid) !== -1;
        } // TODO interactive without context case?


        if (this.context && this.props.hoverable) {
          return /*#__PURE__*/React$1.createElement(WrappedFeature, _extends({}, this.props, {
            changeContext: this.changeContext,
            hoveredFromContext: this.hoveredFromContext
          }));
        } else {
          return /*#__PURE__*/React$1.createElement(WrappedFeature, this.props);
        }
      }
    }]);

    return _class;
  }(React$1.PureComponent), _class.contextType = HoverContext, _temp;
}

var Feature = /*#__PURE__*/function (_React$PureComponent) {
  _inherits(Feature, _React$PureComponent);

  var _super = _createSuper(Feature);

  function Feature(props) {
    var _this;

    _classCallCheck(this, Feature);

    _this = _super.call(this, props);
    _this.onClick = _this.onClick.bind(_assertThisInitialized(_this));
    _this.onMouseMove = _this.onMouseMove.bind(_assertThisInitialized(_this));
    _this.onMouseOut = _this.onMouseOut.bind(_assertThisInitialized(_this));
    _this.onAdd = _this.onAdd.bind(_assertThisInitialized(_this));
    _this.fid = props.fid;

    if (props.type === 'Point' && props.pointAsMarker) {
      _this.shapeId = _this.props.uniqueFeatureKey ? "".concat(_this.props.uniqueFeatureKey, "_icon") : utils.uuid();
    }

    _this.state = {
      hovered: false
    };
    _this.calculateStyles = helpers.calculateStylesMemo;
    _this.convertCoordinates = helpers.convertCoordinatesMemo;
    return _this;
  }

  _createClass(Feature, [{
    key: "componentDidUpdate",
    value: function componentDidUpdate(prevProps, prevState, snapshot) {
      if (this.props.hasOwnProperty('hoveredFromContext')) {
        if (this.props.hoveredFromContext && !this.state.hovered) {
          this.showOnTop();
          this.setState({
            hovered: true
          });
        } else if (!this.props.hoveredFromContext && this.state.hovered) {
          if (!this.props.selected) {
            this.showOnBottom();
          }

          this.setState({
            hovered: false
          });
        }
      }
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      if (this.props.changeContext) {
        this.props.changeContext(null);
      }
    }
  }, {
    key: "onAdd",
    value: function onAdd(event) {
      if (event.target) {
        this.leafletFeature = event.target;
      }
    }
  }, {
    key: "onClick",
    value: function onClick() {
      if (this.props.selectable) {
        this.showOnTop();

        if (this.props.onClick && this.props.fid) {
          this.props.onClick(this.props.fid);
        }
      }
    }
  }, {
    key: "onMouseMove",
    value: function onMouseMove(event) {
      if (this.props.hoverable) {
        this.showOnTop();

        if (this.fid && this.props.changeContext) {
          this.props.changeContext([this.fid], {
            popup: {
              x: event.originalEvent ? event.originalEvent.pageX : event.pageX,
              y: event.originalEvent ? event.originalEvent.pageY : event.pageY,
              fidColumnName: this.props.fidColumnName,
              data: this.props.feature.properties
            }
          });
        }

        if (!this.state.hovered) {
          this.setState({
            hovered: true
          });
        }
      }
    }
  }, {
    key: "onMouseOut",
    value: function onMouseOut() {
      if (this.props.hoverable) {
        if (!this.props.selected) {
          this.showOnBottom();
        }

        if (this.props.changeContext) {
          this.props.changeContext(null);
        }

        this.setState({
          hovered: false
        });
      }
    }
    /**
     * Show feature on the top of others, if it's not a point
     */

  }, {
    key: "showOnTop",
    value: function showOnTop() {
      if (this.leafletFeature && this.props.type !== 'Point') {
        this.leafletFeature.bringToFront();
      }
    }
    /**
     * Show feature in the bottom, if it's a polygon
     */

  }, {
    key: "showOnBottom",
    value: function showOnBottom() {
      if (this.leafletFeature && (this.props.type === 'Polygon' || this.props.type === 'MultiPolygon')) {
        this.leafletFeature.bringToBack();
      }
    }
  }, {
    key: "render",
    value: function render() {
      var props = this.props;
      var coordinates = this.convertCoordinates(props.feature);
      var styles = this.calculateStyles(props.feature, props.styleDefinition, props.hoveredStyleDefinition, props.selected, props.selectedStyleDefinition, props.selectedHoveredStyleDefinition);
      var style = styles["default"];

      if (props.selected && this.state.hovered && styles.selectedHovered) {
        style = styles.selectedHovered;
      } else if (this.state.hovered && styles.hovered) {
        style = styles.hovered;
      } else if (props.selected && styles.selected) {
        style = styles.selected;
      } // TODO add support for other geometry types


      switch (this.props.type) {
        case 'Polygon':
        case 'MultiPolygon':
          return this.renderPolygon(coordinates, style);

        case 'Point':
        case 'MultiPoint':
          return this.renderPoint(coordinates, style);

        case 'LineString':
        case 'MultiLineString':
          return this.renderLine(coordinates, style);

        default:
          return null;
      }
    }
  }, {
    key: "renderPolygon",
    value: function renderPolygon(coordinates, style) {
      return /*#__PURE__*/React$1.createElement(Polygon, _extends({
        interactive: this.props.hoverable || this.props.selectable,
        onAdd: this.onAdd,
        onClick: this.onClick,
        onMouseMove: this.onMouseMove,
        onMouseOut: this.onMouseOut,
        positions: coordinates
      }, style));
    }
  }, {
    key: "renderLine",
    value: function renderLine(coordinates, style) {
      return /*#__PURE__*/React$1.createElement(Polyline, _extends({
        interactive: this.props.hoverable || this.props.selectable,
        onAdd: this.onAdd,
        onClick: this.onClick,
        onMouseOver: this.onMouseMove,
        onMouseMove: this.onMouseMove,
        onMouseOut: this.onMouseOut,
        positions: coordinates
      }, style));
    }
  }, {
    key: "renderPoint",
    value: function renderPoint(coordinates, style) {
      if (this.props.pointAsMarker) {
        return this.renderShape(coordinates, style);
      } else {
        return /*#__PURE__*/React$1.createElement(Circle, _extends({
          interactive: this.props.hoverable || this.props.selectable,
          onAdd: this.onAdd,
          onClick: this.onClick,
          onMouseMove: this.onMouseMove,
          onMouseOver: this.onMouseMove,
          onMouseOut: this.onMouseOut,
          center: coordinates
        }, style));
      }
    }
  }, {
    key: "renderShape",
    value: function renderShape(coordinates, style) {
      if (!this.shape) {
        this.shape = helpers.getMarkerShape(this.shapeId, style, {
          icons: this.props.icons,
          onMouseMove: this.onMouseMove,
          onMouseOver: this.onMouseMove,
          onMouseOut: this.onMouseOut,
          onClick: this.onClick
        });
      }

      if (!shallowEqualObjects(this.style, style)) {
        this.style = style;
        this.shape.setStyle(style, this.shapeId, this.shape.basicShape);
      }

      return /*#__PURE__*/React$1.createElement(Marker, {
        interactive: this.props.hoverable || this.props.selectable,
        position: coordinates,
        icon: this.shape,
        onAdd: this.onAdd
      });
    }
  }]);

  return Feature;
}(React$1.PureComponent);

Feature.propTypes = {
  feature: PropTypes.object,
  fid: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  fidColumnName: PropTypes.string,
  hoverable: PropTypes.bool,
  hoveredFromContext: PropTypes.bool,
  hoveredStyleDefinition: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  selectable: PropTypes.bool,
  selected: PropTypes.bool,
  selectedStyleDefinition: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  selectedHoveredStyleDefinition: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  changeContext: PropTypes.func,
  interactive: PropTypes.bool,
  styleDefinition: PropTypes.object
};
var Feature$1 = contextWrapper(Feature);

var GeoJsonLayer = /*#__PURE__*/function (_React$PureComponent) {
  _inherits(GeoJsonLayer, _React$PureComponent);

  var _super = _createSuper(GeoJsonLayer);

  function GeoJsonLayer(props) {
    var _this;

    _classCallCheck(this, GeoJsonLayer);

    _this = _super.call(this, props);
    _this.getStyle = _this.getStyle.bind(_assertThisInitialized(_this));
    _this.filter = _this.filter.bind(_assertThisInitialized(_this));
    _this.onEachFeature = _this.onEachFeature.bind(_assertThisInitialized(_this));
    _this.pointToLayer = _this.pointToLayer.bind(_assertThisInitialized(_this));
    _this.getRenderId = memoize(function (features) {
      if (features) {
        return utils.uuid();
      }
    });
    return _this;
  }

  _createClass(GeoJsonLayer, [{
    key: "getStyle",
    value: function getStyle(feature) {
      var styles = helpers.calculateStyle(feature.feature, this.props.styleDefinition, this.props.hoveredStyleDefinition, feature.selected, feature.selectedStyleDefinition, feature.selectedHoveredStyleDefinition);

      if (feature.selected) {
        return styles.selected;
      } else {
        return styles["default"];
      }
    }
  }, {
    key: "onEachFeature",
    value: function onEachFeature(feature, layer) {
      var _this2 = this;

      var geometryType = feature.geometry.type;
      var isPolygon = geometryType === 'Polygon' || geometryType === 'MultiPolygon';
      var isLine = geometryType === 'Line' || geometryType === 'LineString';
      var styles = helpers.calculateStyle(feature.feature, this.props.styleDefinition, this.props.hoveredStyleDefinition, feature.selected, feature.selectedStyleDefinition, feature.selectedHoveredStyleDefinition);
      layer.on({
        click: function click(e) {
          if (_this2.props.onFeatureClick && _this2.props.selectable && feature.fid) {
            _this2.props.onFeatureClick(feature.fid);
          }
        },
        mousemove: function mousemove(e) {
          if (_this2.props.hoverable) {
            if (feature.selected && styles.selectedHovered) {
              _this2.setStyle(styles.selectedHovered, e.target);
            } else {
              _this2.setStyle(styles.hovered, e.target);
            }

            if (isPolygon || isLine) {
              layer.bringToFront();
            }
          }
        },
        mouseout: function mouseout(e) {
          if (_this2.props.hoverable) {
            if (feature.selected && styles.selected) {
              _this2.setStyle(styles.selected, e.target);
            } else {
              _this2.setStyle(styles["default"], e.target);
            }

            if ((isLine || isPolygon) && !feature.selected) {
              layer.bringToBack();
            }
          }
        }
      });
    }
    /**
     * Set style of the feature
     * @param leafletStyle {Object} Leaflet style definition
     * @param element {Object} Leaflet element
     */

  }, {
    key: "setStyle",
    value: function setStyle(leafletStyle, element) {
      var _element$options;

      var shape = element === null || element === void 0 ? void 0 : (_element$options = element.options) === null || _element$options === void 0 ? void 0 : _element$options.icon;

      if (shape) {
        shape.setStyle(leafletStyle, shape.id, shape.isBasicShape);
      } else {
        element.setStyle(leafletStyle);
      }
    } // render points

  }, {
    key: "pointToLayer",
    value: function pointToLayer(feature, coord) {
      if (this.props.pointAsMarker) {
        var _style, _style2, _style3;

        var style = feature.defaultStyle; // for circles, use L.circleMarker due to better performance

        if (!((_style = style) !== null && _style !== void 0 && _style.shape) && !((_style2 = style) !== null && _style2 !== void 0 && _style2.icon) || ((_style3 = style) === null || _style3 === void 0 ? void 0 : _style3.shape) === 'circle') {
          return L$1.circleMarker(coord, _objectSpread2(_objectSpread2({}, feature.defaultStyle), {}, {
            pane: this.props.paneName
          }));
        } else {
          if (feature.selected) {
            var styles = helpers.calculateStyle(feature.feature, this.props.styleDefinition, this.props.hoveredStyleDefinition, feature.selected, feature.selectedStyleDefinition, feature.selectedHoveredStyleDefinition);
            style = styles.selected;
          }

          var shapeId = feature.uniqueFeatureKey ? "".concat(feature.uniqueFeatureKey, "_icon") : utils.uuid();
          var shape = helpers.getMarkerShape(shapeId, style, {
            icons: this.props.icons
          });
          return L$1.marker(coord, {
            pane: this.props.paneName,
            interactive: this.props.hoverable || this.props.selectable,
            icon: shape
          });
        }
      } else {
        return L$1.circle(coord, feature.defaultStyle);
      }
    }
  }, {
    key: "filter",
    value: function filter(feature) {
      if (this.props.omittedFeatureKeys) {
        var featureKey = feature.id || feature.properties[this.props.fidColumnName];
        return !(featureKey && _includes2(this.props.omittedFeatureKeys, featureKey));
      } else {
        return true;
      }
    }
  }, {
    key: "render",
    value: function render() {
      var features = this.props.features.map(function (item) {
        return _objectSpread2(_objectSpread2({}, item.feature), item);
      }); // generate new key on features change to return the new instance
      // more: https://react-leaflet.js.org/docs/en/components#geojson

      var key = this.getRenderId(this.props.features);
      return /*#__PURE__*/React$1.createElement(GeoJSON, {
        key: key,
        data: features,
        style: this.getStyle,
        onEachFeature: this.onEachFeature,
        pointToLayer: this.pointToLayer,
        filter: this.filter
      });
    }
  }]);

  return GeoJsonLayer;
}(React$1.PureComponent);

GeoJsonLayer.propTypes = {
  omittedFeatureKeys: PropTypes.array // list of feature keys that shouldn't be rendered

};
var GeoJsonLayer$1 = withLeaflet(GeoJsonLayer);

var SvgVectorLayer = /*#__PURE__*/function (_React$PureComponent) {
  _inherits(SvgVectorLayer, _React$PureComponent);

  var _super = _createSuper(SvgVectorLayer);

  function SvgVectorLayer(props) {
    var _this;

    _classCallCheck(this, SvgVectorLayer);

    _this = _super.call(this, props);
    _this.pointsPaneName = utils.uuid();
    _this.linesPaneName = utils.uuid();
    _this.polygonsPaneName = utils.uuid();
    _this.onFeatureClick = _this.onFeatureClick.bind(_assertThisInitialized(_this));
    return _this;
  }

  _createClass(SvgVectorLayer, [{
    key: "onFeatureClick",
    value: function onFeatureClick(fid) {
      if (this.props.onClick) {
        this.props.onClick(this.props.layerKey, [fid]);
      }
    }
  }, {
    key: "prepareData",
    value: function prepareData(features) {
      var _this2 = this;

      if (features) {
        var pointFeatures = [];
        var polygonFeatures = [];
        var lineFeatures = [];
        var sortedPointFeatures = null;
        var sortedPolygonFeatures = null;

        _forEach2(features, function (feature) {
          var type = feature && feature.geometry && feature.geometry.type;

          if (type) {
            var _selected, _selected2;

            var fid = _this2.props.fidColumnName && feature.properties[_this2.props.fidColumnName];
            var uniqueFeatureKey = "".concat(_this2.props.uniqueLayerKey, "_").concat(fid);
            var selected = null;
            var defaultStyle = null;

            if (_this2.props.selected && fid) {
              _forIn2(_this2.props.selected, function (selection, key) {
                if (selection.keys && _includes2(selection.keys, fid)) {
                  selected = selection;
                }
              });
            }

            if (type === 'Point' || type === 'MultiPoint') {
              defaultStyle = helpers.getDefaultStyle(feature, _this2.props.style);
            }

            var data = {
              feature: feature,
              fid: fid,
              uniqueFeatureKey: uniqueFeatureKey,
              defaultStyle: defaultStyle,
              selected: !!selected,
              selectedStyleDefinition: (_selected = selected) === null || _selected === void 0 ? void 0 : _selected.style,
              selectedHoveredStyleDefinition: (_selected2 = selected) === null || _selected2 === void 0 ? void 0 : _selected2.hoveredStyle
            };

            switch (type) {
              case 'Point':
              case 'MultiPoint':
                pointFeatures.push(data);
                break;

              case 'Polygon':
              case 'MultiPolygon':
                polygonFeatures.push(data);
                break;

              case 'LineString':
              case 'MultiLineString':
                lineFeatures.push(data);
                break;
            }
          }
        }); // sort point features by radius


        if (pointFeatures.length) {
          sortedPointFeatures = _orderBy2(pointFeatures, ['defaultStyle.radius', 'fid'], ['desc', 'asc']);
        } // sort polygon features, if selected


        if (polygonFeatures.length) {
          if (this.props.selected) {
            sortedPolygonFeatures = _orderBy2(polygonFeatures, ['selected'], ['asc']);
          } else {
            sortedPolygonFeatures = polygonFeatures;
          }
        }

        return {
          polygons: sortedPolygonFeatures,
          points: sortedPointFeatures || pointFeatures,
          lines: lineFeatures
        };
      } else {
        return null;
      }
    }
  }, {
    key: "render",
    value: function render() {
      var _data$polygons, _data$lines, _data$points;

      var data = this.prepareData(this.props.features);
      var style = this.props.opacity ? {
        opacity: this.props.opacity
      } : null;
      var classes = classnames({
        'hoverable-pane': this.props.hoverable,
        'selected-features-pane': this.props.withSelectedFeaturesOnly
      });
      return data ? /*#__PURE__*/React$1.createElement(React$1.Fragment, null, (_data$polygons = data.polygons) !== null && _data$polygons !== void 0 && _data$polygons.length ? /*#__PURE__*/React$1.createElement(Pane, {
        className: classes,
        style: style,
        name: this.polygonsPaneName
      }, this.renderFeatures(data.polygons)) : null, (_data$lines = data.lines) !== null && _data$lines !== void 0 && _data$lines.length ? /*#__PURE__*/React$1.createElement(Pane, {
        className: classes,
        style: style,
        name: this.linesPaneName
      }, this.renderFeatures(data.lines)) : null, (_data$points = data.points) !== null && _data$points !== void 0 && _data$points.length ? /*#__PURE__*/React$1.createElement(Pane, {
        className: classes,
        style: style,
        name: this.pointsPaneName
      }, this.renderFeatures(data.points)) : null) : null;
    }
  }, {
    key: "renderFeatures",
    value: function renderFeatures(features) {
      var _this3 = this;

      if (this.props.renderAsGeoJson || features.length > constants.maxFeaturesAsReactElement) {
        // GeoJsonLayer doesn't get context
        return this.renderGeoJson(features);
      } else {
        return features.map(function (item, index) {
          return _this3.renderFeature(item, index);
        });
      }
    }
  }, {
    key: "renderGeoJson",
    value: function renderGeoJson(features) {
      var _this$props$resources;

      return /*#__PURE__*/React$1.createElement(GeoJsonLayer$1, {
        layerKey: this.props.layerKey,
        uniqueLayerKey: this.props.uniqueLayerKey,
        paneName: this.pointsPaneName,
        features: features,
        onFeatureClick: this.onFeatureClick,
        omittedFeatureKeys: this.props.omittedFeatureKeys,
        fidColumnName: this.props.fidColumnName,
        pointAsMarker: this.props.pointAsMarker,
        selectable: this.props.selectable,
        hoverable: this.props.hoverable,
        styleDefinition: this.props.style,
        hoveredStyleDefinition: this.props.hovered && this.props.hovered.style,
        icons: (_this$props$resources = this.props.resources) === null || _this$props$resources === void 0 ? void 0 : _this$props$resources.icons
      });
    }
  }, {
    key: "renderFeature",
    value: function renderFeature(data, index) {
      var _this$props$resources2;

      var key = data.uniqueFeatureKey || "".concat(this.props.uniqueLayerKey, "_").concat(data.fid || index);
      return /*#__PURE__*/React$1.createElement(Feature$1, {
        key: key,
        uniqueFeatureKey: data.uniqueFeatureKey,
        onClick: this.onFeatureClick,
        fid: data.fid,
        fidColumnName: this.props.fidColumnName,
        feature: data.feature,
        type: data.feature.geometry.type,
        pointAsMarker: this.props.pointAsMarker,
        selectable: this.props.selectable,
        selected: data.selected,
        selectedStyleDefinition: data.selectedStyleDefinition,
        selectedHoveredStyleDefinition: data.selectedStyleDefinition,
        hoverable: this.props.hoverable,
        styleDefinition: this.props.style,
        hoveredStyleDefinition: this.props.hovered && this.props.hovered.style,
        icons: (_this$props$resources2 = this.props.resources) === null || _this$props$resources2 === void 0 ? void 0 : _this$props$resources2.icons
      });
    }
  }]);

  return SvgVectorLayer;
}(React$1.PureComponent);

SvgVectorLayer.propTypes = {
  layerKey: PropTypes.string,
  uniqueLayerKey: PropTypes.string,
  // typically a combination of layerKey and data source key (or just layerKey, if no data source)
  renderAsGeoJson: PropTypes.bool,
  // Use Leaflet's GeoJSON layer to render vector features
  features: PropTypes.array,
  fidColumnName: PropTypes.string,
  omittedFeatureKeys: PropTypes.array,
  selectable: PropTypes.bool,
  selected: PropTypes.object,
  hoverable: PropTypes.bool,
  hovered: PropTypes.object,
  style: PropTypes.object,
  pointAsMarker: PropTypes.bool,
  onClick: PropTypes.func,
  withSelectedFeaturesOnly: PropTypes.bool // True, if layer contains only selected features

};

/**
 * @param featureKeysGroupedByTileKey {Array} A collection of feature keys by tile key
 * @param tileKey {String} unique tile identifier
 * @param features {Array} List of current tile's features
 * @param fidColumnName {String}
 * @return {[]|null} List of feature keys to omit
 */

function getFeatureKeysToOmit(featureKeysGroupedByTileKey, tileKey, features, fidColumnName) {
  // Find the order of current tile among others
  var indexOfCurrentTile = _findIndex2(featureKeysGroupedByTileKey, function (tile) {
    return tile.tileKey === tileKey;
  });

  var i = 0;

  if (indexOfCurrentTile > 0) {
    var _ret = function () {
      var featureKeysToOmit = [];
      var renderedFeatureKeys = new Set(); // Iterate over sibling tiles that should be rendered earlier
      // TODO don't iterate through features in each tile again

      while (i < indexOfCurrentTile) {
        var tile = featureKeysGroupedByTileKey[i];

        _forEach2(tile.featureKeys, function (featureKey) {
          renderedFeatureKeys.add(featureKey);
        });

        i++;
      } // Iterate over current tile's features to find which features are rendered already


      _forEach2(features, function (feature) {
        // TODO feature.id
        var featureKey = feature.properties[fidColumnName];

        if (featureKey && renderedFeatureKeys.has(featureKey)) {
          featureKeysToOmit.push(featureKey);
        }
      });

      return {
        v: featureKeysToOmit.length ? featureKeysToOmit : null
      };
    }();

    if (_typeof(_ret) === "object") return _ret.v;
  } else {
    return null;
  }
}
/**
 * Return true, if previous feature keys are the same as the next
 * @param prev {Array} previous arguments
 * @param next {Array} next arguments
 * @return {boolean}
 */


function checkIdentity(prev, next) {
  var prevKeys = prev[0];
  var nextKeys = next[0];

  if (!prevKeys && !nextKeys) {
    return true;
  } else if (!prevKeys || !nextKeys) {
    return false;
  } else {
    //performance suggestion
    // return prevKeys.sort().join(',') === nextKeys.sort().join(',')
    return _isEqual2(prevKeys.sort(), nextKeys.sort());
  }
}

var Tile = /*#__PURE__*/function (_React$PureComponent) {
  _inherits(Tile, _React$PureComponent);

  var _super = _createSuper(Tile);

  function Tile(props) {
    var _this;

    _classCallCheck(this, Tile);

    _this = _super.call(this, props);
    _this.getFeatureKeysToOmit = memoize(getFeatureKeysToOmit); // return memoized feature keys, if nothing changed and not render IndexedVectorLayer again

    _this.checkIdentity = memoize(function (keys) {
      return keys;
    }, checkIdentity);
    return _this;
  }

  _createClass(Tile, [{
    key: "render",
    value: function render() {
      var _this$props = this.props,
          tileKey = _this$props.tileKey,
          featureKeysGroupedByTileKey = _this$props.featureKeysGroupedByTileKey;
          _this$props.component;
          var props = _objectWithoutProperties(_this$props, ["tileKey", "featureKeysGroupedByTileKey", "component"]);

      var omittedFeatureKeys = this.getFeatureKeysToOmit(featureKeysGroupedByTileKey, tileKey, props.features, props.fidColumnName);

      if (props.renderingTechnique === 'canvas') {
        return /*#__PURE__*/React$1.createElement(CanvasVectorLayer$1, _extends({}, props, {
          key: tileKey,
          uniqueLayerKey: tileKey,
          omittedFeatureKeys: this.checkIdentity(omittedFeatureKeys)
        }));
      } else {
        return /*#__PURE__*/React$1.createElement(IndexedVectorLayer, _extends({}, props, {
          component: SvgVectorLayer,
          key: tileKey,
          uniqueLayerKey: tileKey,
          omittedFeatureKeys: this.checkIdentity(omittedFeatureKeys),
          renderAsGeoJson: true // TODO always render as GeoJson for now

        }));
      }
    }
  }]);

  return Tile;
}(React$1.PureComponent);

Tile.propTypes = {
  tileKey: PropTypes.string,
  features: PropTypes.array,
  fidColumnName: PropTypes.string,
  level: PropTypes.number,
  tile: PropTypes.oneOfType([PropTypes.array, PropTypes.string]),
  featureKeysGroupedByTileKey: PropTypes.array // a collection of all tiles and their features for each tile in the layer

};

/**
 * @param uniqueLayerKey {string}
 * @param tile {Object}
 * @return {string}
 */

function getTileKey(uniqueLayerKey, tile) {
  return "".concat(uniqueLayerKey, "_").concat(tile.level, "_").concat(typeof tile.tile === 'string' ? tile.tile : JSON.stringify(tile.tile));
}
/**
 * @param uniqueLayerKey {string}
 * @param tiles {Array}
 * @param fidColumnName {string}
 * @param selections {Object}
 * @return {Object} groupedFeatures - a collection of features grouped by tile key, groupedFeaturesKeys - a collection of feature keys grouped by tile key
 */


function getFeaturesGroupedByTileKey(uniqueLayerKey, tiles, fidColumnName, selections) {
  var groupedFeatures = [];
  var groupedFeatureKeys = [];
  var selected = {};

  _forEach2(tiles, function (tile) {
    // TODO pass featureKeys or filters
    var key = getTileKey(uniqueLayerKey, tile);
    var tileFeatureKeys = [];

    if (tile.features) {
      _forEach2(tile.features, function (feature) {
        var fid = feature.id || feature.properties[fidColumnName];

        if (selections) {
          _forIn2(selections, function (selection, selectionKey) {
            if (selection.keys && _includes2(selection.keys, fid)) {
              var _selected$selectionKe;

              if ((_selected$selectionKe = selected[selectionKey]) !== null && _selected$selectionKe !== void 0 && _selected$selectionKe.features) {
                selected[selectionKey].features[fid] = feature;
                selected[selectionKey].featureKeys.push(fid);
              } else {
                selected[selectionKey] = {
                  features: _defineProperty({}, fid, feature),
                  featureKeys: [fid],
                  level: tile.level
                };
              }
            }
          });
        }

        tileFeatureKeys.push(fid);
      });
    }

    groupedFeatures.push(_objectSpread2(_objectSpread2({}, tile), {}, {
      key: key
    }));
    groupedFeatureKeys.push({
      key: key,
      featureKeys: tileFeatureKeys
    });
  });

  if (!_isEmpty2(selected)) {
    _forIn2(selected, function (selection, selectionKey) {
      var key = "".concat(uniqueLayerKey, "_").concat(selectionKey, "_").concat(selection.level);
      groupedFeatures.unshift({
        key: key,
        features: Object.values(selection.features),
        level: selection.level,
        withSelectedFeaturesOnly: true
      });
      groupedFeatureKeys.unshift({
        key: key,
        featureKeys: _uniq2(selection.featureKeys)
      });
    });
  }

  return {
    groupedFeatures: groupedFeatures,
    groupedFeatureKeys: groupedFeatureKeys
  };
}

var TiledVectorLayer = /*#__PURE__*/function (_React$PureComponent) {
  _inherits(TiledVectorLayer, _React$PureComponent);

  var _super = _createSuper(TiledVectorLayer);

  function TiledVectorLayer(props) {
    var _this;

    _classCallCheck(this, TiledVectorLayer);

    _this = _super.call(this, props);
    _this.getFeaturesGroupedByTileKey = memoize(getFeaturesGroupedByTileKey);
    return _this;
  }

  _createClass(TiledVectorLayer, [{
    key: "render",
    value: function render() {
      var _data$groupedFeatures;

      var _this$props = this.props,
          tiles = _this$props.tiles,
          props = _objectWithoutProperties(_this$props, ["tiles"]);

      var data = this.getFeaturesGroupedByTileKey(props.uniqueLayerKey, tiles, props.fidColumnName, props.selected);

      if ((_data$groupedFeatures = data.groupedFeatures) !== null && _data$groupedFeatures !== void 0 && _data$groupedFeatures.length) {
        return data.groupedFeatures.map(function (tile) {
          return /*#__PURE__*/React$1.createElement(Tile, _extends({}, props, {
            key: tile.key,
            tileKey: tile.key,
            features: tile.features,
            level: tile.level,
            tile: tile.tile,
            featureKeysGroupedByTileKey: data.groupedFeatureKeys,
            withSelectedFeaturesOnly: tile.withSelectedFeaturesOnly
          }));
        });
      } else {
        return null;
      }
    }
  }]);

  return TiledVectorLayer;
}(React$1.PureComponent);

TiledVectorLayer.propTypes = {
  fidColumnName: PropTypes.string,
  tiles: PropTypes.array,
  layerKey: PropTypes.string,
  uniqueLayerKey: PropTypes.string
};

var VectorLayer = /*#__PURE__*/function (_React$PureComponent) {
  _inherits(VectorLayer, _React$PureComponent);

  var _super = _createSuper(VectorLayer);

  function VectorLayer() {
    _classCallCheck(this, VectorLayer);

    return _super.apply(this, arguments);
  }

  _createClass(VectorLayer, [{
    key: "getOptions",
    value: function getOptions() {
      var _props$options;

      var props = this.props;
      var renderAs = (_props$options = props.options) === null || _props$options === void 0 ? void 0 : _props$options.renderAs;
      var options = props.options;

      if (renderAs) {
        var _props$view;

        var boxRange = (_props$view = props.view) === null || _props$view === void 0 ? void 0 : _props$view.boxRange;

        var renderAsData = _find2(renderAs, function (renderAsItem) {
          return view.isBoxRangeInRange(boxRange, renderAsItem.boxRangeRange);
        });

        if (renderAsData) {
          var _renderAsData$options, _options, _renderAsData$options2, _options2, _renderAsData$options3, _options3;

          // TODO enable to define other layer options in renderAs
          options = _objectSpread2(_objectSpread2({}, options), {}, {
            style: ((_renderAsData$options = renderAsData.options) === null || _renderAsData$options === void 0 ? void 0 : _renderAsData$options.style) || ((_options = options) === null || _options === void 0 ? void 0 : _options.style),
            pointAsMarker: (_renderAsData$options2 = renderAsData.options) !== null && _renderAsData$options2 !== void 0 && _renderAsData$options2.hasOwnProperty('pointAsMarker') ? renderAsData.options.pointAsMarker : (_options2 = options) === null || _options2 === void 0 ? void 0 : _options2.pointAsMarker,
            renderingTechnique: ((_renderAsData$options3 = renderAsData.options) === null || _renderAsData$options3 === void 0 ? void 0 : _renderAsData$options3.renderingTechnique) || ((_options3 = options) === null || _options3 === void 0 ? void 0 : _options3.renderingTechnique)
          });
        }
      }

      return options;
    }
  }, {
    key: "render",
    value: function render() {
      var type = this.props.type;
      var options = this.getOptions(); // TODO handle type 'diagram'

      if (type === 'tiledVector' || type === 'tiled-vector') {
        return this.renderTiledVectorLayer(options);
      } else {
        return this.renderBasicVectorLayer(options);
      }
    }
  }, {
    key: "renderTiledVectorLayer",
    value: function renderTiledVectorLayer(options) {
      var _this$props = this.props;
          _this$props.options;
          var props = _objectWithoutProperties(_this$props, ["options"]);

      return /*#__PURE__*/React$1.createElement(TiledVectorLayer, _extends({}, props, options));
    }
  }, {
    key: "renderBasicVectorLayer",
    value: function renderBasicVectorLayer(options) {
      var _this$props2 = this.props;
          _this$props2.options;
          var props = _objectWithoutProperties(_this$props2, ["options"]);

      if (options.renderingTechnique === 'canvas') {
        return /*#__PURE__*/React$1.createElement(CanvasVectorLayer$1, _extends({}, props, options));
      } else {
        return /*#__PURE__*/React$1.createElement(IndexedVectorLayer, _extends({
          component: SvgVectorLayer
        }, props, options));
      }
    }
  }]);

  return VectorLayer;
}(React$1.PureComponent);

VectorLayer.propTypes = {
  layerKey: PropTypes.string,
  uniqueLayerKey: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  onClick: PropTypes.func,
  opacity: PropTypes.number,
  options: PropTypes.object,
  type: PropTypes.string,
  view: PropTypes.object,
  zoom: PropTypes.number,
  zIndex: PropTypes.number
};

/*!
 * leaflet.wms.js
 * A collection of Leaflet utilities for working with Web Mapping services.
 * (c) 2014-2016, Houston Engineering, Inc.
 * MIT License
 */

var wms = {}; // Quick shim for Object.keys()

if (!('keys' in Object)) {
  Object.keys = function (obj) {
    var result = [];

    for (var i in obj) {
      if (obj.hasOwnProperty(i)) {
        result.push(i);
      }
    }

    return result;
  };
}
/*
 * wms.Source
 * The Source object manages a single WMS connection.  Multiple "layers" can be
 * created with the getLayer function, but a single request will be sent for
 * each image update.  Can be used in non-tiled "overlay" mode (default), or
 * tiled mode, via an internal wms.Overlay or wms.TileLayer, respectively.
 */


wms.Source = Layer.extend({
  options: {
    untiled: true,
    identify: true
  },
  initialize: function initialize(url, options) {
    setOptions(this, options);

    if (this.options.tiled) {
      this.options.untiled = false;
    }

    this._url = url;
    this._subLayers = {};
    this._overlay = this.createOverlay(this.options.untiled);
  },
  createOverlay: function createOverlay(untiled) {
    // Create overlay with all options other than untiled & identify
    var overlayOptions = {};

    for (var opt in this.options) {
      if (opt != 'untiled' && opt != 'identify') {
        overlayOptions[opt] = this.options[opt];
      }
    }

    if (untiled) {
      return wms.overlay(this._url, overlayOptions);
    } else {
      return wms.tileLayer(this._url, overlayOptions);
    }
  },
  onAdd: function onAdd() {
    this.refreshOverlay();
  },
  setParams: function setParams(params) {
    // L.extend(this.wmsParams, params);
    // this.update();
    this._overlay.setParams(params);
  },
  onRemove: function onRemove() {
    var subLayers = Object.keys(this._subLayers).join(',');

    if (!this._map) {
      return;
    }

    if (subLayers) {
      this._overlay.remove();
    }
  },
  getEvents: function getEvents() {
    if (this.options.identify) {
      return {
        click: this.identify
      };
    } else {
      return {};
    }
  },
  setOpacity: function setOpacity(opacity) {
    this.options.opacity = opacity;

    if (this._overlay) {
      this._overlay.setOpacity(opacity);
    }
  },
  bringToBack: function bringToBack() {
    this.options.isBack = true;

    if (this._overlay) {
      this._overlay.bringToBack();
    }
  },
  bringToFront: function bringToFront() {
    this.options.isBack = false;

    if (this._overlay) {
      this._overlay.bringToFront();
    }
  },
  getLayer: function getLayer(name) {
    return wms.layer(this, name);
  },
  addSubLayer: function addSubLayer(name) {
    this._subLayers[name] = true;
    this.refreshOverlay();
  },
  removeSubLayer: function removeSubLayer(name) {
    delete this._subLayers[name];
    this.refreshOverlay();
  },
  refreshOverlay: function refreshOverlay() {
    var subLayers = Object.keys(this._subLayers).join(',');

    if (!this._map) {
      return;
    }

    if (!subLayers) {
      this._overlay.remove();
    } else {
      this._overlay.setParams({
        layers: subLayers
      });

      this._overlay.addTo(this._map);
    }
  },
  identify: function identify(evt) {
    // Identify map features in response to map clicks. To customize this
    // behavior, create a class extending wms.Source and override one or
    // more of the following hook functions.
    var layers = this.getIdentifyLayers();

    if (!layers.length) {
      return;
    }

    this.getFeatureInfo(evt.containerPoint, evt.latlng, layers, this.showFeatureInfo);
  },
  getFeatureInfo: function getFeatureInfo(point, latlng, layers, callback) {
    // Request WMS GetFeatureInfo and call callback with results
    // (split from identify() to faciliate use outside of map events)
    var params = this.getFeatureInfoParams(point, layers),
        url = this._url + Util.getParamString(params, this._url);
    this.showWaiting();
    this.ajax(url, done);

    function done(result) {
      this.hideWaiting();
      var text = this.parseFeatureInfo(result, url);
      callback.call(this, latlng, text);
    }
  },
  ajax: function ajax(url, callback) {
    _ajax.call(this, url, callback);
  },
  getIdentifyLayers: function getIdentifyLayers() {
    // Hook to determine which layers to identify
    if (this.options.identifyLayers) return this.options.identifyLayers;
    return Object.keys(this._subLayers);
  },
  getFeatureInfoParams: function getFeatureInfoParams(point, layers) {
    // Hook to generate parameters for WMS service GetFeatureInfo request
    var wmsParams, overlay;

    if (this.options.untiled) {
      // Use existing overlay
      wmsParams = this._overlay.wmsParams;
    } else {
      // Create overlay instance to leverage updateWmsParams
      overlay = this.createOverlay(true);
      overlay.updateWmsParams(this._map);
      wmsParams = overlay.wmsParams;
      wmsParams.layers = layers.join(',');
    }

    var infoParams = {
      request: 'GetFeatureInfo',
      query_layers: layers.join(','),
      X: Math.round(point.x),
      Y: Math.round(point.y)
    };
    return extend({}, wmsParams, infoParams);
  },
  parseFeatureInfo: function parseFeatureInfo(result, url) {
    // Hook to handle parsing AJAX response
    if (result == 'error') {
      // AJAX failed, possibly due to CORS issues.
      // Try loading content in <iframe>.
      result = "<iframe src='" + url + "' style='border:none'>";
    }

    return result;
  },
  showFeatureInfo: function showFeatureInfo(latlng, info) {
    // Hook to handle displaying parsed AJAX response to the user
    if (!this._map) {
      return;
    }

    this._map.openPopup(info, latlng);
  },
  showWaiting: function showWaiting() {
    // Hook to customize AJAX wait animation
    if (!this._map) return;
    this._map._container.style.cursor = 'progress';
  },
  hideWaiting: function hideWaiting() {
    // Hook to remove AJAX wait animation
    if (!this._map) return;
    this._map._container.style.cursor = 'default';
  }
});

wms.source = function (url, options) {
  return new wms.Source(url, options);
};
/*
 * Layer
 * Leaflet "layer" with all actual rendering handled via an underlying Source
 * object.  Can be called directly with a URL to automatically create or reuse
 * an existing Source.  Note that the auto-source feature doesn't work well in
 * multi-map environments; so for best results, create a Source first and use
 * getLayer() to retrieve wms.Layer instances.
 */


wms.Layer = Layer.extend({
  initialize: function initialize(source, layerName, options) {
    setOptions(this, {
      pane: source.options.pane
    });

    if (!source.addSubLayer) {
      // Assume source is a URL
      source = wms.getSourceForUrl(source, options);
    }

    this._source = source;
    this._name = layerName;
  },
  onAdd: function onAdd() {
    if (!this._source._map) this._source.addTo(this._map);

    this._source.addSubLayer(this._name);
  },
  onRemove: function onRemove() {
    this._source.removeSubLayer(this._name);
  },
  setOpacity: function setOpacity(opacity) {
    this._source.setOpacity(opacity);
  },
  setParams: function setParams(params) {
    this._source.setParams(params);
  },
  bringToBack: function bringToBack() {
    this._source.bringToBack();
  },
  bringToFront: function bringToFront() {
    this._source.bringToFront();
  }
});

wms.layer = function (source, options) {
  return new wms.Layer(source, options);
}; // Cache of sources for use with wms.Layer auto-source option


var sources = {};

wms.getSourceForUrl = function (url, options) {
  if (!sources[url]) {
    sources[url] = wms.source(url, options);
  }

  return sources[url];
}; // Copy tiled WMS layer from leaflet core, in case we need to subclass it later


wms.TileLayer = TileLayer.WMS;
wms.tileLayer = tileLayer.wms;
/*
 * wms.Overlay:
 * "Single Tile" WMS image overlay that updates with map changes.
 * Portions of wms.Overlay are directly extracted from L.TileLayer.WMS.
 * See Leaflet license.
 */

wms.Overlay = Layer.extend({
  defaultWmsParams: {
    service: 'WMS',
    request: 'GetMap',
    version: '1.1.1',
    layers: '',
    styles: '',
    format: 'image/jpeg',
    transparent: false
  },
  options: {
    crs: null,
    uppercase: false,
    attribution: '',
    opacity: 1,
    isBack: false,
    minZoom: 0,
    maxZoom: 18
  },
  initialize: function initialize(url, options) {
    this._url = url; // Move WMS parameters to params object

    var params = {},
        opts = {};

    for (var opt in options) {
      if (opt in this.options) {
        opts[opt] = options[opt];
      } else {
        params[opt] = options[opt];
      }
    }

    setOptions(this, opts);
    this.wmsParams = extend({}, this.defaultWmsParams, params);
  },
  setParams: function setParams(params) {
    extend(this.wmsParams, params);
    this.update();
  },
  getAttribution: function getAttribution() {
    return this.options.attribution;
  },
  onAdd: function onAdd() {
    this.update();
  },
  onRemove: function onRemove(map) {
    if (this._currentOverlay) {
      map.removeLayer(this._currentOverlay);
      delete this._currentOverlay;
    }

    if (this._currentUrl) {
      delete this._currentUrl;
    }
  },
  getEvents: function getEvents() {
    return {
      moveend: this.update
    };
  },
  update: function update() {
    if (!this._map) {
      return;
    } // Determine image URL and whether it has changed since last update


    this.updateWmsParams();
    var url = this.getImageUrl();

    if (this._currentUrl == url) {
      return;
    }

    this._currentUrl = url; // Keep current image overlay in place until new one loads
    // (inspired by esri.leaflet)

    var bounds = this._map.getBounds();

    var overlay = imageOverlay(url, bounds, {
      opacity: 0,
      pane: this.options.pane
    });
    overlay.addTo(this._map);
    overlay.once('load', _swap, this);

    function _swap() {
      if (!this._map) {
        return;
      }

      if (overlay._url != this._currentUrl) {
        this._map.removeLayer(overlay);

        return;
      } else if (this._currentOverlay) {
        this._map.removeLayer(this._currentOverlay);
      }

      this._currentOverlay = overlay;
      overlay.setOpacity(this.options.opacity ? this.options.opacity : 1);

      if (this.options.isBack === true) {
        overlay.bringToBack();
      }

      if (this.options.isBack === false) {
        overlay.bringToFront();
      }
    }

    if (this._map.getZoom() < this.options.minZoom || this._map.getZoom() > this.options.maxZoom) {
      this._map.removeLayer(overlay);
    }
  },
  setOpacity: function setOpacity(opacity) {
    this.options.opacity = opacity;

    if (this._currentOverlay) {
      this._currentOverlay.setOpacity(opacity);
    }
  },
  bringToBack: function bringToBack() {
    this.options.isBack = true;

    if (this._currentOverlay) {
      this._currentOverlay.bringToBack();
    }
  },
  bringToFront: function bringToFront() {
    this.options.isBack = false;

    if (this._currentOverlay) {
      this._currentOverlay.bringToFront();
    }
  },
  // See L.TileLayer.WMS: onAdd() & getTileUrl()
  updateWmsParams: function updateWmsParams(map) {
    if (!map) {
      map = this._map;
    } // Compute WMS options


    var bounds = map.getBounds();
    var size = map.getSize();
    var wmsVersion = parseFloat(this.wmsParams.version);
    var crs = this.options.crs || map.options.crs;
    var projectionKey = wmsVersion >= 1.3 ? 'crs' : 'srs';
    var nw = crs.project(bounds.getNorthWest());
    var se = crs.project(bounds.getSouthEast()); // Assemble WMS parameter string

    var params = {
      width: size.x,
      height: size.y
    };
    params[projectionKey] = crs.code;
    params.bbox = (wmsVersion >= 1.3 && crs === CRS.EPSG4326 ? [se.y, nw.x, nw.y, se.x] : [nw.x, se.y, se.x, nw.y]).join(',');
    extend(this.wmsParams, params);
  },
  getImageUrl: function getImageUrl() {
    var uppercase = this.options.uppercase || false;
    var pstr = Util.getParamString(this.wmsParams, this._url, uppercase);
    return this._url + pstr;
  }
});

wms.overlay = function (url, options) {
  return new wms.Overlay(url, options);
}; // Simple AJAX helper (since we can't assume jQuery etc. are present)


function _ajax(url, callback) {
  var context = this,
      request = new XMLHttpRequest();
  request.onreadystatechange = change;
  request.open('GET', url);
  request.send();

  function change() {
    if (request.readyState === 4) {
      if (request.status === 200) {
        callback.call(context, request.responseText);
      } else {
        callback.call(context, 'error');
      }
    }
  }
}

var EVENTS_RE = /^on(.+)$/i;

var WMSLayer = /*#__PURE__*/function (_MapLayer) {
  _inherits(WMSLayer, _MapLayer);

  var _super = _createSuper(WMSLayer);

  function WMSLayer() {
    _classCallCheck(this, WMSLayer);

    return _super.apply(this, arguments);
  }

  _createClass(WMSLayer, [{
    key: "createLeafletElement",
    value: function createLeafletElement(props) {
      var url = props.url,
          params = props.params,
          singleTile = props.singleTile,
          restParams = _objectWithoutProperties(props, ["url", "params", "singleTile"]);

      var _this$getOptions = this.getOptions(_objectSpread2(_objectSpread2({}, restParams), params)),
          _l = _this$getOptions.leaflet,
          options = _objectWithoutProperties(_this$getOptions, ["leaflet"]);

      if (singleTile) {
        var source = new wms.source(url, _objectSpread2(_objectSpread2({}, options), {}, {
          pane: _l.pane,
          tiled: false,
          identify: false
        }));
        var layer = source.getLayer(options.layers);
        layer.options.pane = _l.pane;
        return layer;
      } else {
        return new TileLayer.WMS(url, options);
      }
    }
  }, {
    key: "updateLeafletElement",
    value: function updateLeafletElement(fromProps, toProps) {
      _get(_getPrototypeOf(WMSLayer.prototype), "updateLeafletElement", this).call(this, fromProps, toProps);

      var prevUrl = fromProps.url;
      var url = toProps.url;

      if (url !== prevUrl) {
        this.leafletElement.setUrl(url);
      }

      if (!isEqual(fromProps.params, toProps.params)) {
        this.leafletElement.setParams(_objectSpread2(_objectSpread2({}, toProps.params), {}, {
          pane: toProps.leaflet.pane
        }));
      }
    }
  }, {
    key: "getOptions",
    value: function getOptions(params) {
      var superOptions = _get(_getPrototypeOf(WMSLayer.prototype), "getOptions", this).call(this, params);

      return Object.keys(superOptions).reduce(function (options, key) {
        if (!EVENTS_RE.test(key)) {
          options[key] = superOptions[key];
        }

        return options;
      }, {});
    }
  }]);

  return WMSLayer;
}(MapLayer);

var WMSLayer$1 = withLeaflet(WMSLayer);

var getBoxRange = function getBoxRange(boxRange, width, height) {
  var calculatedBoxRange = map.view.getNearestZoomLevelBoxRange(width, height, boxRange);

  if (boxRange !== calculatedBoxRange) {
    return calculatedBoxRange;
  } else {
    return boxRange;
  }
};

var TileGridLayer = /*#__PURE__*/function (_React$PureComponent) {
  _inherits(TileGridLayer, _React$PureComponent);

  var _super = _createSuper(TileGridLayer);

  function TileGridLayer(props) {
    var _this;

    _classCallCheck(this, TileGridLayer);

    _this = _super.call(this, props);
    _this.pointsPaneName = utils.uuid();
    _this.getStyle = _this.getStyle.bind(_assertThisInitialized(_this));
    _this.onEachFeature = _this.onEachFeature.bind(_assertThisInitialized(_this));
    _this.getRenderId = memoize(function (features) {
      if (features) {
        return utils.uuid();
      }
    });
    return _this;
  }

  _createClass(TileGridLayer, [{
    key: "onEachFeature",
    value: function onEachFeature(feature, layer) {}
  }, {
    key: "getStyle",
    value: function getStyle(feature) {
      var styles = helpers.calculateStyle(feature, this.props.style, undefined, feature.selected, feature.selectedStyleDefinition, feature.selectedHoveredStyleDefinition);

      if (feature.selected) {
        return styles.selected;
      } else {
        return styles["default"];
      }
    }
    /**
     * Set style of the feature
     * @param leafletStyle {Object} Leaflet style definition
     * @param element {Object} Leaflet element
     */

  }, {
    key: "setStyle",
    value: function setStyle(leafletStyle, element) {
      var _element$options;

      var shape = element === null || element === void 0 ? void 0 : (_element$options = element.options) === null || _element$options === void 0 ? void 0 : _element$options.icon;

      if (shape) {
        shape.setStyle(leafletStyle, shape.id, shape.isBasicShape);
      } else {
        element.setStyle(leafletStyle);
      }
    }
  }, {
    key: "render",
    value: function render() {
      var options = this.props.options;
      return this.renderBasicVectorLayer(options);
    }
  }, {
    key: "getGeoJsonTileGrid",
    value: function getGeoJsonTileGrid(tileGrid, boxRange, viewport) {
      var level = this.getTileGridLevel(boxRange, viewport); // // todo
      // // add buffer for leveles bigger than 5

      var size = utils$1.getGridSizeForLevel(level); // //consider caching levels

      var geojsonTileGrid = utils$1.getTileGridAsGeoJSON(tileGrid, size);
      return geojsonTileGrid;
    }
  }, {
    key: "getTileGridLevel",
    value: function getTileGridLevel(boxRange, viewport) {
      var viewportRange = map.view.getMapViewportRange(viewport.width, viewport.height);
      var nearestBoxRange = map.view.getNearestZoomLevelBoxRange(viewport.width, viewport.height, boxRange);
      var level = grid.getLevelByViewport(nearestBoxRange, viewportRange);
      return level;
    }
  }, {
    key: "getTilesMarkers",
    value: function getTilesMarkers() {
      var _this2 = this;

      var tileGrid = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
      var boxRange = arguments.length > 1 ? arguments[1] : undefined;
      var viewport = arguments.length > 2 ? arguments[2] : undefined;
      var level = this.getTileGridLevel(boxRange, viewport);
      var markers = tileGrid.reduce(function (acc, row) {
        var rowMarkers = row.map(function (tile, i) {
          return /*#__PURE__*/React$1.createElement(Pane, {
            style: {
              zIndex: _this2.props.zIndex
            },
            key: "".concat(level, "-").concat(tile[0], "-").concat(tile[1])
          }, /*#__PURE__*/React$1.createElement(Marker, {
            zIndex: _this2.props.zIndex,
            position: [tile[1], tile[0]],
            icon: new L.DivIcon({
              //push every second tile title up to prevent overlays
              iconAnchor: [-10, 20 + i % 2 * 20],
              className: 'my-div-icon',
              html: "<div style=\"display:flex\"><div style=\"white-space: nowrap;\">".concat(level, "-").concat(tile[0], "-").concat(tile[1], "</div></div>")
            })
          }));
        });
        return [].concat(_toConsumableArray(acc), _toConsumableArray(rowMarkers));
      }, []);
      return markers;
    }
  }, {
    key: "renderBasicVectorLayer",
    value: function renderBasicVectorLayer(options) {
      var _this$props = this.props;
          _this$props.options;
          var props = _objectWithoutProperties(_this$props, ["options"]);

      var recalculatedBoxrange = getBoxRange(props.view.boxRange, options.viewport.width, options.viewport.height);
      var tileGrid = grid.getTileGrid(options.viewport.width, options.viewport.height, recalculatedBoxrange, props.view.center, true);
      var geoJsonTileGrid = this.getGeoJsonTileGrid(tileGrid, recalculatedBoxrange, options.viewport); // generate new key on features change to return the new instance
      // more: https://react-leaflet.js.org/docs/en/components#geojson

      var key = this.getRenderId(geoJsonTileGrid.features);
      var tilesMarkers = this.getTilesMarkers(tileGrid, recalculatedBoxrange, options.viewport);
      return /*#__PURE__*/React$1.createElement(React$1.Fragment, null, /*#__PURE__*/React$1.createElement(GeoJSON, {
        key: key,
        data: geoJsonTileGrid.features,
        style: this.getStyle,
        onEachFeature: this.onEachFeature,
        zIndex: this.props.zIndex // pointToLayer={this.pointToLayer}
        // filter={this.filter}

      }), tilesMarkers);
    }
  }]);

  return TileGridLayer;
}(React$1.PureComponent);

TileGridLayer.propTypes = {
  layerKey: PropTypes.string,
  uniqueLayerKey: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  view: PropTypes.object,
  zoom: PropTypes.number,
  zIndex: PropTypes.number
};
var TileGridLayer$1 = withLeaflet(TileGridLayer);

/**
 * Round one viewport dimension (width or height)
 * @param dimension {number} original dimension (width or height)
 * @return {number} Rounded dimension
 */
var roundDimension = function roundDimension(dimension) {
  return Math.ceil(dimension);
};

var viewport = {
  roundDimension: roundDimension
};

var ReactLeafletMap = /*#__PURE__*/function (_React$PureComponent) {
  _inherits(ReactLeafletMap, _React$PureComponent);

  var _super = _createSuper(ReactLeafletMap);

  function ReactLeafletMap(props) {
    var _this;

    _classCallCheck(this, ReactLeafletMap);

    _this = _super.call(this, props);
    _this.state = {
      view: null,
      crs: _this.getCRS(props.crs)
    };
    _this.onClick = _this.onClick.bind(_assertThisInitialized(_this));
    _this.onLayerClick = _this.onLayerClick.bind(_assertThisInitialized(_this));
    _this.onViewportChanged = _this.onViewportChanged.bind(_assertThisInitialized(_this));
    _this.onResize = _this.onResize.bind(_assertThisInitialized(_this));
    return _this;
  }

  _createClass(ReactLeafletMap, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      // Hack for ugly 1px tile borders in Chrome
      // Version of Leaflet package in dependencies should match version used by react-leaflet
      var originalInitTile = L$1.GridLayer.prototype._initTile;
      L$1.GridLayer.include({
        _initTile: function _initTile(tile) {
          originalInitTile.call(this, tile);
          var tileSize = this.getTileSize();
          tile.style.width = tileSize.x + 1 + 'px';
          tile.style.height = tileSize.y + 1 + 'px';
        }
      });
    }
  }, {
    key: "getCRS",
    value: function getCRS(code) {
      switch (code) {
        case 'EPSG:4326':
          return L$1.CRS.EPSG4326;

        case 'EPSG:5514':
          return new Proj.CRS('EPSG:5514', constants.projDefinitions.epsg5514, {
            resolutions: [102400, 51200, 25600, 12800, 6400, 3200, 1600, 800, 400, 200, 100, 50, 25, 12.5, 6.25, 3.125, 1.5625, 0.78125, 0.390625]
          });

        default:
          return L$1.CRS.EPSG3857;
      }
    }
  }, {
    key: "setZoomLevelsBounds",
    value: function setZoomLevelsBounds(width, height) {
      var props = this.props;
      this.minZoom = mapConstants.defaultLevelsRange[0];
      this.maxZoom = mapConstants.defaultLevelsRange[1];

      if (props.viewLimits && props.viewLimits.boxRangeRange) {
        if (props.viewLimits.boxRangeRange[1]) {
          this.minZoom = map.view.getZoomLevelFromBoxRange(props.viewLimits.boxRangeRange[1], width, height);
        }

        if (props.viewLimits.boxRangeRange[0]) {
          this.maxZoom = map.view.getZoomLevelFromBoxRange(props.viewLimits.boxRangeRange[0], width, height);
        }
      }
    }
  }, {
    key: "onViewportChanged",
    value: function onViewportChanged(viewport) {
      if (viewport) {
        var change = {};

        if (viewport.center && (viewport.center[0] !== this.state.leafletView.center[0] || viewport.center[1] !== this.state.leafletView.center[1])) {
          var _this$props$viewLimit;

          change.center = view.getCenterWhichFitsLimits({
            lat: viewport.center[0],
            lon: viewport.center[1]
          }, (_this$props$viewLimit = this.props.viewLimits) === null || _this$props$viewLimit === void 0 ? void 0 : _this$props$viewLimit.center);
        }

        if (viewport.hasOwnProperty('zoom') && Number.isFinite(viewport.zoom) && viewport.zoom !== this.state.leafletView.zoom) {
          change.boxRange = map.view.getBoxRangeFromZoomLevel(viewport.zoom, this.state.width, this.state.height);
        }

        if (!_isEmpty2(change) && !this.hasResized()) {
          var _this$props$viewLimit2;

          change = map.view.ensureViewIntegrity(change);

          if ((_this$props$viewLimit2 = this.props.viewLimits) !== null && _this$props$viewLimit2 !== void 0 && _this$props$viewLimit2.center) {
            /* Center coordinate values are compared by value. If the map view is changed from inside (by dragging) and the center gets out of the range, then the center coordinates are adjusted to those limits. However, if we move the map a bit again, these values will remain the same and the map component will not reredner. Therefore, it is necessary to make insignificant change in center coordinates values */
            change.center = {
              lat: change.center.lat + Math.random() / Math.pow(10, 13),
              lon: change.center.lon + Math.random() / Math.pow(10, 13)
            };
          }

          if (this.props.onViewChange) {
            this.props.onViewChange(change);
          } // just presentational map
          else {
              this.setState({
                view: _objectSpread2(_objectSpread2(_objectSpread2({}, this.props.view), this.state.view), change)
              });
            }
        }
      }
    }
  }, {
    key: "hasResized",
    value: function hasResized() {
      var _this$leafletMap$_siz = this.leafletMap._size,
          x = _this$leafletMap$_siz.x,
          y = _this$leafletMap$_siz.y; // take into account only a significant change in size

      var widthChange = Math.abs(x - this.state.width) > 5;
      var heightChange = Math.abs(y - this.state.height) > 5;
      return widthChange || heightChange;
    }
  }, {
    key: "onResize",
    value: function onResize(width, height) {
      height = viewport.roundDimension(height);
      width = viewport.roundDimension(width);

      if (this.leafletMap) {
        this.leafletMap.invalidateSize();
      }

      if (!this.maxZoom && !this.minZoom) {
        this.setZoomLevelsBounds(width, height);
      }

      this.setState({
        width: width,
        height: height,
        leafletView: viewHelpers.getLeafletViewportFromViewParams(this.state.view || this.props.view, this.state.width, this.state.height)
      });

      if (this.props.onResize) {
        this.props.onResize(width, height);
      }
    }
  }, {
    key: "render",
    value: function render() {
      return /*#__PURE__*/React$1.createElement(React$1.Fragment, null, /*#__PURE__*/React$1.createElement(ReactResizeDetector, {
        handleHeight: true,
        handleWidth: true,
        onResize: this.onResize,
        refreshMode: "debounce",
        refreshRate: 500
      }), this.state.width && this.state.height ? this.renderMap() : null);
    }
  }, {
    key: "renderMap",
    value: function renderMap() {
      var _this2 = this;

      var leafletView = viewHelpers.getLeafletViewportFromViewParams(this.state.view || this.props.view, this.state.width, this.state.height); // fix for backward compatibility

      var backgroundLayersSource = _isArray2(this.props.backgroundLayer) ? this.props.backgroundLayer : [this.props.backgroundLayer];
      var backgroundLayersZindex = constants.defaultLeafletPaneZindex + 1;
      var backgroundLayers = backgroundLayersSource && backgroundLayersSource.map(function (layer, i) {
        return _this2.getLayerByType(layer, i, null, leafletView.zoom);
      });
      var baseLayersZindex = constants.defaultLeafletPaneZindex + 101;
      var layers = this.props.layers && this.props.layers.map(function (layer, i) {
        return /*#__PURE__*/React$1.createElement(Pane, {
          key: layer.key || i,
          style: {
            zIndex: baseLayersZindex + i
          }
        }, _this2.getLayerByType(layer, i, baseLayersZindex + i, leafletView.zoom));
      }); //
      // Add debug grid layer on under all "layers" or at the top
      //

      if (this.props.debugTileGrid) {
        var _this$props$debugTile, _layers;

        var bottom = (_this$props$debugTile = this.props.debugTileGrid) === null || _this$props$debugTile === void 0 ? void 0 : _this$props$debugTile.bottom;
        var zIndex = bottom ? 0 : (((_layers = layers) === null || _layers === void 0 ? void 0 : _layers.length) || 0) + 1;
        var tileGridLayer = /*#__PURE__*/React$1.createElement(Pane, {
          key: 'tilegrid',
          style: {
            zIndex: baseLayersZindex + zIndex - 1
          }
        }, this.getLayerByType({
          type: 'tile-grid',
          key: 'tilegrid',
          layerKey: 'tilegridlayerkey',
          options: {
            viewport: {
              width: this.state.width,
              height: this.state.height
            }
          }
        }, 0, baseLayersZindex + zIndex - 1, leafletView.zoom));

        if (bottom) {
          layers = layers ? [tileGridLayer].concat(_toConsumableArray(layers)) : [tileGridLayer];
        } else {
          layers = layers ? [].concat(_toConsumableArray(layers), [tileGridLayer]) : [tileGridLayer];
        }
      }

      return /*#__PURE__*/React$1.createElement(Map$1, {
        id: this.props.mapKey,
        ref: function ref(map) {
          _this2.leafletMap = map && map.leafletElement;
        },
        className: "ptr-map ptr-leaflet-map",
        onViewportChanged: this.onViewportChanged,
        onClick: this.onClick,
        center: leafletView.center,
        zoom: leafletView.zoom,
        zoomControl: false,
        minZoom: this.minZoom // non-dynamic prop
        ,
        maxZoom: this.maxZoom // non-dynamic prop
        ,
        attributionControl: false,
        crs: this.state.crs,
        animate: false
      }, /*#__PURE__*/React$1.createElement(Pane, {
        style: {
          zIndex: backgroundLayersZindex
        }
      }, backgroundLayers), layers, this.props.children);
    }
  }, {
    key: "getLayerByType",
    value: function getLayerByType(layer, i, zIndex, zoom) {
      if (layer && layer.type) {
        switch (layer.type) {
          case 'wmts':
            return this.getTileLayer(layer, i);

          case 'wms':
            return this.getWmsTileLayer(layer, i);

          case 'vector':
          case 'tiledVector':
          case 'tiled-vector':
          case 'diagram':
            return this.getVectorLayer(layer, i, zIndex, zoom);

          case 'tile-grid':
            return this.getTileGridLayer(layer, i, zIndex, zoom);

          default:
            return null;
        }
      } else {
        return null;
      }
    }
  }, {
    key: "getVectorLayer",
    value: function getVectorLayer(layer, i, zIndex, zoom) {
      return /*#__PURE__*/React$1.createElement(VectorLayer, {
        key: layer.key || i,
        layerKey: layer.layerKey || layer.key,
        uniqueLayerKey: layer.key || i,
        resources: this.props.resources,
        onClick: this.onLayerClick,
        opacity: layer.opacity || 1,
        options: layer.options,
        type: layer.type,
        view: this.state.view || this.props.view,
        width: this.state.width,
        height: this.state.height,
        crs: this.props.crs,
        zoom: zoom,
        zIndex: zIndex
      });
    }
  }, {
    key: "getTileGridLayer",
    value: function getTileGridLayer(layer, i, zIndex, zoom) {
      return /*#__PURE__*/React$1.createElement(TileGridLayer$1, {
        key: layer.key || i,
        layerKey: layer.layerKey || layer.key,
        uniqueLayerKey: layer.key || i,
        view: this.state.view || this.props.view,
        options: layer.options,
        zoom: zoom,
        zIndex: zIndex
      });
    }
  }, {
    key: "getTileLayer",
    value: function getTileLayer(layer, i) {
      var _layer$options = layer.options,
          url = _layer$options.url,
          restOptions = _objectWithoutProperties(_layer$options, ["url"]); // fix for backward compatibility


      if (layer.options.urls) {
        url = layer.options.urls[0];
      }

      return /*#__PURE__*/React$1.createElement(TileLayer$1, _extends({
        key: layer.key || i,
        url: url
      }, restOptions));
    }
  }, {
    key: "getWmsTileLayer",
    value: function getWmsTileLayer(layer, i) {
      var o = layer.options;
      var layers = o.params && o.params.layers || '';
      var crs = o.params && o.params.crs && this.getCRS(o.params.crs) || null;
      var imageFormat = o.params && o.params.imageFormat || 'image/png';
      var reservedParamsKeys = ['layers', 'crs', 'imageFormat', 'pane', 'maxZoom', 'styles'];
      var restParameters = o.params && Object.entries(o.params).reduce(function (acc, _ref) {
        var _ref2 = _slicedToArray(_ref, 2),
            key = _ref2[0],
            value = _ref2[1];

        if (reservedParamsKeys.includes(key)) {
          return acc;
        } else {
          acc[key] = value;
          return acc;
        }
      }, {}) || {};
      return /*#__PURE__*/React$1.createElement(WMSLayer$1, {
        key: layer.key || i,
        url: o.url,
        crs: crs,
        singleTile: o.singleTile === true,
        params: _objectSpread2({
          layers: layers,
          opacity: layer.opacity || 1,
          transparent: true,
          format: imageFormat
        }, restParameters)
      });
    }
  }, {
    key: "onLayerClick",
    value: function onLayerClick(layerKey, featureKeys) {
      if (this.props.onLayerClick) {
        this.props.onLayerClick(this.props.mapKey, layerKey, featureKeys);
      }
    }
  }, {
    key: "onClick",
    value: function onClick() {
      if (this.props.onClick) {
        this.props.onClick(this.props.view);
      }
    }
  }]);

  return ReactLeafletMap;
}(React$1.PureComponent);

ReactLeafletMap.propTypes = {
  backgroundLayer: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  name: PropTypes.string,
  crs: PropTypes.string,
  layers: PropTypes.array,
  mapKey: PropTypes.string.isRequired,
  onClick: PropTypes.func,
  onLayerClick: PropTypes.func,
  onViewChange: PropTypes.func,
  resources: PropTypes.object,
  view: PropTypes.object,
  viewLimits: PropTypes.object,
  debugTileGrid: PropTypes.oneOfType([PropTypes.bool, PropTypes.shape({
    bottom: PropTypes.bool
  })])
};

var index$2 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  'default': ReactLeafletMap
});

var SimpleLayersControl = /*#__PURE__*/function (_React$PureComponent) {
  _inherits(SimpleLayersControl, _React$PureComponent);

  var _super = _createSuper(SimpleLayersControl);

  function SimpleLayersControl(props) {
    var _this;

    _classCallCheck(this, SimpleLayersControl);

    _this = _super.call(this, props);
    _this.ref = /*#__PURE__*/React$1.createRef();
    _this.state = {
      open: false
    };
    _this.onControlButtonClick = _this.onControlButtonClick.bind(_assertThisInitialized(_this));
    _this.onBlur = _this.onBlur.bind(_assertThisInitialized(_this));
    return _this;
  }

  _createClass(SimpleLayersControl, [{
    key: "onBlur",
    value: function onBlur(e) {
      var _this2 = this;

      setTimeout(function () {
        _this2.setState({
          open: false
        });
      }, 50);
    }
  }, {
    key: "onControlButtonClick",
    value: function onControlButtonClick() {
      this.setState({
        open: !this.state.open
      });
    }
  }, {
    key: "onLayerTileClick",
    value: function onLayerTileClick(key) {
      if (this.props.onSelect) {
        this.props.onSelect(key);
      }
    }
  }, {
    key: "render",
    value: function render() {
      var buttonClasses = classnames('ptr-simple-layers-control control', {
        open: this.state.open
      });
      return /*#__PURE__*/React$1.createElement("div", {
        className: buttonClasses,
        onBlur: this.onBlur,
        ref: this.ref
      }, /*#__PURE__*/React$1.createElement(Button, {
        onClick: this.onControlButtonClick
      }, /*#__PURE__*/React$1.createElement(Icon, {
        icon: "layers"
      })), this.renderMenu());
    }
  }, {
    key: "renderMenu",
    value: function renderMenu() {
      var _this3 = this;

      var layers = this.props.layers;
      var tileWidth = 7;
      var tileHeight = 5;
      var tileMargin = 0.25;
      var contentMargin = 1;

      if (layers) {
        var grid = this.getGrid(layers.length);
        var menuClasses = classnames('ptr-simple-layers-control-menu', {
          open: this.state.open,
          right: this.props.right,
          left: !this.props.right
        });
        var menuStyle = {
          width: this.state.open ? "".concat((tileWidth + 2 * tileMargin) * grid.width + 2 * contentMargin, "rem") : 0,
          height: this.state.open ? "".concat((tileHeight + 2 * tileMargin) * grid.height + 2 * contentMargin, "rem") : '2rem'
        };
        var contentStyle = {
          margin: "".concat(contentMargin, "rem"),
          width: "calc(100% - ".concat(2 * contentMargin, "rem)"),
          height: "calc(100% - ".concat(2 * contentMargin, "rem)")
        };
        return /*#__PURE__*/React$1.createElement("div", {
          className: menuClasses,
          style: menuStyle
        }, /*#__PURE__*/React$1.createElement("div", {
          className: "ptr-simple-layers-control-menu-content",
          style: contentStyle
        }, layers.map(function (layer) {
          return _this3.renderTile(layer, tileWidth, tileHeight, tileMargin);
        })));
      } else {
        return null;
      }
    }
  }, {
    key: "renderTile",
    value: function renderTile(layer, width, height, margin) {
      var active = layer.key === this.props.activeLayer.key;
      var classes = classnames('ptr-simple-layers-control-tile', {
        active: active
      });
      var style = {
        width: "".concat(width, "rem"),
        height: "".concat(height, "rem"),
        margin: "".concat(margin, "rem")
      };

      if (layer.thumbnail) ;

      return /*#__PURE__*/React$1.createElement("div", {
        key: layer.key,
        style: style,
        className: classes,
        onClick: this.onLayerTileClick.bind(this, layer.key)
      }, /*#__PURE__*/React$1.createElement("div", {
        className: "ptr-simple-layers-control-tile-name"
      }, layer.name));
    }
  }, {
    key: "getGrid",
    value: function getGrid(count) {
      var width = 1;
      var height = 1; // TODO solve 9+ cases

      if (count >= 7) {
        width = 3;
        height = 3;
      } else if (count >= 5) {
        width = 2;
        height = 3;
      } else if (count === 4) {
        width = 2;
        height = 2;
      } else if (count === 3) {
        height = 3;
      } else if (count === 2) {
        height = 2;
      }

      return {
        width: width,
        height: height
      };
    }
  }]);

  return SimpleLayersControl;
}(React$1.PureComponent);

SimpleLayersControl.propTypes = {
  activeLayer: PropTypes.object,
  layers: PropTypes.array,
  onSelect: PropTypes.func,
  right: PropTypes.bool
};

var Angle = WorldWind.Angle,
    WWMath = WorldWind.WWMath;
/**
 * @param {WorldWind.WorldWindController} basicController
 * @param {Object} viewLimits
 */

function decorateWorldWindowController (basicController, viewLimits, levelsBased) {
  //Customized applyLimits function that call onNavigatorChanged on every execution
  var applyLimits = function applyLimits() {
    var navigator = basicController.wwd.navigator;
    var _basicController$wwd$ = basicController.wwd.viewport,
        width = _basicController$wwd$.width,
        height = _basicController$wwd$.height;

    if (!levelsBased) {
      var minBoxRange = viewLimits && viewLimits.boxRangeRange && viewLimits.boxRangeRange[0] || mapConstants.minBoxRange;
      var maxBoxRange = viewLimits && viewLimits.boxRangeRange && viewLimits.boxRangeRange[1] || mapConstants.maxBoxRange;
      var currentRange = view.getBoxRangeFromWorldWindRange(navigator.range, width, height);

      if (currentRange < minBoxRange) {
        navigator.range = view.getWorldWindRangeFromBoxRange(minBoxRange, width, height);
      } else if (currentRange > maxBoxRange) {
        navigator.range = view.getWorldWindRangeFromBoxRange(maxBoxRange, width, height);
      }
    } // TODO apply other viewLimits params
    // Clamp latitude to between -90 and +90, and normalize longitude to between -180 and +180.


    navigator.lookAtLocation.latitude = WWMath.clamp(navigator.lookAtLocation.latitude, -90, 90);
    navigator.lookAtLocation.longitude = Angle.normalizedDegreesLongitude(navigator.lookAtLocation.longitude); // Normalize heading to between -180 and +180.

    navigator.heading = Angle.normalizedDegrees(navigator.heading); // Clamp tilt to between 0 and +90 to prevent the viewer from going upside down.

    navigator.tilt = WWMath.clamp(navigator.tilt, 0, 90); // Normalize heading to between -180 and +180.

    navigator.roll = Angle.normalizedDegrees(navigator.roll); // Apply 2D limits when the globe is 2D.

    if (basicController.wwd.globe.is2D() && navigator.enable2DLimits) {
      // Clamp range to prevent more than 360 degrees of visible longitude. Assumes a 45 degree horizontal
      // field of view.
      var maxRange = 2 * Math.PI * basicController.wwd.globe.equatorialRadius;
      navigator.range = WWMath.clamp(navigator.range, 1, maxRange); // Force tilt to 0 when in 2D mode to keep the viewer looking straight down.

      navigator.tilt = 0;
    } //event map changed


    if (typeof basicController.onNavigatorChanged === 'function') {
      basicController.onNavigatorChanged(navigator);
    }
  };

  basicController.applyLimits = applyLimits;
  basicController.onNavigatorChanged = null;
}

/**
 * @param layer {Object}
 * @param layer.key {string}
 * @param layer.name {string}
 * @param layer.opacity {number}
 * @param layer.options {Object}
 * @param layer.options.features {Array}
 * @augments WorldWind.RenderableLayer
 * @constructor
 */

var VectorLayer$1 = /*#__PURE__*/function (_WorldWind$Renderable) {
  _inherits(VectorLayer, _WorldWind$Renderable);

  var _super = _createSuper(VectorLayer);

  function VectorLayer(layer, options) {
    var _this;

    _classCallCheck(this, VectorLayer);

    var name = layer.name || '';
    _this = _super.call(this, name);
    _this.opacity = layer.opacity || 1;
    _this.pantherProps = {
      features: options.features || [],
      fidColumnName: options.fidColumnName,
      hoverable: options.hoverable,
      selectable: options.selectable,
      hovered: _objectSpread2({}, options.hovered),
      selected: _objectSpread2({}, options.selected),
      key: layer.key,
      layerKey: options.layerKey,
      onHover: options.onHover,
      onClick: options.onClick,
      style: options.style
    };

    _this.addFeatures(_this.pantherProps.features);

    return _this;
  }
  /**;
   * @param features {Array} List of GeoJSON features
   */


  _createClass(VectorLayer, [{
    key: "addFeatures",
    value: function addFeatures(features) {
      var _this2 = this;

      var geojson = {
        type: 'FeatureCollection',
        features: features
      };
      var parser = new WorldWind.GeoJSONParser(geojson);

      var shapeConfigurationCallback = function shapeConfigurationCallback(geometry, properties) {
        var _this2$pantherProps$h;

        var defaultStyleObject = utils$2.mapStyle.getStyleObject(properties, _this2.pantherProps.style || constants.vectorFeatureStyle.defaultFull);

        var defaultStyle = _this2.getStyleDefinition(defaultStyleObject);

        var hoveredStyleObject, hoveredStyle;

        if ((_this2$pantherProps$h = _this2.pantherProps.hovered) !== null && _this2$pantherProps$h !== void 0 && _this2$pantherProps$h.style) {
          hoveredStyleObject = _this2.pantherProps.hovered.style === 'default' ? constants.vectorFeatureStyle.hovered : _this2.pantherProps.hovered.style;
          hoveredStyle = _this2.getStyleDefinition(_objectSpread2(_objectSpread2({}, defaultStyleObject), hoveredStyleObject));
        }

        return {
          userProperties: _objectSpread2(_objectSpread2({}, properties), {}, {
            defaultStyleObject: defaultStyleObject,
            defaultStyle: defaultStyle,
            hoveredStyleObject: hoveredStyleObject,
            hoveredStyle: hoveredStyle
          })
        };
      };

      var renderablesAddCallback = function renderablesAddCallback(layer) {
        layer.renderables.forEach(function (renderable) {
          _this2.applyStyles(renderable);
        });
      };

      parser.load(renderablesAddCallback, shapeConfigurationCallback, this);
    }
    /**
     * @param fids {Array}
     */

  }, {
    key: "updateHoveredFeatures",
    value: function updateHoveredFeatures(fids) {
      var _this3 = this;

      this.renderables.forEach(function (renderable) {
        var key = renderable.userProperties[_this3.pantherProps.fidColumnName];

        if (_includes2(fids, key)) {
          var selection = _this3.getSelection(renderable);

          if (selection !== null && selection !== void 0 && selection.hoveredStyle) {
            var selectedHoveredStyleObject = selection.hoveredStyle === 'default' ? constants.vectorFeatureStyle.selectedHovered : selection.hoveredStyle;

            var selectedHoveredStyle = _this3.getStyleDefinition(_objectSpread2(_objectSpread2({}, renderable.userProperties.defaultStyleObject), selectedHoveredStyleObject));

            _this3.applyWorldWindStyles(renderable, selectedHoveredStyle);
          } else if (renderable.userProperties.hoveredStyle) {
            _this3.applyWorldWindStyles(renderable, renderable.userProperties.hoveredStyle);
          }
        } else {
          _this3.applyStyles(renderable);
        }
      });
    }
    /**
     * Convert panther style definition to World Wind style definition
     * @param styleObject {Object}
     * @return {Object}
     */

  }, {
    key: "getStyleDefinition",
    value: function getStyleDefinition(styleObject) {
      var style = {};

      if (styleObject.fill) {
        var fillRgb = utils$2.mapStyle.hexToRgb(styleObject.fill);
        style.interiorColor = new WorldWind.Color(fillRgb.r / 255, fillRgb.g / 256, fillRgb.b / 256, styleObject.fillOpacity || 1);
      } else {
        style.interiorColor = WorldWind.Color.TRANSPARENT;
      }

      if (styleObject.outlineColor && styleObject.outlineWidth) {
        var outlineRgb = utils$2.mapStyle.hexToRgb(styleObject.outlineColor);
        style.outlineColor = new WorldWind.Color(outlineRgb.r / 255, outlineRgb.g / 256, outlineRgb.b / 256, styleObject.outlineOpacity || 1);
        style.outlineWidth = styleObject.outlineWidth;
      } else {
        style.outlineColor = WorldWind.Color.TRANSPARENT;
      }

      return style;
    }
    /**
     * Get selection for feature
     * @param renderable {Object}
     * @return {Object}
     */

  }, {
    key: "getSelection",
    value: function getSelection(renderable) {
      if (this.pantherProps.selected) {
        var featureKey = renderable.userProperties[this.pantherProps.fidColumnName];
        var selectionDefintion = null;

        _forIn2(this.pantherProps.selected, function (selection, key) {
          if (selection.keys && _includes2(selection.keys, featureKey)) {
            selectionDefintion = selection;
          }
        });

        return selectionDefintion;
      } else {
        return null;
      }
    }
    /**
     * @param renderable {WorldWind.Renderable}
     */

  }, {
    key: "applyStyles",
    value: function applyStyles(renderable) {
      var defaultStyleObject = renderable.userProperties.defaultStyleObject;
      var selection = this.getSelection(renderable);

      if (selection !== null && selection !== void 0 && selection.style) {
        var selectedStyleObject = selection.style === 'default' ? constants.vectorFeatureStyle.selected : selection.style;
        var selectedStyle = this.getStyleDefinition(_objectSpread2(_objectSpread2({}, defaultStyleObject), selectedStyleObject));
        this.applyWorldWindStyles(renderable, selectedStyle);
      } else {
        this.applyWorldWindStyles(renderable, renderable.userProperties.defaultStyle);
      }
    }
    /**
     * @param renderable {WorldWind.Renderable}
     * @param style {Object}
     */

  }, {
    key: "applyWorldWindStyles",
    value: function applyWorldWindStyles(renderable, style) {
      renderable.attributes.outlineWidth = style.outlineWidth;
      renderable.attributes.outlineColor = style.outlineColor;
      renderable.attributes.interiorColor = style.interiorColor;
    }
  }]);

  return VectorLayer;
}(WorldWind.RenderableLayer);

var Location = WorldWind.Location,
    Sector = WorldWind.Sector,
    MercatorTiledImageLayer = WorldWind.MercatorTiledImageLayer;
/**
 * Constructs an Open Street Map layer.
 * @alias OpenStreetMapImageLayer
 * @constructor
 * @augments MercatorTiledImageLayer
 * @classdesc Provides a layer that shows Open Street Map imagery.
 *
 * @param {String} displayName This layer's display name. "Open Street Map" if this parameter is
 * null or undefined.
 */

var OsmLayer = /*#__PURE__*/function (_MercatorTiledImageLa) {
  _inherits(OsmLayer, _MercatorTiledImageLa);

  var _super = _createSuper(OsmLayer);

  function OsmLayer(displayName) {
    var _this;

    _classCallCheck(this, OsmLayer);

    displayName = displayName || 'Open Street Map';
    _this = _super.call(this, new Sector(-85.05, 85.05, -180, 180), new Location(85.05, 180), 19, 'image/png', displayName, 256, 256);
    _this.displayName = displayName;
    _this.pickEnabled = false; // Create a canvas we can use when unprojecting retrieved images.

    _this.destCanvas = document.createElement('canvas');
    _this.destContext = _this.destCanvas.getContext('2d');
    _this.urlBuilder = {
      urlForTile: function urlForTile(tile, imageFormat) {
        //var url = "https://a.tile.openstreetmap.org/" +
        return 'https://otile1.mqcdn.com/tiles/1.0.0/osm/' + (tile.level.levelNumber + 1) + '/' + tile.column + '/' + tile.row + '.png';
      }
    };
    _this.doRender = _this.doRender.bind(_assertThisInitialized(_this));
    return _this;
  }

  _createClass(OsmLayer, [{
    key: "doRender",
    value: function doRender(dc) {
      MercatorTiledImageLayer.prototype.doRender.call(this, dc);
    } // Overridden from TiledImageLayer.

  }, {
    key: "createTopLevelTiles",
    value: function createTopLevelTiles(dc) {
      this.topLevelTiles = [];
      this.topLevelTiles.push(this.createTile(null, this.levels.firstLevel(), 0, 0));
      this.topLevelTiles.push(this.createTile(null, this.levels.firstLevel(), 0, 1));
      this.topLevelTiles.push(this.createTile(null, this.levels.firstLevel(), 1, 0));
      this.topLevelTiles.push(this.createTile(null, this.levels.firstLevel(), 1, 1));
    } // Determines the Bing map size for a specified level number.

  }, {
    key: "mapSizeForLevel",
    value: function mapSizeForLevel(levelNumber) {
      return 256 << levelNumber + 1;
    }
  }]);

  return OsmLayer;
}(MercatorTiledImageLayer);

var ArgumentError = WorldWind.ArgumentError,
    Logger = WorldWind.Logger;

var WikimediaLayer = /*#__PURE__*/function (_OsmLayer) {
  _inherits(WikimediaLayer, _OsmLayer);

  var _super = _createSuper(WikimediaLayer);

  function WikimediaLayer(options) {
    var _this;

    _classCallCheck(this, WikimediaLayer);

    _this = _super.call(this, '');
    _this.imageSize = 256;

    if (!options.source && !options.sourceObject) {
      throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, 'MyOsmLayer', 'constructor', 'missingSource'));
    }

    _this._source = options.sourceObject ? _this.buildSourceUrl(options.sourceObject) : options.source;
    _this._attribution = options.attribution;
    _this._imageType = options.imageType ? options.imageType : 'png';
    _this.cachePath = _this._source;
    _this.detailControl = options.detailControl ? options.detailControl : 1;
    _this.levels.numLevels = 18;

    var self = _assertThisInitialized(_this);

    _this.urlBuilder = {
      urlForTile: function urlForTile(tile, imageFormat) {
        return self._source + (tile.level.levelNumber + 1) + '/' + tile.column + '/' + tile.row + '.' + self._imageType;
      }
    };
    return _this;
  }
  /**
   * Build source URL
   * @param source {Object}
   * @returns {string} URL of source
   */


  _createClass(WikimediaLayer, [{
    key: "buildSourceUrl",
    value: function buildSourceUrl(source) {
      var prefix = this.buildPrefix(source.prefixes);
      var protocol = source.protocol ? source.protocol + '://' : 'http://';
      var host = source.host + '/';
      var path = source.path ? source.path + '/' : '';
      return protocol + prefix + host + path;
    }
  }, {
    key: "buildPrefix",
    value: function buildPrefix(prefixes) {
      var prefix = '';

      if (prefixes) {
        var index = Math.floor(Math.random() * prefixes.length);
        prefix = prefixes[index] + '.';
      }

      return prefix;
    }
  }]);

  return WikimediaLayer;
}(OsmLayer);

/**
 * @param layer {Object}
 * @param layer.key {string}
 * @param layer.opacity {number}
 * @param layer.options {Object}
 * @param layer.options.url {string}
 * @param layer.options.params {object}
 * @augments WorldWind.WmsLayer
 * @constructor
 */
var WmsLayer = /*#__PURE__*/function (_WorldWind$WmsLayer) {
  _inherits(WmsLayer, _WorldWind$WmsLayer);

  var _super = _createSuper(WmsLayer);

  function WmsLayer(layer) {
    var _this;

    _classCallCheck(this, WmsLayer);

    var key = layer.key,
        options = layer.options,
        opacity = layer.opacity;

    var _options$params = options.params,
        imageFormat = _options$params.imageFormat,
        layers = _options$params.layers,
        name = _options$params.name,
        styles = _options$params.styles,
        version = _options$params.version,
        params = _objectWithoutProperties(_options$params, ["imageFormat", "layers", "name", "styles", "version"]);

    var worldWindOptions = {
      key: key,
      format: imageFormat || 'image/png',
      layerNames: layers,
      levelZeroDelta: new WorldWind.Location(45, 45),
      name: name,
      numLevels: 18,
      opacity: opacity || 1,
      params: _isEmpty2(params) ? null : params,
      sector: new WorldWind.Sector(-90, 90, -180, 180),
      service: options.url,
      size: 256,
      styleNames: styles,
      version: version || '1.3.0'
    };
    _this = _super.call(this, worldWindOptions);
    _this.key = key;
    _this.attributions = options.attributions;
    _this.layerNames = layers;
    _this.service = options.url;
    _this.styleNames = styles || '';
    _this.customParams = params;
    _this.numLevels = worldWindOptions.numLevels;
    _this.cachePath = "".concat(_this.service, "/").concat(_this.layerNames);

    if (_this.styleNames) {
      _this.cachePath += "/".concat(_this.styleNames);
    }

    if (_this.customParams && _this.customParams.time) {
      _this.cachePath += "/".concat(_this.customParams.time);
    }

    _this.opacity = worldWindOptions.opacity; // TODO extend url builder to accept custom params

    return _this;
  }

  _createClass(WmsLayer, [{
    key: "doRender",
    value: function doRender(dc) {
      WorldWind.WmsLayer.prototype.doRender.call(this, dc);
      dc.screenCreditController.clear();
    }
  }]);

  return WmsLayer;
}(WorldWind.WmsLayer);

var WmtsLayer = /*#__PURE__*/function (_OsmLayer) {
  _inherits(WmtsLayer, _OsmLayer);

  var _super = _createSuper(WmtsLayer);

  function WmtsLayer(layer) {
    var _this;

    _classCallCheck(this, WmtsLayer);

    _this = _super.call(this, '');
    _this.imageSize = 256;
    _this.detailControl = 1;
    _this.levels.numLevels = 18;
    _this.cachePath = layer.options.url;
    _this.urlBuilder = _objectSpread2(_objectSpread2({}, _this.urlBuilder), {}, {
      urlForTile: _this.urlForTile.bind(_assertThisInitialized(_this), layer.options.url)
    });
    return _this;
  }
  /**
   * @param url {string} URL template
   * @param tile {Tile}
   * @param imageFormat {string}
   * @returns {string} Final url for request
   */


  _createClass(WmtsLayer, [{
    key: "urlForTile",
    value: function urlForTile(url, tile, imageFormat) {
      var template = uriTemplates(url);

      if (template && template.varNames && template.varNames.length) {
        var prefixes = ['a', 'b', 'c']; // TODO optional

        var numberOfUrls = prefixes.length;
        var index = tile.row % numberOfUrls;
        return template.fill({
          s: prefixes[index],
          z: tile.level.levelNumber + 1,
          x: tile.column,
          y: tile.row
        });
      } else {
        return "".concat(url, "/").concat(tile.level.levelNumber + 1, "/").concat(tile.column, "/").concat(tile.row, ".").concat(WorldWind.WWUtil.suffixForMimeType(imageFormat));
      }
    }
  }]);

  return WmtsLayer;
}(OsmLayer);

/**
 * @param context
 * @param x0 {number} starting x coordinate
 * @param y0 {number} starting y coordinate
 * @param x1 {number} ending x coordinate
 * @param y1 {number} ending y coordinate
 * @param color {string} hex code
 * @param width {number} line width in pixels
 */
function arrow(context, x0, y0, x1, y1, color, width) {
  context.beginPath();
  context.moveTo(x0, y0);
  context.lineTo(x1, y1);
  context.strokeStyle = color;
  context.lineWidth = width;
  context.stroke();
}
/**
 * @param context
 * @param cx {number} x coordinate of center
 * @param cy {number} y coordinate of center
 * @param rx {number} x radius
 * @param ry {number} y radius
 * @param style {Object}
 */


function ellipse(context, cx, cy, rx, ry, style) {
  context.save(); // save state

  context.beginPath();
  context.translate(cx - rx, cy - ry);
  context.scale(rx, ry);
  context.arc(1, 1, 1, 0, 2 * Math.PI, false);
  fillPolygon(context, style);
}

function path(context, nodes, style) {
  context.save(); // save state

  context.beginPath();
  nodes.forEach(function (node, index) {
    if (index === 0) {
      context.moveTo(node[0], node[1]);
    } else {
      context.lineTo(node[0], node[1]);
    }
  });
  fillPolygon(context, style);
}
/**
 *
 * @param context
 * @param x0
 * @param y0
 * @param dx
 * @param dy
 * @param style
 */


function rectangle(context, x0, y0, dx, dy, style) {
  context.save(); // save state

  context.beginPath();
  context.rect(x0, y0, dx, dy);
  fillPolygon(context, style);
} // helpers


function fillPolygon(context, style) {
  context.restore(); // restore to original state

  context.fillStyle = style.fill;
  context.lineWidth = style.outlineWidth;
  context.strokeStyle = style.outlineColor;
  context.globalAlpha = style.fillOpacity || style.outlineOpacity; // TODO solve opacity properly

  context.fill();
  context.stroke();
}

var shapes$2 = {
  arrow: arrow,
  ellipse: ellipse,
  path: path,
  rectangle: rectangle
};

var LargeDataLayerTile = /*#__PURE__*/function () {
  function LargeDataLayerTile(data, options, style, fidColumnName, selected, hovered) {
    _classCallCheck(this, LargeDataLayerTile);

    this._data = data;
    this._style = style;
    this._fidColumnName = fidColumnName;
    this._hovered = hovered; // todo here?

    if (this._hovered && this._hovered.keys) {
      this._hoveredStyle = mapStyle.getStyleObject(null, this._hovered.style, true); // todo add default
    }

    if (selected && !_isEmpty2(selected)) {
      var sel = [];

      _forIn2(selected, function (selectedDef) {
        if (selectedDef && !_isEmpty2(selectedDef)) {
          sel.push({
            keys: selectedDef.keys,
            style: mapStyle.getStyleObject(null, selectedDef.style, true) // todo add default

          });
        }
      });

      this._selected = sel.length ? sel : null;
    }

    this._sector = options.sector;
    this._canvas = this.createCanvas(options.width, options.height);
    this._width = options.width;
    this._height = options.height;
    var tileCenterLatitude = (this._sector.maxLatitude + this._sector.minLatitude) * (Math.PI / 180) / 2;
    this._latitudeFactor = 1 / Math.cos(Math.abs(tileCenterLatitude));
  }
  /**
   * Returns the drawn HeatMapTile in the form of URL.
   * @return {String} Data URL of the tile.
   */


  _createClass(LargeDataLayerTile, [{
    key: "url",
    value: function url() {
      return this.draw().toDataURL();
    }
    /**
     * Returns the whole Canvas. It is then possible to use further. This one is actually used in the
     * HeatMapLayer mechanism so if you want to provide some custom implementation of Canvas creation in your tile,
     * change this method.
     * @return {HTMLCanvasElement} Canvas Element representing the drawn tile.
     */

  }, {
    key: "canvas",
    value: function canvas() {
      return this.draw();
    }
    /**
     * Draws the shapes on the canvas.
     * @returns {HTMLCanvasElement}
     */

  }, {
    key: "draw",
    value: function draw() {
      var _this = this;

      var ctx = this._canvas.getContext('2d');

      var hovered = [];
      var selected = [];

      for (var i = 0; i < this._data.length; i++) {
        var dataPoint = this._data[i];
        var attributes = dataPoint.data;
        var isHovered = this.isHovered(attributes);
        var isSelected = this.isSelected(attributes);

        if (isSelected) {
          selected.push(dataPoint);
        } else if (isHovered) {
          hovered.push(dataPoint);
        } else {
          this.shape(ctx, dataPoint);
        }
      } // draw hovered


      hovered.forEach(function (dataPoint) {
        _this.shape(ctx, dataPoint, true);
      }); // draw selected

      selected.forEach(function (dataPoint) {
        _this.shape(ctx, dataPoint, false, true);
      });
      return this._canvas;
    }
  }, {
    key: "isHovered",
    value: function isHovered(attributes) {
      if (this._hovered && this._hovered.keys) {
        return this._hovered.keys.indexOf(attributes[this._fidColumnName]) !== -1;
      }
    }
  }, {
    key: "isSelected",
    value: function isSelected(attributes) {
      var _this2 = this;

      var isSelected = false;

      if (this._selected) {
        this._selected.forEach(function (selection) {
          var selected = selection.keys.indexOf(attributes[_this2._fidColumnName]) !== -1;

          if (selected) {
            isSelected = true;
          }
        });
      }

      return isSelected;
    }
  }, {
    key: "shape",
    value: function shape(context, data, hovered, selected) {
      var _this3 = this;

      var attributes = data.data;
      var style = mapStyle.getStyleObject(attributes, this._style); // apply hovered style, if feature is hovered

      if (hovered) {
        style = _objectSpread2(_objectSpread2({}, style), this._hoveredStyle);
      } // TODO optimize looping through selections two times
      // apply selected style, if feature is selected


      if (selected) {
        this._selected.forEach(function (selection) {
          var selected = selection.keys.indexOf(attributes[_this3._fidColumnName]) !== -1;

          if (selected) {
            style = _objectSpread2(_objectSpread2({}, style), selection.style);
          }
        });
      }

      if (style.shape) {
        if (style.shape === 'circle-with-arrow') {
          this.circleWithArrow(context, data, style);
        } else if (style.shape === 'circle') {
          this.point(context, data, style);
        } else if (style.shape === 'square') {
          this.square(context, data, style);
        } else if (style.shape === 'diamond') {
          this.diamond(context, data, style);
        } else if (style.shape === 'triangle') {
          this.triangle(context, data, style);
        } else {
          this.point(context, data, style);
        }
      } else {
        this.point(context, data, style);
      }
    }
  }, {
    key: "point",
    value: function point(context, data, style) {
      var radius = this.getSize(style) / 2;
      var center = this.getCenterCoordinates(data);
      var cy = radius;
      var cx = radius * this._latitudeFactor;
      shapes$2.ellipse(context, center[0], center[1], cx, cy, style);
    }
  }, {
    key: "square",
    value: function square(context, data, style) {
      var size = this.getSize(style);
      var center = this.getCenterCoordinates(data);
      var dx = size * this._latitudeFactor;
      shapes$2.rectangle(context, center[0] - dx / 2, center[1] - size / 2, dx, size, style);
    }
  }, {
    key: "diamond",
    value: function diamond(context, data, style) {
      var edgeLength = this.getSize(style);
      var diagonalLength = Math.sqrt(2) * edgeLength; // center coordinates

      var center = this.getCenterCoordinates(data);
      var dx = diagonalLength * this._latitudeFactor;
      var nodes = [[center[0] - dx / 2, center[1]], [center[0], center[1] - diagonalLength / 2], [center[0] + dx / 2, center[1]], [center[0], center[1] + diagonalLength / 2], [center[0] - dx / 2, center[1]]];
      shapes$2.path(context, nodes, style);
    }
  }, {
    key: "triangle",
    value: function triangle(context, data, style) {
      var edgeLength = this.getSize(style);
      var ty = Math.sqrt(Math.pow(edgeLength, 2) - Math.pow(edgeLength / 2, 2)); // center coordinates

      var center = this.getCenterCoordinates(data);
      var dx = edgeLength * this._latitudeFactor;
      var nodes = [[center[0] - dx / 2, center[1] + ty / 3], [center[0], center[1] - 2 * ty / 3], [center[0] + dx / 2, center[1] + ty / 3], [center[0] - dx / 2, center[1] + ty / 3]];
      shapes$2.path(context, nodes, style);
    }
  }, {
    key: "circleWithArrow",
    value: function circleWithArrow(context, data, style) {
      var radius = this.getSize(style) / 2;
      var direction = style.arrowDirection || 1;
      var center = this.getCenterCoordinates(data);
      var ry = radius;
      var rx = radius * this._latitudeFactor;
      shapes$2.ellipse(context, center[0], center[1], rx, ry, style);
      var x0 = center[0] + direction * rx;
      var y0 = center[1];
      var x1 = x0 + direction * style.arrowLength;
      var y1 = y0;
      shapes$2.arrow(context, x0, y0, x1, y1, style.arrowColor, style.arrowWidth);
    }
  }, {
    key: "getSize",
    value: function getSize(style) {
      if (style.size) {
        return style.size;
      } else if (style.volume) {
        if (style.shape === 'triangle') {
          return Math.sqrt(style.volume / 2);
        } else if (style.shape === 'square' || style.shape === 'diamond') {
          return Math.sqrt(style.volume);
        } else {
          return Math.sqrt(style.volume / Math.PI);
        }
      } else {
        return mapStyle.DEFAULT_SIZE;
      }
    }
  }, {
    key: "getCenterCoordinates",
    value: function getCenterCoordinates(data) {
      return [this.longitudeInSector(data, this._sector, this._width), this._height - this.latitudeInSector(data, this._sector, this._height)];
    }
    /**
     * Creates canvas element of given size.
     * @protected
     * @param width {Number} Width of the canvas in pixels
     * @param height {Number} Height of the canvas in pixels
     * @returns {HTMLCanvasElement} Created the canvas
     */

  }, {
    key: "createCanvas",
    value: function createCanvas(width, height) {
      var canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      return canvas;
    }
    /**
     * Calculates position in pixels of the point based on its latitude.
     * @param dataPoint {Object} Location to transform
     * @param sector {Sector} Sector to which transform
     * @param height {Number} Height of the tile to draw to.
     * @private
     * @returns {Number} Position on the height in pixels.
     */

  }, {
    key: "latitudeInSector",
    value: function latitudeInSector(dataPoint, sector, height) {
      var sizeOfArea = sector.maxLatitude - sector.minLatitude;
      var locationInArea = dataPoint.y - 90 - sector.minLatitude;
      return Math.ceil(locationInArea / sizeOfArea * height);
    }
    /**
     * Calculates position in pixels of the point based on its longitude.
     * @param dataPoint {Object} Location to transform
     * @param sector {Sector} Sector to which transform
     * @param width {Number} Width of the tile to draw to.
     * @private
     * @returns {Number} Position on the width in pixels.
     */

  }, {
    key: "longitudeInSector",
    value: function longitudeInSector(dataPoint, sector, width) {
      var sizeOfArea = sector.maxLongitude - sector.minLongitude;
      var locationInArea = dataPoint.x - 180 - sector.minLongitude;
      return Math.ceil(locationInArea / sizeOfArea * width);
    }
  }]);

  return LargeDataLayerTile;
}();

var Location$1 = WorldWind.Location,
    REDRAW_EVENT_TYPE = WorldWind.REDRAW_EVENT_TYPE,
    Sector$1 = WorldWind.Sector;
    WorldWind.SurfaceCircle;
    var TiledImageLayer = WorldWind.TiledImageLayer; // It supports GeoJSON as format with only points and maximum 1 000 000 points.
// Multipolygons are represented as points
// TODO: Highlight the selected points.

var LargeDataLayer = /*#__PURE__*/function (_TiledImageLayer) {
  _inherits(LargeDataLayer, _TiledImageLayer);

  var _super = _createSuper(LargeDataLayer);

  function LargeDataLayer(wwd, options, layer) {
    var _this;

    _classCallCheck(this, LargeDataLayer);

    _this = _super.call(this, new Sector$1(-90, 90, -180, 180), new Location$1(45, 45), 18, 'image/png', layer.key, 256, 256);
    _this.tileWidth = 256;
    _this.tileHeight = 256;
    _this.detailControl = 1;
    _this.wwd = wwd; // At the moment the URL must contain the GeoJSON.

    _this.processedTiles = {};
    _this.quadTree = new QuadTree(new Box(0, 0, 360, 180));
    _this.pantherProps = {
      features: options.features,
      fidColumnName: options.fidColumnName,
      hovered: _objectSpread2({}, options.hovered),
      selected: _objectSpread2({}, options.selected),
      key: layer.key,
      layerKey: layer.layerKey,
      onHover: options.onHover,
      onClick: options.onClick,
      pointHoverBuffer: options.pointHoverBuffer || mapStyle.DEFAULT_SIZE,
      style: options.style,
      wwd: wwd
    };

    if (_this.pantherProps.features) {
      _this.addFeatures(_this.pantherProps.features);
    } else {
      _this.loadData(options.url);
    }

    _this.onClick = _this.onClick.bind(_assertThisInitialized(_this), wwd);
    _this.onMouseMove = _this.onMouseMove.bind(_assertThisInitialized(_this), wwd);
    wwd.addEventListener('click', _this.onClick);
    wwd.addEventListener('mousemove', _this.onMouseMove);
    return _this;
  }

  _createClass(LargeDataLayer, [{
    key: "removeListeners",
    value: function removeListeners() {
      this.pantherProps.wwd.removeEventListener('click', this.onClick);
      this.pantherProps.wwd.removeEventListener('mousemove', this.onMouseMove);
    }
  }, {
    key: "loadData",
    value: function loadData(url) {
      var _this2 = this;

      fetch(url).then(function (data) {
        return data.json();
      }).then(function (file) {
        if (file.features.length > 1000000) {
          throw new Error('Too many features.');
        }

        _this2.addFeatures(file.features);
      });
    }
  }, {
    key: "addFeatures",
    value: function addFeatures(features) {
      var _this3 = this;

      features.forEach(function (feature) {
        var type = feature.geometry && feature.geometry.type;
        var point = null;

        var props = _objectSpread2({}, feature.properties); // TODO support other geometry types


        if (type === 'Point') {
          props.centroid = feature.geometry.coordinates;
          point = new Point$1(feature.geometry.coordinates[0] + 180, feature.geometry.coordinates[1] + 90, props);
        } else if (type === 'MultiPoint') {
          var coordinates = feature.geometry.coordinates[0];
          props.centroid = coordinates;
          point = new Point$1(coordinates[0] + 180, coordinates[1] + 90, props);
        } else if (type === 'MultiPolygon') {
          var centroid = turfCentroid(feature.geometry);
          props.centroid = centroid.geometry.coordinates;
          point = new Point$1(centroid.geometry.coordinates[0] + 180, centroid.geometry.coordinates[1] + 90, props);
        }

        if (point) {
          _this3.quadTree.insert(point);
        }
      });
      this.refresh();
    }
  }, {
    key: "handleEvent",
    value: function handleEvent(wwd, event) {
      var x = event.touches && event.touches[0] && event.touches[0].clientX || event.clientX,
          y = event.touches && event.touches[0] && event.touches[0].clientY || event.clientY;
      var pageX = event.touches && event.touches[0] && event.touches[0].pageX || event.pageX;
      var pageY = event.touches && event.touches[0] && event.touches[0].pageY || event.pageY;
      var terrainObject = wwd.pickTerrain(wwd.canvasCoordinates(x, y)).terrainObject();
      var buffer = this.getPointHoverBuffer(wwd);

      if (terrainObject) {
        var position = terrainObject.position;
        var points = this.quadTree.query(new Circle$1(position.longitude + 180, position.latitude + 90, buffer)); // find nearest

        if (points.length > 1) {
          var targetPoint = point$1([position.longitude, position.latitude]);
          var features = points.map(function (point) {
            return point$1([point.data.centroid[0], point.data.centroid[1]], _objectSpread2({}, point));
          });
          var featureCollection$1 = featureCollection(features);
          var nearest = nearestPoint(targetPoint, featureCollection$1);
          points = [nearest.properties];
        }

        return {
          points: points,
          x: pageX,
          y: pageY
        };
      } else {
        return {
          points: [],
          x: pageX,
          y: pageY
        };
      }
    }
  }, {
    key: "onMouseMove",
    value: function onMouseMove(wwd, event) {
      this.onMouseMoveResult(this.handleEvent(wwd, event));
    }
  }, {
    key: "onClick",
    value: function onClick(wwd, event) {
      this.onClickResult(this.handleEvent(wwd, event));
    }
  }, {
    key: "onClickResult",
    value: function onClickResult(data) {
      var _this4 = this;

      if (this.pantherProps.onClick) {
        var gids = data.points.map(function (point) {
          return point.data[_this4.pantherProps.fidColumnName];
        });

        if (gids && gids.length) {
          this.pantherProps.onClick(this.pantherProps.layerKey, gids);
        }
      }
    }
  }, {
    key: "onMouseMoveResult",
    value: function onMouseMoveResult(data) {
      var _this5 = this;

      if (this.pantherProps.onHover) {
        var gids = _compact2(data.points.map(function (point) {
          return point.data[_this5.pantherProps.fidColumnName];
        }));

        this.pantherProps.onHover(this.pantherProps.layerKey, gids, data.x, data.y, null, data.points, this.pantherProps.fidColumnName);
      }
    }
  }, {
    key: "retrieveTileImage",
    value: function retrieveTileImage(dc, tile, suppressRedraw) {
      this.processedTiles[tile.imagePath] = true;
      var sector = tile.sector;
      var extended = this.calculateExtendedSector(sector, 0.2, 0.2);
      var points = this.filterGeographically(extended.sector);

      if (points) {
        var imagePath = tile.imagePath,
            cache = dc.gpuResourceCache,
            layer = this;
        var canvas = this.createPointTile(points, {
          sector: sector,
          width: this.tileWidth,
          height: this.tileHeight
        }).canvas();
        var texture = layer.createTexture(dc, tile, canvas);
        layer.removeFromCurrentRetrievals(imagePath);

        if (texture) {
          cache.putResource(imagePath, texture, texture.size);
          layer.currentTilesInvalid = true;
          layer.absentResourceList.unmarkResourceAbsent(imagePath);

          if (!suppressRedraw) {
            // Send an event to request a redraw.
            var e = document.createEvent('Event');
            e.initEvent(REDRAW_EVENT_TYPE, true, true);
            window.dispatchEvent(e);
          }
        }
      }
    } // TODO Original implementation from @jbalhar
    // retrieveTileImage(dc, tile, suppressRedraw) {
    // 	// if(tile.level.levelNumber < 14 || this.processedTiles[tile.imagePath]){
    // 	// 	return;
    // 	// }
    // 	this.processedTiles[tile.imagePath] = true;
    //
    // 	const sector = tile.sector;
    // 	const extended = this.calculateExtendedSector(sector, 0.2, 0.2);
    // 	const extendedWidth = Math.ceil(extended.extensionFactorWidth * this.tileWidth);
    // 	const extendedHeight = Math.ceil(extended.extensionFactorHeight * this.tileHeight);
    //
    // 	const points = this.filterGeographically(extended.sector);
    //
    // 	if(points) {
    // 		var imagePath = tile.imagePath,
    // 			cache = dc.gpuResourceCache,
    // 			layer = this;
    //
    // 		var canvas = this.createPointTile(points, {
    // 			sector: extended.sector,
    //
    // 			width: this.tileWidth + 2 * extendedWidth,
    // 			height: this.tileHeight + 2 * extendedHeight
    // 		}).canvas();
    //
    // 		var result = document.createElement('canvas');
    // 		result.height = this.tileHeight;
    // 		result.width = this.tileWidth;
    // 		result.getContext('2d').putImageData(
    // 			canvas.getContext('2d').getImageData(extendedWidth, extendedHeight, this.tileWidth, this.tileHeight),
    // 			0, 0
    // 		);
    //
    // 		var texture = layer.createTexture(dc, tile, result);
    // 		layer.removeFromCurrentRetrievals(imagePath);
    //
    // 		if (texture) {
    // 			cache.putResource(imagePath, texture, texture.size);
    //
    // 			layer.currentTilesInvalid = true;
    // 			layer.absentResourceList.unmarkResourceAbsent(imagePath);
    //
    // 			if (!suppressRedraw) {
    // 				// Send an event to request a redraw.
    // 				const e = document.createEvent('Event');
    // 				e.initEvent(REDRAW_EVENT_TYPE, true, true);
    // 				window.dispatchEvent(e);
    // 			}
    // 		}
    // 	}
    // }

  }, {
    key: "filterGeographically",
    value: function filterGeographically(sector) {
      var width = sector.maxLongitude - sector.minLongitude;
      var height = sector.maxLatitude - sector.minLatitude;
      return this.quadTree.query(new Box(sector.minLongitude + 180, sector.minLatitude + 90, width, height));
    }
  }, {
    key: "calculateExtendedSector",
    value: function calculateExtendedSector(sector, extensionFactorWidth, extensionFactorHeight) {
      var latitudeChange = (sector.maxLatitude - sector.minLatitude) * extensionFactorHeight;
      var longitudeChange = (sector.maxLongitude - sector.minLongitude) * extensionFactorWidth;
      return {
        sector: new Sector$1(sector.minLatitude - latitudeChange, sector.maxLatitude + latitudeChange, sector.minLongitude - longitudeChange, sector.maxLongitude + longitudeChange),
        extensionFactorHeight: extensionFactorHeight,
        extensionFactorWidth: extensionFactorWidth
      };
    }
  }, {
    key: "createPointTile",
    value: function createPointTile(data, options) {
      return new LargeDataLayerTile(data, options, this.pantherProps.style, this.pantherProps.fidColumnName, this.pantherProps.selected, this.pantherProps.hovered);
    }
  }, {
    key: "updateHoveredKeys",
    value: function updateHoveredKeys(hoveredKeys, x, y) {
      var _this6 = this;

      this.pantherProps.hovered.keys = hoveredKeys;
      var terrainObject = this.wwd.pickTerrain(this.wwd.canvasCoordinates(x, y)).terrainObject();

      if (terrainObject) {
        var lat = terrainObject.position.latitude;
        var lon = terrainObject.position.longitude;

        _each2(this.currentTiles, function (tile) {
          var s = tile.sector;
          var prev = _this6.previousHoveredCoordinates;
          var latDiff = Math.abs(s.maxLatitude - s.minLatitude);
          var lonDiff = Math.abs(s.maxLongitude - s.minLongitude);
          var latBuffer = latDiff / 10;
          var lonBuffer = lonDiff / 10;
          var hovered = lat <= s.maxLatitude + latBuffer && lat >= s.minLatitude - latBuffer && lon <= s.maxLongitude + lonBuffer && lon >= s.minLongitude - lonBuffer;
          var previouslyHovered = prev && prev.lat <= s.maxLatitude + latBuffer && prev.lat >= s.minLatitude - latBuffer && prev.lon <= s.maxLongitude + lonBuffer && prev.lon >= s.minLongitude - lonBuffer;

          if (hovered || previouslyHovered) {
            _this6.retrieveTileImage(_this6.wwd.drawContext, tile, true);
          }
        });

        this.previousHoveredCoordinates = {
          lat: lat,
          lon: lon
        };
      }
    }
    /**
     * naive point hover buffer determination
     * @param wwd
     * @return {number} buffer in degrees
     */

  }, {
    key: "getPointHoverBuffer",
    value: function getPointHoverBuffer(wwd) {
      var canvasWidth = wwd.canvas.clientWidth;
      var range = wwd.navigator.range;
      var bufferInMeters = range / canvasWidth * this.pantherProps.pointHoverBuffer;
      return bufferInMeters * 0.00001;
    }
  }]);

  return LargeDataLayer;
}(TiledImageLayer);

function getLayerByType(layerDefinition, wwd, onHover, onClick, pointAsMarker) {
  if (layerDefinition.type) {
    switch (layerDefinition.type) {
      case 'worldwind':
        switch (layerDefinition.options.layer) {
          case 'bingAerial':
            return new WorldWind.BingAerialLayer(null);

          case 'bluemarble':
            return new WorldWind.BMNGLayer();

          case 'wikimedia':
            return new WikimediaLayer({
              attribution: "Wikimedia maps - Map data \xA9 OpenStreetMap contributors",
              sourceObject: {
                host: 'maps.wikimedia.org',
                path: 'osm-intl',
                protocol: 'https'
              }
            });

          default:
            return null;
        }

      case 'wmts':
        return new WmtsLayer(layerDefinition);

      case 'wms':
        return new WmsLayer(layerDefinition);

      case 'vector':
        return getVectorLayer(layerDefinition, wwd, onHover, onClick, pointAsMarker);

      default:
        return null;
    }
  } else {
    return null;
  }
}

function getVectorLayer(layerDefinition, wwd, onHover, onClick, pointAsMarker) {
  var url = layerDefinition.options && layerDefinition.options.url;
  layerDefinition.options && layerDefinition.options.features && layerDefinition.options.features.length;
  var key = layerDefinition.key || 'Vector layer';
  var layerKey = layerDefinition.layerKey || key;

  var options = _objectSpread2(_objectSpread2({}, layerDefinition.options), {}, {
    key: key,
    layerKey: layerKey,
    onHover: onHover,
    onClick: onClick
  }); // TODO better deciding


  if (url || pointAsMarker) {
    options.pointHoverBuffer = mapStyle.DEFAULT_SIZE; // in px TODO pass pointHoverBuffer

    return new LargeDataLayer(wwd, options, layerDefinition);
  } else {
    return new VectorLayer$1(layerDefinition, options);
  }
}

function updateVectorLayer(layerDefinition, wwd, onHover, onClick) {
  var mapLayer = null;
  var layerKey = layerDefinition.layerKey;

  var worldWindLayer = _find2(wwd.layers, function (lay) {
    return lay.pantherProps && lay.pantherProps.layerKey && lay.pantherProps.layerKey === layerKey;
  });

  if (!worldWindLayer) {
    mapLayer = getLayerByType(layerDefinition, wwd, onHover, onClick);
  } else {
    var prevFeatures = worldWindLayer.pantherProps.features;
    var nextFeatures = layerDefinition.options.features;

    if (prevFeatures === nextFeatures) {
      mapLayer = worldWindLayer; // TODO still needed?
      // let prevHoveredKeys = worldWindLayer.pantherProps.hovered && worldWindLayer.pantherProps.hovered.keys;
      // let nextHoveredKeys = layerDefinition.options.hovered && layerDefinition.options.hovered.keys;
      // if (prevHoveredKeys !== nextHoveredKeys) {
      // 	worldWindLayer.updateHoveredKeys(nextHoveredKeys);
      // }
    } else {
      worldWindLayer.removeListeners();
      mapLayer = getLayerByType(layerDefinition, wwd, onHover, onClick);
    }
  }

  return mapLayer;
}

var layersHelpers = {
  getLayerByType: getLayerByType,
  updateVectorLayer: updateVectorLayer
};

function getChangedViewParams(prev, next) {
  var changed = {}; // check for boxRange change, disregard if change is too small

  if (prev.boxRange !== next.boxRange && Math.abs(prev.boxRange - next.boxRange) > 1) {
    changed.boxRange = next.boxRange;
  }

  if (prev.heading !== next.heading) {
    changed.heading = next.heading;
  }

  if (prev.tilt !== next.tilt) {
    changed.tilt = next.tilt;
  }

  if (prev.roll !== next.roll) {
    changed.roll = next.roll;
  }

  if (prev.center.lat !== next.center.lat || prev.center.lon !== next.center.lon) {
    changed.center = {
      lat: next.center.lat,
      lon: next.center.lon
    };
  }

  return changed;
}
/**
 * Update navigator of given World Window
 * @param wwd {WorldWindow}
 * @param view {Object}
 */


function update$1(wwd, view, width, height) {
  var state = wwd.navigator;
  var wwdUpdate = getWorldWindNavigatorFromViewParams(view, width, height);
  var shouldRedraw = false;

  if (wwdUpdate.range && state.range !== wwdUpdate.range) {
    state.range = wwdUpdate.range;
    shouldRedraw = true;
  }

  if ((wwdUpdate.tilt || wwdUpdate.tilt === 0) && state.tilt !== wwdUpdate.tilt) {
    state.tilt = wwdUpdate.tilt;
    shouldRedraw = true;
  }

  if ((wwdUpdate.roll || wwdUpdate.roll === 0) && state.roll !== wwdUpdate.roll) {
    state.roll = wwdUpdate.roll;
    shouldRedraw = true;
  }

  if ((wwdUpdate.heading || wwdUpdate.heading === 0) && state.heading !== wwdUpdate.heading) {
    state.heading = wwdUpdate.heading;
    shouldRedraw = true;
  }

  if (wwdUpdate.lookAtLocation && (wwdUpdate.lookAtLocation.latitude || wwdUpdate.lookAtLocation.latitude === 0) && state.lookAtLocation.latitude !== wwdUpdate.lookAtLocation.latitude) {
    state.lookAtLocation.latitude = wwdUpdate.lookAtLocation.latitude;
    shouldRedraw = true;
  }

  if (wwdUpdate.lookAtLocation && (wwdUpdate.lookAtLocation.longitude || wwdUpdate.lookAtLocation.longitude === 0) && state.lookAtLocation.longitude !== wwdUpdate.lookAtLocation.longitude) {
    state.lookAtLocation.longitude = wwdUpdate.lookAtLocation.longitude;
    shouldRedraw = true;
  } // if (wwd.verticalExaggeration && wwdUpdate.elevation && wwd.verticalExaggeration !== wwdUpdate.elevation){
  // 	wwd.verticalExaggeration = wwdUpdate.elevation;
  // 	shouldRedraw = true;
  // }


  if (shouldRedraw) {
    wwd.redraw();
  }
}
/**
 * Convert view to World Wind Navigator params
 * @param view {Object}
 * @returns {WorldWind.Navigator}
 */


function getWorldWindNavigatorFromViewParams(view$1, width, height) {
  var center = view$1.center,
      boxRange = view$1.boxRange,
      navigator = _objectWithoutProperties(view$1, ["center", "boxRange"]);

  if (boxRange) {
    navigator.range = view.getWorldWindRangeFromBoxRange(boxRange, width, height);
  }

  if (center) {
    navigator.lookAtLocation = {};

    if (center.lat || center.lat === 0) {
      navigator.lookAtLocation.latitude = center.lat;
    }

    if (center.lon || center.lon === 0) {
      navigator.lookAtLocation.longitude = center.lon;
    }
  }

  return navigator;
}

function getViewParamsFromWorldWindNavigator(navigator, width, height) {
  var view$1 = {};
  var lookAtLocation = navigator.lookAtLocation,
      range = navigator.range;

  if (range) {
    view$1.boxRange = view.getBoxRangeFromWorldWindRange(range, width, height);
  }

  if (lookAtLocation) {
    view$1.center = {};

    if (lookAtLocation.latitude) {
      view$1.center.lat = lookAtLocation.latitude;
    }

    if (lookAtLocation.longitude) {
      view$1.center.lon = lookAtLocation.longitude;
    }
  }

  if (navigator.heading || navigator.heading === 0) {
    view$1.heading = navigator.heading;
  }

  if (navigator.tilt || navigator.tilt === 0) {
    view$1.tilt = navigator.tilt;
  }

  if (navigator.roll || navigator.roll === 0) {
    view$1.roll = navigator.roll;
  }

  return view$1;
}

var navigator = {
  getChangedViewParams: getChangedViewParams,
  getViewParamsFromWorldWindNavigator: getViewParamsFromWorldWindNavigator,
  update: update$1
};

var HoverContext$1 = Context.getContext('HoverContext');
var WorldWindow = WorldWind.WorldWindow,
    ElevationModel = WorldWind.ElevationModel;

var WorldWindMap = /*#__PURE__*/function (_React$PureComponent) {
  _inherits(WorldWindMap, _React$PureComponent);

  var _super = _createSuper(WorldWindMap);

  function WorldWindMap(props) {
    var _this;

    _classCallCheck(this, WorldWindMap);

    _this = _super.call(this, props);
    _this.canvasId = utils.uuid();
    _this.state = {
      width: null,
      height: null
    };
    _this.onClick = _this.onClick.bind(_assertThisInitialized(_this));
    _this.onLayerHover = _this.onLayerHover.bind(_assertThisInitialized(_this));
    _this.onWorldWindHover = _this.onWorldWindHover.bind(_assertThisInitialized(_this));
    _this.onLayerClick = _this.onLayerClick.bind(_assertThisInitialized(_this));
    _this.onMouseOut = _this.onMouseOut.bind(_assertThisInitialized(_this));
    _this.onResize = _this.onResize.bind(_assertThisInitialized(_this));
    _this.onZoomLevelsBased = _this.onZoomLevelsBased.bind(_assertThisInitialized(_this));
    _this.onZoomLevelsBasedTimeout = null;
    _this.onZoomLevelsBasedStep = 0;
    return _this;
  }

  _createClass(WorldWindMap, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      this.wwd = new WorldWindow(this.canvasId, this.getElevationModel());
      decorateWorldWindowController(this.wwd.worldWindowController, this.props.viewLimits, this.props.levelsBased);
      this.wwd.worldWindowController.onNavigatorChanged = this.onNavigatorChange.bind(this);

      if (this.props.levelsBased) {
        // rewrite default wheel listener.
        this.wwd.eventListeners.wheel.listeners = [this.onZoomLevelsBased.bind(this)];
      }

      new CyclicPickController(this.wwd, ['mousemove', 'mousedown', 'mouseup', 'mouseout', 'touchstart', 'touchmove', 'touchend'], this.onWorldWindHover, true);
      this.updateNavigator(mapConstants.defaultMapView);
      this.updateLayers();
    }
  }, {
    key: "onZoomLevelsBased",
    value: function onZoomLevelsBased(e) {
      var _this2 = this;

      e.preventDefault();

      if (e.wheelDelta) {
        this.onZoomLevelsBasedStep += e.wheelDelta;

        if (this.onZoomLevelsBasedTimeout) {
          clearTimeout(this.onZoomLevelsBasedTimeout);
        }

        this.onZoomLevelsBasedTimeout = setTimeout(function () {
          var zoomLevel = map.view.getZoomLevelFromBoxRange(_this2.props.view.boxRange, _this2.state.width, _this2.state.height);

          if (_this2.onZoomLevelsBasedStep > 300) {
            zoomLevel += 3;
          } else if (_this2.onZoomLevelsBasedStep > 150) {
            zoomLevel += 2;
          } else if (_this2.onZoomLevelsBasedStep > 0) {
            zoomLevel++;
          } else if (_this2.onZoomLevelsBasedStep < -300) {
            zoomLevel -= 3;
          } else if (_this2.onZoomLevelsBasedStep < -150) {
            zoomLevel -= 2;
          } else {
            zoomLevel--;
          }

          var levelsRange = mapConstants.defaultLevelsRange;
          var boxRangeRange = _this2.props.viewLimits && _this2.props.viewLimits.boxRangeRange;
          var maxLevel = boxRangeRange && boxRangeRange[0] ? map.view.getZoomLevelFromBoxRange(boxRangeRange[0], _this2.state.width, _this2.state.height) : levelsRange[1];
          var minLevel = boxRangeRange && boxRangeRange[1] ? map.view.getZoomLevelFromBoxRange(boxRangeRange[1], _this2.state.width, _this2.state.height) : levelsRange[0];
          levelsRange = [minLevel, maxLevel];
          var finalZoomLevel = zoomLevel;

          if (finalZoomLevel > levelsRange[1]) {
            finalZoomLevel = levelsRange[1];
          } else if (finalZoomLevel < levelsRange[0]) {
            finalZoomLevel = levelsRange[0];
          }

          var boxRange = map.view.getBoxRangeFromZoomLevel(finalZoomLevel, _this2.state.width, _this2.state.height);

          if (_this2.props.onViewChange) {
            _this2.props.onViewChange({
              boxRange: boxRange
            });
          }

          _this2.onZoomLevelsBasedTimeout = null;
          _this2.onZoomLevelsBasedStep = 0;
        }, 50);
      }
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate(prevProps) {
      if (prevProps) {
        if (this.props.view && prevProps.view !== this.props.view) {
          this.updateNavigator();
        }

        if (prevProps.layers !== this.props.layers || prevProps.backgroundLayer !== this.props.backgroundLayer) {
          this.updateLayers();
        }

        if (this.context && this.context.hoveredItems) {
          var currentHoveredItemsString = JSON.stringify(_sortBy2(this.context.hoveredItems));

          if (currentHoveredItemsString !== this.previousHoveredItemsString) {
            this.updateHoveredFeatures();
          }
        }
      }
    }
  }, {
    key: "updateLayers",
    value: function updateLayers() {
      var _this3 = this;

      var layers = [];

      if (this.props.backgroundLayer) {
        // TODO fix for compatibility
        var backgroundLayers = _isArray2(this.props.backgroundLayer) ? this.props.backgroundLayer : [this.props.backgroundLayer];
        backgroundLayers.forEach(function (layer) {
          layers.push(layersHelpers.getLayerByType(layer, _this3.wwd));
        });
      }

      if (this.props.layers) {
        this.props.layers.forEach(function (layer) {
          var mapLayer = layersHelpers.getLayerByType(layer, _this3.wwd, _this3.onLayerHover, _this3.onLayerClick, _this3.props.pointAsMarker);
          layers.push(mapLayer);
        });
      }

      this.invalidateLayers(this.wwd.layers);
      this.wwd.layers = layers;
      this.wwd.redraw();
    }
  }, {
    key: "invalidateLayers",
    value: function invalidateLayers(previousLayers) {
      previousLayers.forEach(function (prevLayer) {
        if (prevLayer instanceof LargeDataLayer) {
          prevLayer.removeListeners();
        }
      });
    }
  }, {
    key: "updateHoveredFeatures",
    value: function updateHoveredFeatures() {
      var _this4 = this;

      this.wwd.layers.forEach(function (layer) {
        if (layer instanceof LargeDataLayer) {
          layer.updateHoveredKeys(_this4.context.hoveredItems, _this4.context.x, _this4.context.y);
        } else if (layer instanceof VectorLayer$1) {
          layer.updateHoveredFeatures(_this4.context.hoveredItems);
        }
      });
      this.wwd.redraw();
      this.previousHoveredItemsString = JSON.stringify(_sortBy2(this.context.hoveredItems));
    }
  }, {
    key: "updateNavigator",
    value: function updateNavigator(defaultView) {
      var viewport = this.wwd.viewport;
      var width = this.state.width || viewport.width;
      var height = this.state.height || viewport.height;
      var currentView = defaultView || navigator.getViewParamsFromWorldWindNavigator(this.wwd.navigator, width, height);

      var nextView = _objectSpread2(_objectSpread2({}, currentView), this.props.view);

      navigator.update(this.wwd, nextView, width, height);
    }
    /**
     * @returns {null | elevation}
     */

  }, {
    key: "getElevationModel",
    value: function getElevationModel() {
      switch (this.props.elevationModel) {
        case 'default':
          return null;

        case null:
          var elevation = new ElevationModel();
          elevation.removeAllCoverages();
          return elevation;
      }
    }
  }, {
    key: "onNavigatorChange",
    value: function onNavigatorChange(event) {
      var _this5 = this;

      if (event) {
        var viewParams = navigator.getViewParamsFromWorldWindNavigator(event, this.state.width, this.state.height);
        var changedViewParams = navigator.getChangedViewParams(_objectSpread2(_objectSpread2({}, mapConstants.defaultMapView), this.props.view), viewParams);

        if (this.props.onViewChange) {
          if (!_isEmpty2(changedViewParams)) {
            if (this.props.delayedWorldWindNavigatorSync) {
              if (this.changedNavigatorTimeout) {
                clearTimeout(this.changedNavigatorTimeout);
              }

              this.changedNavigatorTimeout = setTimeout(function () {
                _this5.props.onViewChange(changedViewParams);
              }, this.props.delayedWorldWindNavigatorSync);
            } else {
              this.props.onViewChange(changedViewParams);
            }
          }
        }
      }
    }
  }, {
    key: "onClick",
    value: function onClick() {
      if (this.props.onClick) {
        var _this$wwd$viewport = this.wwd.viewport,
            width = _this$wwd$viewport.width,
            height = _this$wwd$viewport.height;
        var currentView = navigator.getViewParamsFromWorldWindNavigator(this.wwd.navigator, width, height);
        this.props.onClick(currentView);
      }
    }
  }, {
    key: "onMouseOut",
    value: function onMouseOut() {
      if (this.context && this.context.onHoverOut) {
        this.context.onHoverOut();
      }
    }
  }, {
    key: "onLayerHover",
    value: function onLayerHover(layerKey, featureKeys, x, y, popupContent, data, fidColumnName) {
      // pass data to popup
      if (this.context && this.context.onHover && featureKeys.length) {
        this.context.onHover(featureKeys, {
          popup: {
            x: x,
            y: y,
            content: popupContent,
            data: data,
            fidColumnName: fidColumnName
          }
        });
      }
    }
  }, {
    key: "onLayerClick",
    value: function onLayerClick(layerKey, featureKeys) {
      if (this.props.onLayerClick) {
        this.props.onLayerClick(this.props.mapKey, layerKey, featureKeys);
      }
    }
  }, {
    key: "onWorldWindHover",
    value: function onWorldWindHover(renderables, event) {
      // TODO can be hovered more than one renderable at one time?
      if (renderables.length && renderables.length === 1) {
        // TODO is this enough?
        var layerPantherProps = renderables[0].parentLayer.pantherProps;
        var data = renderables[0].userObject.userProperties;
        var featureKeys = [data[layerPantherProps.fidColumnName]]; // TODO add support for touch events

        if (event.type === 'mousedown' && layerPantherProps.selectable) {
          this.onLayerClick(layerPantherProps.layerKey, featureKeys);
        } else if (layerPantherProps.hoverable) {
          this.onLayerHover(layerPantherProps.layerKey, featureKeys, event.pageX, event.pageY, /*#__PURE__*/React$1.createElement("div", null, featureKeys.join(',')), data, layerPantherProps.fidColumnName);
        }
      } else if (this.context && this.context.onHoverOut) {
        this.context.onHoverOut();
      }
    }
  }, {
    key: "onResize",
    value: function onResize(width, height) {
      height = viewport.roundDimension(height);
      width = viewport.roundDimension(width);
      this.setState({
        width: width,
        height: height
      });
      this.updateNavigator();

      if (this.props.onResize) {
        this.props.onResize(width, height);
      }
    }
  }, {
    key: "render",
    value: function render() {
      return /*#__PURE__*/React$1.createElement(React$1.Fragment, null, /*#__PURE__*/React$1.createElement(ReactResizeDetector, {
        handleHeight: true,
        handleWidth: true,
        onResize: this.onResize
      }), /*#__PURE__*/React$1.createElement("div", {
        className: "ptr-map ptr-world-wind-map",
        onClick: this.onClick,
        onMouseOut: this.onMouseOut
      }, /*#__PURE__*/React$1.createElement("canvas", {
        className: "ptr-world-wind-map-canvas",
        id: this.canvasId
      }, "Your browser does not support HTML5 Canvas.")));
    }
  }]);

  return WorldWindMap;
}(React$1.PureComponent);

WorldWindMap.contextType = HoverContext$1;
WorldWindMap.defaultProps = {
  elevationModel: null
};
WorldWindMap.propTypes = {
  backgroundLayer: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  layers: PropTypes.array,
  name: PropTypes.string,
  view: PropTypes.object,
  viewLimits: PropTypes.object,
  onClick: PropTypes.func,
  onLayerClick: PropTypes.func,
  onViewChange: PropTypes.func,
  elevationModel: PropTypes.string
};

var PresentationEmpty = (function () {
  return /*#__PURE__*/React.createElement("p", null, "render only on server");
});

var presentationEmpty = /*#__PURE__*/Object.freeze({
  __proto__: null,
  'default': PresentationEmpty
});

var LoadableMapControls = Loadable({
  loader: function loader() {
    return isServer ? Promise.resolve().then(function () { return presentationEmpty; }) : Promise.resolve().then(function () { return index; });
  },
  render: function render(loaded, props) {
    var MapControls = loaded["default"];
    return /*#__PURE__*/React$1.createElement(MapControls, props);
  },
  loading: function loading(props) {
    if (props.error) {
      return /*#__PURE__*/React$1.createElement("div", null, "Error!");
    } else {
      return /*#__PURE__*/React$1.createElement("div", null, "Loading...");
    }
  }
});

var isomorphicLoadableMapControls = function isomorphicLoadableMapControls(props) {
  return isServer ? /*#__PURE__*/React$1.createElement(PresentationEmpty, null) : /*#__PURE__*/React$1.createElement(LoadableMapControls, props);
};

var PresentationEmpty$1 = (function () {
  return null;
});

var presentationEmpty$1 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  'default': PresentationEmpty$1
});

var LoadableMapSet = Loadable({
  loader: function loader() {
    return isServer ? Promise.resolve().then(function () { return presentationEmpty$1; }) : Promise.resolve().then(function () { return index$1; });
  },
  render: function render(loaded, props) {
    var MapSet = loaded["default"];
    return /*#__PURE__*/React$1.createElement(MapSet, props);
  },
  loading: function loading(props) {
    if (props.error) {
      return /*#__PURE__*/React$1.createElement("span", null, "Error!");
    } else {
      return /*#__PURE__*/React$1.createElement("span", null, "Loading...");
    }
  }
});

var isomorphicMapSet = function isomorphicMapSet(props) {
  return isServer ? /*#__PURE__*/React$1.createElement(PresentationEmpty$1, null) : /*#__PURE__*/React$1.createElement(LoadableMapSet, props);
};

var LoadableReactLeafletMap = Loadable({
  loader: function loader() {
    return isServer ? Promise.resolve().then(function () { return presentationEmpty$1; }) : Promise.resolve().then(function () { return index$2; });
  },
  render: function render(loaded, props) {
    var ReactLeafletMap = loaded["default"];
    return /*#__PURE__*/React$1.createElement(ReactLeafletMap, props);
  },
  loading: function loading(props) {
    if (props.error) {
      return /*#__PURE__*/React$1.createElement("div", null, "Error!");
    } else {
      return /*#__PURE__*/React$1.createElement("div", null, "Loading...");
    }
  }
});

var isomorphicLoadableReactLeafletMap = function isomorphicLoadableReactLeafletMap(props) {
  return isServer ? /*#__PURE__*/React$1.createElement(PresentationEmpty$1, null) : /*#__PURE__*/React$1.createElement(LoadableReactLeafletMap, props);
};

var LoadableMap = Loadable({
  loader: function loader() {
    return isServer ? Promise.resolve().then(function () { return presentationEmpty$1; }) : Promise.resolve().then(function () { return _Map; });
  },
  render: function render(loaded, props) {
    var PresentationMap = loaded["default"];
    return /*#__PURE__*/React$1.createElement(PresentationMap, props);
  },
  loading: function loading(props) {
    if (props.error) {
      return /*#__PURE__*/React$1.createElement("span", null, "Error!");
    } else {
      return /*#__PURE__*/React$1.createElement("span", null, "Loading...");
    }
  }
});

var isomorphicMap = function isomorphicMap(props) {
  return isServer ? /*#__PURE__*/React$1.createElement(PresentationEmpty$1, null) : /*#__PURE__*/React$1.createElement(LoadableMap, props);
};

var index$3 = {
  constants: constants,
  view: view,
  GoToPlace: GoToPlace,
  LoadableMapControls: isomorphicLoadableMapControls,
  LoadableMapSet: isomorphicMapSet,
  LoadableReactLeafletMap: isomorphicLoadableReactLeafletMap,
  LoadableMap: isomorphicMap,
  MapControls: MapControls,
  MapGrid: MapGrid,
  MapSetMap: MapSetMap,
  MapSetPresentationMap: MapSetPresentationMap,
  MapSet: MapSet,
  MapWrapper: MapWrapper,
  MapTools: MapTools,
  PresentationMap: PresentationMap$1,
  SimpleLayersControl: SimpleLayersControl,
  ReactLeafletMap: ReactLeafletMap,
  WorldWindMap: WorldWindMap
};

export default index$3;
export { GoToPlace, isomorphicMap as LoadableMap, isomorphicLoadableMapControls as LoadableMapControls, isomorphicMapSet as LoadableMapSet, isomorphicLoadableReactLeafletMap as LoadableReactLeafletMap, MapControls, MapGrid, MapSet, MapSetMap, MapSetPresentationMap, MapTools, MapWrapper, PresentationMap$1 as PresentationMap, ReactLeafletMap, SimpleLayersControl, WorldWindMap, constants, view };
//# sourceMappingURL=index.es.js.map
