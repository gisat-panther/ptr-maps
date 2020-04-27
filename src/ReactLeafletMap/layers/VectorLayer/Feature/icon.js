import L from "leaflet";
import {mapStyle} from "@gisatcz/ptr-utils";

/**
 * @param style {Object} Leaflet style definition
 * @return {L.divIcon}
 */
function get(style, id) {
    let iconStyle;
    switch (style.shape) {
        case 'square':
            iconStyle = getSquareStyle(style);
            break;
        case 'diamond':
            iconStyle = getSquareStyle(style,45);
            break;
        case 'circle':
        default:
            iconStyle = getCircleStyle(style);
    }

    let styleString = '';
    _.forIn(iconStyle, (value, key) => {
        styleString += key + ': ' + value + '; '
    });

    return new L.divIcon({
        iconAnchor: [style.radius, style.radius],
        className: "ptr-leaflet-map-icon",
        html: '<div class="ptr-leaflet-map-icon" id="' + id + '" style="' + styleString + '"/>'
    });
}

function getCircleStyle(s) {
    return getSquareStyle(s, null, s.radius);
}

/**
 * @param s {Object} Leaflet style definition
 * @param rotation {number}
 * @param borderRadius {number}
 * @return {Object} Calculated style
 */
function getSquareStyle(s, rotation, borderRadius) {
    let style = {};
    if (s.radius) {
        style.width = s.radius * 2 + 'px';
        style.height = s.radius * 2 + 'px';
    }

    if (s.fillColor) {
        if (s.fillOpacity && s.fillOpacity !== 1) {
            const rgb = mapStyle.hexToRgb(s.fillColor);
            style['background-color'] = `rgba(${rgb.r},${rgb.g},${rgb.b},${s.fillOpacity})`;
        } else {
            style['background-color'] = s.fillColor;
        }
    }

    if (s.color) {
        if (s.opacity && s.opacity !== 1) {
            const rgb = mapStyle.hexToRgb(s.color);
            style['border-color'] = `rgba(${rgb.r},${rgb.g},${rgb.b},${s.opacity})`;
        } else {
            style['border-color'] = s.color;
        }
    }

    if (s.weight) {
        style['border-style'] = 'solid';
        style['border-width'] = s.weight + 'px';
    }

    if (borderRadius) {
        style['border-radius'] = borderRadius + 'px';
    }

    if (rotation) {
        style.transform = 'rotate(' + rotation + 'deg)';
    }

    return style;
}

export default {
    get
};