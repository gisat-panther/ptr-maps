import L from "leaflet";
import _ from "lodash";
import ReactDOMServer from "react-dom/server";
import React from "react";
import {mapStyle} from "@gisatcz/ptr-utils";

/**
 * It enables to draw various shapes as marker icon.
 * @augments L.DivIcon
 * @param props {object}
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
class MarkerShape extends L.DivIcon {
	constructor(props) {
		super(props);

		// Needed by L.DivIcon
		this.iconAnchor = props.iconAnchor;

		this.basicShape = props.basicShape;
		this.id = props.id;
		this.style = props.style;
		this.shape = props.shape;
		this.icon = props.icon;

		this.onMouseMove = props.onMouseMove;
		this.onMouseOver = props.onMouseOver;
		this.onMouseOut = props.onMouseOut;
		this.onClick = props.onClick;
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

		const html = this.getShapeHtml();
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
	getShapeHtml() {
		// Basic shape -> no need for svg
		if (this.basicShape) {
			const style = this.getCssStyle(this.style);
			return ReactDOMServer.renderToString(<div style={style}/>);
		}

		else {
			let finalShape;
			const style = this.getSvgStyle(this.style);

			// Combined shape and icon
			// Currently only shape="pin" is suitable for combination
			if (this.shape && this.icon) {
				finalShape = this.getShapeWithIcon(style);
			}

			// Just shape
			else if (this.shape) {
				finalShape = this.getShape(style);
			}

			// No shape, but icon? Use icon as shape
			else if (this.icon) {
				finalShape = this.getIcon(style);
			}

			return ReactDOMServer.renderToString(finalShape);
		}
	}

	/**
	 * @param style {Object} style object suitable for SVG
	 * @return {React.DetailedReactHTMLElement<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>}
	 */
	getShape(style) {
		const props = this.shape.componentProps ? {...this.shape.componentProps, style} : {style};
		return React.createElement(this.shape.component, props);
	}

	/**
	 * @param style {Object} style object suitable for SVG
	 * @return {React.DetailedReactHTMLElement<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>}
	 */
	getIcon(style) {
		const iconStyle = {
			...style,
			fill: style.iconFill ? style.iconFill : style.fill
		}

		const props = this.icon.componentProps ? {...this.icon.componentProps, style: iconStyle} : {style: iconStyle};
		return React.createElement(this.icon.component, props);
	}

	/**
	 * @param style {Object} style object suitable for SVG
	 * @return {React.DetailedReactHTMLElement<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>}
	 */
	getShapeWithIcon(style) {
		let iconStyle = {strokeWidth: 0}; // TODO think about icons styling inside shape
		const {iconFill, ...shapeStyle} = style;

		if (iconFill) {
			iconStyle.fill = iconFill;
		}

		const iconProps = this.icon.componentProps ? {...this.icon.componentProps, style: iconStyle} : {style: iconStyle};
		const iconComponent = React.createElement(this.icon.component, iconProps);

		const props = this.shape.componentProps ? {...this.shape.componentProps, style: shapeStyle} : {style: shapeStyle};
		return React.createElement(this.shape.component, {...props, icon: iconComponent, outlineWidth: this.style.weight});
	}

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
	getSvgStyle(leafletStyle) {
		let style = {};
		if (leafletStyle.radius) {
			const size = leafletStyle.radius * 2 + (leafletStyle.weight || 0);
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
	}

	/**
	 * Prepare element style by shape
	 * @param leafletStyle {Object} Leaflet style definition
	 * @return {Object} calculated style object
	 */
	getCssStyle(leafletStyle) {
		switch (leafletStyle.shape) {
			case 'square':
				return this.getSquareStyle(leafletStyle);
			case 'diamond':
				return this.getSquareStyle(leafletStyle,45);
			case 'circle':
			default:
				return this.getCircleStyle(leafletStyle);
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
				style['backgroundColor'] = `rgba(${rgb.r},${rgb.g},${rgb.b},${leafletStyle.fillOpacity})`;
			} else {
				style['backgroundColor'] = leafletStyle.fillColor;
			}
		}

		if (leafletStyle.color) {
			if (leafletStyle.opacity && leafletStyle.opacity !== 1) {
				const rgb = mapStyle.hexToRgb(leafletStyle.color);
				style['borderColor'] = `rgba(${rgb.r},${rgb.g},${rgb.b},${leafletStyle.opacity})`;
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
	}

	/**
	 * Set style of element
	 * @param style {Object} Leaflet style definition
	 */
	setStyle(style) {
		let shapeStyle = this.basicShape ? this.getCssStyle(style) : this.getSvgStyle(style);
		let element = document.getElementById(this.id);
		let shape = element?.children?.[0];

		if (shape) {
			_.forIn(shapeStyle, (value, key) => {
				shape.style[key] = value;
			});
		}
	}
}

export default MarkerShape;