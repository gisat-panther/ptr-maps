"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = _default;

var _webworldwindEsa = _interopRequireDefault(require("webworldwind-esa"));

var _ptrCore = require("@gisatcz/ptr-core");

var _view = _interopRequireDefault(require("../../../utils/view"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var Angle = _webworldwindEsa["default"].Angle,
    WWMath = _webworldwindEsa["default"].WWMath;
/**
 * @param {WorldWind.WorldWindController} basicController
 * @param {Object} viewLimits
 */

function _default(basicController, viewLimits, levelsBased) {
  //Customized applyLimits function that call onNavigatorChanged on every execution
  var applyLimits = function applyLimits() {
    var navigator = basicController.wwd.navigator;
    var _basicController$wwd$ = basicController.wwd.viewport,
        width = _basicController$wwd$.width,
        height = _basicController$wwd$.height;

    if (!levelsBased) {
      var minBoxRange = viewLimits && viewLimits.boxRangeRange && viewLimits.boxRangeRange[0] || _ptrCore.mapConstants.minBoxRange;
      var maxBoxRange = viewLimits && viewLimits.boxRangeRange && viewLimits.boxRangeRange[1] || _ptrCore.mapConstants.maxBoxRange;

      var currentRange = _view["default"].getBoxRangeFromWorldWindRange(navigator.range, width, height);

      if (currentRange < minBoxRange) {
        navigator.range = _view["default"].getWorldWindRangeFromBoxRange(minBoxRange, width, height);
      } else if (currentRange > maxBoxRange) {
        navigator.range = _view["default"].getWorldWindRangeFromBoxRange(maxBoxRange, width, height);
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