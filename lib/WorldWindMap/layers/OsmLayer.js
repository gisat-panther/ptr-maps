"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _webworldwindEsa = _interopRequireDefault(require("webworldwind-esa"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

var Location = _webworldwindEsa["default"].Location,
    Sector = _webworldwindEsa["default"].Sector,
    MercatorTiledImageLayer = _webworldwindEsa["default"].MercatorTiledImageLayer;
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

var _default = OsmLayer;
exports["default"] = _default;