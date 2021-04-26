"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _OsmLayer2 = _interopRequireDefault(require("./OsmLayer"));

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

var ArgumentError = _webworldwindEsa["default"].ArgumentError,
    Logger = _webworldwindEsa["default"].Logger;

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
}(_OsmLayer2["default"]);

var _default = WikimediaLayer;
exports["default"] = _default;