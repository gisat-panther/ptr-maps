import React from 'react';
import PropTypes from 'prop-types';
import {Circle, Polygon, Marker, Polyline} from 'react-leaflet';
import {shallowEqualObjects} from 'shallow-equal';
import {utils} from '@gisatcz/ptr-utils';

import ContextWrapper from './ContextWrapper';
import helpers from '../helpers';

class Feature extends React.PureComponent {
	static propTypes = {
		feature: PropTypes.object,
		fid: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
		fidColumnName: PropTypes.string,
		hoverable: PropTypes.bool,
		hoveredFromContext: PropTypes.bool,
		hoveredStyleDefinition: PropTypes.oneOfType([
			PropTypes.string,
			PropTypes.object,
		]),
		selectable: PropTypes.bool,
		selected: PropTypes.bool,
		selectedStyleDefinition: PropTypes.oneOfType([
			PropTypes.string,
			PropTypes.object,
		]),
		selectedHoveredStyleDefinition: PropTypes.oneOfType([
			PropTypes.string,
			PropTypes.object,
		]),
		changeContext: PropTypes.func,
		interactive: PropTypes.bool,
		styleDefinition: PropTypes.object,
	};

	constructor(props) {
		super(props);

		this.onClick = this.onClick.bind(this);
		this.onMouseMove = this.onMouseMove.bind(this);
		this.onMouseOut = this.onMouseOut.bind(this);
		this.onAdd = this.onAdd.bind(this);

		this.fid = props.fid;

		if ((props.type === 'Point' || props.type === 'MultiPoint') && props.pointAsMarker) {
			this.shapeId = this.props.uniqueFeatureKey
				? `${this.props.uniqueFeatureKey}_icon`
				: utils.uuid();
		}

		this.state = {
			hovered: false,
		};

		this.calculateStyles = helpers.calculateStylesMemo;
		this.convertCoordinates = helpers.convertCoordinatesMemo;
	}

	componentDidUpdate(prevProps, prevState, snapshot) {
		if (this.props.hasOwnProperty('hoveredFromContext')) {
			if (this.props.hoveredFromContext && !this.state.hovered) {
				this.showOnTop();
				this.setState({hovered: true});
			} else if (!this.props.hoveredFromContext && this.state.hovered) {
				if (!this.props.selected) {
					this.showOnBottom();
				}
				this.setState({hovered: false});
			}
		}
	}

	componentWillUnmount() {
		if (this.props.changeContext) {
			this.props.changeContext(null);
		}
	}

	onAdd(event) {
		if (event.target) {
			this.leafletFeature = event.target;
		}
	}

	onClick() {
		if (this.props.selectable) {
			this.showOnTop();

			if (this.props.onClick && this.props.fid) {
				this.props.onClick(this.props.fid);
			}
		}
	}

	onMouseMove(event) {
		if (this.props.hoverable) {
			this.showOnTop();

			if (this.fid && this.props.changeContext) {
				this.props.changeContext([this.fid], {
					popup: {
						x: event.originalEvent ? event.originalEvent.pageX : event.pageX,
						y: event.originalEvent ? event.originalEvent.pageY : event.pageY,
						fidColumnName: this.props.fidColumnName,
						data: this.props.feature.properties,
					},
				});
			}

			if (!this.state.hovered) {
				this.setState({hovered: true});
			}
		}
	}

	onMouseOut() {
		if (this.props.hoverable) {
			if (!this.props.selected) {
				this.showOnBottom();
			}

			if (this.props.changeContext) {
				this.props.changeContext(null);
			}

			this.setState({hovered: false});
		}
	}

	/**
	 * Show feature on the top of others, if it's not a point
	 */
	showOnTop() {
		if (this.leafletFeature && this.props.type !== 'Point' && this.props.type !== 'MultiPoint') {
			this.leafletFeature.bringToFront();
		}
	}

	/**
	 * Show feature in the bottom, if it's a polygon
	 */
	showOnBottom() {
		if (
			this.leafletFeature &&
			(this.props.type === 'Polygon' || this.props.type === 'MultiPolygon')
		) {
			this.leafletFeature.bringToBack();
		}
	}

	render() {
		const props = this.props;
		const coordinates = this.convertCoordinates(props.feature);
		const styles = this.calculateStyles(
			props.feature,
			props.styleDefinition,
			props.hoveredStyleDefinition,
			props.selected,
			props.selectedStyleDefinition,
			props.selectedHoveredStyleDefinition
		);

		let style = styles.default;

		if (props.selected && this.state.hovered && styles.selectedHovered) {
			style = styles.selectedHovered;
		} else if (this.state.hovered && styles.hovered) {
			style = styles.hovered;
		} else if (props.selected && styles.selected) {
			style = styles.selected;
		}

		// TODO add support for other geometry types
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

	renderPolygon(coordinates, style) {
		return (
			<Polygon
				interactive={this.props.hoverable || this.props.selectable}
				onAdd={this.onAdd}
				onClick={this.onClick}
				onMouseMove={this.onMouseMove}
				onMouseOut={this.onMouseOut}
				positions={coordinates}
				{...style}
			/>
		);
	}

	renderLine(coordinates, style) {
		return (
			<Polyline
				interactive={this.props.hoverable || this.props.selectable}
				onAdd={this.onAdd}
				onClick={this.onClick}
				onMouseOver={this.onMouseMove}
				onMouseMove={this.onMouseMove}
				onMouseOut={this.onMouseOut}
				positions={coordinates}
				{...style}
			/>
		);
	}

	renderPoint(coordinates, style) {
		if (this.props.pointAsMarker) {
			return this.renderShape(coordinates, style);
		} else {
			return (
				<Circle
					interactive={this.props.hoverable || this.props.selectable}
					onAdd={this.onAdd}
					onClick={this.onClick}
					onMouseMove={this.onMouseMove}
					onMouseOver={this.onMouseMove}
					onMouseOut={this.onMouseOut}
					center={coordinates}
					{...style}
				/>
			);
		}
	}

	renderShape(coordinates, style) {
		if (!this.shape) {
			this.shape = helpers.getMarkerShape(this.shapeId, style, {
				icons: this.props.icons,
				onMouseMove: this.onMouseMove,
				onMouseOver: this.onMouseMove,
				onMouseOut: this.onMouseOut,
				onClick: this.onClick,
			});
		}

		if (!shallowEqualObjects(this.style, style)) {
			this.style = style;
			this.shape.setStyle(style, this.shapeId, this.shape.basicShape);
		}

		return (
			<Marker
				interactive={this.props.hoverable || this.props.selectable}
				position={coordinates}
				icon={this.shape}
				onAdd={this.onAdd}
			/>
		);
	}
}

export default ContextWrapper(Feature);
