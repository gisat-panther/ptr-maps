import L from "leaflet";
import _ from "lodash";
import {mapStyle} from "@gisatcz/ptr-utils";

/**
 * Extended Leaflet's DivIcon class. It enables to draw basic geometric shapes as icons.
 * @augments L.DivIcon
 * @param id {string} uuid
 * @param style {Object} Extended Leaflet style definition
 * @param options {Object}
 */
class MarkerIcon extends L.DivIcon {
    constructor(id, style, options) {
        super(options);

        this.id = id;
        this.style = style;

        this.iconAnchor = options.iconAnchor;
        this.onMouseMove = options.onMouseMove;
        this.onMouseOver = options.onMouseOver;
        this.onMouseOut = options.onMouseOut;
        this.onClick = options.onClick;
    }

    /**
     * Overwrite ancestor's method
     * @param oldIcon
     * @return {HTMLDivElement}
     */
    createIcon(oldIcon) {
        const div = (oldIcon && oldIcon.tagName === 'DIV') ? oldIcon : document.createElement('div');

        const html = this.getIconHtml();
        if (html instanceof Element) {
            div.appendChild(html);
        } else {
            div.innerHTML = html !== false ? html : '';
        }

        this._setIconStyles(div, 'icon');

        return div;
    }

    /**
     * Prepare html of the icon
     * @return {HTMLDivElement}
     */
    getIconHtml() {
        let iconStyle = this.getStyle(this.style);

        let element = document.createElement('div');
        element.className = "ptr-leaflet-map-icon";
        element.id = this.id;
        _.forIn(iconStyle, (value, key) => {
            element.style[key] = value;
        });

        if (this.onMouseMove) {
            element.addEventListener("mousemove", this.onMouseMove);
        }
        if (this.onMouseOver) {
            element.addEventListener("mouseover", this.onMouseOver);
        }
        if (this.onMouseOut) {
            element.addEventListener("mouseout", this.onMouseOut);
        }
        if (this.onClick) {
            element.addEventListener("click", this.onClick);
        }
        return element;
    }

    /**
     * Prepare element style by shape
     * @param style {Object} Panther style definition
     * @return {Object} calculated style object
     */
    getStyle(style) {
        switch (style.shape) {
            case 'square':
                return this.getSquareStyle(style);
            case 'diamond':
                return this.getSquareStyle(style,45);
            case 'circle':
            default:
                return this.getCircleStyle(style);
        }
    }

    /**
     * @param leafletStyle {Object} Leaflet style definition
     * @return {Object} calculated style object
     */
    getCircleStyle(leafletStyle) {
        return this.getSquareStyle(leafletStyle, null, leafletStyle.radius);
    }

    /**
     * @param leafletStyle {Object} Leaflet style definition
     * @param rotation {number}
     * @param borderRadius {number}
     * @return {Object} calculated style object
     */
    getSquareStyle(leafletStyle, rotation, borderRadius) {
        let style = {};
        if (leafletStyle.radius) {
            style.width = leafletStyle.radius * 2 + 'px';
            style.height = leafletStyle.radius * 2 + 'px';
        }

        if (leafletStyle.fillColor) {
            if (leafletStyle.fillOpacity && leafletStyle.fillOpacity !== 1) {
                const rgb = mapStyle.hexToRgb(leafletStyle.fillColor);
                style['background-color'] = `rgba(${rgb.r},${rgb.g},${rgb.b},${leafletStyle.fillOpacity})`;
            } else {
                style['background-color'] = leafletStyle.fillColor;
            }
        }

        if (leafletStyle.color) {
            if (leafletStyle.opacity && leafletStyle.opacity !== 1) {
                const rgb = mapStyle.hexToRgb(leafletStyle.color);
                style['border-color'] = `rgba(${rgb.r},${rgb.g},${rgb.b},${leafletStyle.opacity})`;
            } else {
                style['border-color'] = leafletStyle.color;
            }
        }

        if (leafletStyle.weight) {
            style['border-style'] = 'solid';
            style['border-width'] = leafletStyle.weight + 'px';
        }

        if (borderRadius) {
            style['border-radius'] = borderRadius + 'px';
        }

        if (rotation) {
            style.transform = 'rotate(' + rotation + 'deg)';
        }

        return style;
    }

    /**
     * Set style of element
     * @param style {Object} Leaflet style definition
     */
    setStyle(style) {
        let iconStyle = this.getStyle(style);
        let element = document.getElementById(this.id);

        if (element) {
            _.forIn(iconStyle, (value, key) => {
                element.style[key] = value;
            });
        }
    }
}

export default MarkerIcon;