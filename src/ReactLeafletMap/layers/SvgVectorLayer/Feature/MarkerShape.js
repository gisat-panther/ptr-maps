import L from 'leaflet';
import {forIn as _forIn} from 'lodash';
import ReactDOMServer from 'react-dom/server';
import React from 'react';
import helpers from '../helpers';

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
			const style = helpers.getMarkerShapeCssStyle(this.style);
			return ReactDOMServer.renderToString(<div style={style} />);
		} else {
			let finalShape;
			const style = helpers.getMarkerShapeSvgStyle(this.style);

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
		const props = this.shape.componentProps
			? {...this.shape.componentProps, style}
			: {style};
		return React.createElement(this.shape.component, {
			...props,
			outlineWidth: this.style.weight,
		});
	}

	/**
	 * @param style {Object} style object suitable for SVG
	 * @return {React.DetailedReactHTMLElement<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>}
	 */
	getIcon(style) {
		const iconStyle = {
			...style,
			fill: style.iconFill ? style.iconFill : style.fill,
		};

		const props = this.icon.componentProps
			? {...this.icon.componentProps, style: iconStyle}
			: {style: iconStyle};
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
		} else {
			iconStyle.fill = shapeStyle.stroke;
		}

		const iconProps = this.icon.componentProps
			? {...this.icon.componentProps, style: iconStyle}
			: {style: iconStyle};
		const iconComponent = React.createElement(this.icon.component, iconProps);

		const props = this.shape.componentProps
			? {...this.shape.componentProps, style: shapeStyle}
			: {style: shapeStyle};
		return React.createElement(this.shape.component, {
			...props,
			icon: iconComponent,
			outlineWidth: this.style.weight,
		});
	}

	/**
	 * Set style of element
	 * @param style {Object} Leaflet style definition
	 * @param id {string} id of the shape
	 * @param isBasicShape {bool} If true -> DIV element, if false -> SVG element
	 */
	setStyle(style, id, isBasicShape) {
		id = id || this.id;
		isBasicShape = isBasicShape || this.basicShape;

		let shapeStyle = isBasicShape
			? helpers.getMarkerShapeCssStyle(style)
			: helpers.getMarkerShapeSvgStyle(style);
		let element = document.getElementById(id);
		let shape = element?.children?.[0];

		if (shape) {
			_forIn(shapeStyle, (value, key) => {
				shape.style[key] = value;
			});
		}
	}
}

export default MarkerShape;
