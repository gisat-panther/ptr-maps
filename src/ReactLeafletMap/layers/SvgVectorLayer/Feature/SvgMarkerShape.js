import L from "leaflet";
import _ from "lodash";
import {mapStyle} from "@gisatcz/ptr-utils";
import {Icon} from "@gisatcz/ptr-atoms";
import ReactDOMServer from "react-dom/server";
import React from "react";

/**
 * Extended Leaflet's DivIcon class. It enables to draw basic geometric shapes as icons.
 * @augments L.DivIcon
 * @param id {string} uuid
 * @param style {Object} Extended Leaflet style definition
 * @param options {Object}
 */
class SvgMarkerShape extends L.DivIcon {
	constructor(id, style, options) {
		super(options);

		this.id = id;
		this.style = style;

		this.shape = options.shape;
		this.icon = options.icon;

		this.iconAnchor = options.iconAnchor;
		this.onMouseMove = options.onMouseMove;
		this.onMouseOver = options.onMouseOver;
		this.onMouseOut = options.onMouseOut;
		this.onClick = options.onClick;
	}

	/**
	 * Overwrite ancestor's method
	 * @param oldShape
	 * @return {HTMLDivElement}
	 */
	createIcon(oldShape) {
		let div;
		if (oldShape && oldShape.tagName === 'DIV') {
			div = oldShape;
		} else {
			div = document.createElement('div');
			div.id = this.id;
			if (this.onMouseMove) {
				div.addEventListener("mousemove", this.onMouseMove);
			}
			if (this.onMouseOver) {
				div.addEventListener("mouseover", this.onMouseOver);
			}
			if (this.onMouseOut) {
				div.addEventListener("mouseout", this.onMouseOut);
			}
			if (this.onClick) {
				div.addEventListener("click", this.onClick);
			}
		}

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
		let shape = null;
		const style = this.getStyle(this.style);

		if (this.shape) {
			const props = this.shape.componentProps ? {...this.shape.componentProps, style} : {style};
			shape = React.createElement(this.shape.component, props);
		} else {
			const iconStyle = {
				...style,
				fill: style.iconFill ? style.iconFill : style.fill
			}

			const props = this.icon.componentProps ? {...this.icon.componentProps, style: iconStyle} : {style: iconStyle};
			shape = React.createElement(this.icon.component, props);
		}

		return ReactDOMServer.renderToString(shape);
	}

	/**
	 * Prepare element style by shape
	 * @param leafletStyle {Object} Leaflet style definition
	 * @return {Object} calculated style object
	 */
	getStyle(leafletStyle) {
		let style = {};
		if (leafletStyle.radius) {
			style.width = leafletStyle.radius * 2 + 'px';
			style.height = leafletStyle.radius * 2 + 'px';
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
	}

	/**
	 * Set style of element
	 * @param style {Object} Leaflet style definition
	 */
	setStyle(style) {
		let shapeStyle = this.getStyle(style);
		let element = document.getElementById(this.id);
		let shape = element?.children?.[0];

		if (shape) {
			_.forIn(shapeStyle, (value, key) => {
				shape.style[key] = value;
			});
		}
	}
}

export default SvgMarkerShape;