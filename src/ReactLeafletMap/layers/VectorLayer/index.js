import React from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';

import CanvasVectorLayer from "../CanvasVectorLayer"
import DiagramLayer from "../DiagramLayer";
import IndexedVectorLayer from "../IndexedVectorLayer";
import SvgVectorLayer from "../SvgVectorLayer";
import TiledVectorLayer from "../TiledVectorLayer";

class VectorLayer extends React.PureComponent {
	static propTypes = {
		key: PropTypes.string,
		layerKey: PropTypes.string,
		uniqueLayerKey: PropTypes.oneOfType([
			PropTypes.number,
			PropTypes.string
		]),
		onClick: PropTypes.func,
		opacity: PropTypes.number,
		options: PropTypes.object,
		type: PropTypes.string,
		view: PropTypes.object,
		zoom: PropTypes.number,
		zIndex: PropTypes.number
	};

	constructor(props) {
		super(props);
	}

	getOptions() {
		const props = this.props;
		const renderAs = props.options?.renderAs;
		let options = props.options;

		if (renderAs) {
			const boxRange  = props.view?.boxRange;
			const renderAsData = _.find(renderAs, (renderAsItem) => {
				const boxRangeRange = renderAsItem.boxRangeRange;

				// Current boxRange is in defined range
				return (boxRange > boxRangeRange[0] && boxRange <= boxRangeRange[1]) || (!boxRangeRange[0] && boxRange <= boxRangeRange[1]) || (boxRange > boxRangeRange[0] && !boxRangeRange[1]);
			});

			if (renderAsData) {
				// TODO enable to define other layer options in renderAs
				options = {
					...options,
					style: renderAsData.options?.style || options?.style,
					pointAsMarker: renderAsData.options?.hasOwnProperty("pointAsMarker") ? renderAsData.options.pointAsMarker : options?.pointAsMarker,
					renderingTechnique: renderAsData.options?.renderingTechnique || options?.renderingTechnique
				}
			}
		}

		return options;
	}

	getRenderComponent(renderingTechnique) {
		switch (renderingTechnique) {
			case 'canvas':
				return CanvasVectorLayer;
			case 'svg':
			default:
				return SvgVectorLayer;
		}
	}

	render() {
		const options = this.getOptions();
		const renderComponent = this.getRenderComponent(options?.renderingTechnique);

		// TODO handle type 'diagram'
		if (this.props.type === 'tiled-vector') {
			return this.renderTiledVectorLayer(options, renderComponent);
		} else {
			return this.renderBasicVectorLayer(options, renderComponent);
		}
	}

	renderTiledVectorLayer(options, renderComponent) {
		const {options: opt, ...props} = this.props;

		return (
			<TiledVectorLayer
				component={renderComponent}
				{...props}
				{...options}
			/>
		);
	}

	renderBasicVectorLayer(options, renderComponent) {
		const {options: opt, ...props} = this.props;

		if (renderComponent.type === CanvasVectorLayer) {
			return (
				<CanvasVectorLayer
					{...props}
					{...options}
				/>
			);
		} else {
			return (
				<IndexedVectorLayer
					component={renderComponent}
					{...props}
					{...options}
				/>
			);
		}
	}

}

export default VectorLayer;
