import React from 'react';
import {find as _find} from 'lodash';
import PropTypes from 'prop-types';

import CanvasVectorLayer from '../CanvasVectorLayer';
import IndexedVectorLayer from '../IndexedVectorLayer';
import SvgVectorLayer from '../SvgVectorLayer';
// import TiledVectorLayer from '../TiledVectorLayer';
import view from '../../../utils/view';

class VectorLayer extends React.PureComponent {
	static propTypes = {
		layerKey: PropTypes.string,
		uniqueLayerKey: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
		onClick: PropTypes.func,
		opacity: PropTypes.number,
		options: PropTypes.object,
		type: PropTypes.string,
		view: PropTypes.object,
		zoom: PropTypes.number,
		zIndex: PropTypes.number,
	};

	getOptions() {
		const props = this.props;
		const renderAs = props.options?.renderAs;
		let options = props.options;

		if (renderAs) {
			const boxRange = props.view?.boxRange;
			const renderAsData = _find(renderAs, renderAsItem => {
				return view.isBoxRangeInRange(boxRange, renderAsItem.boxRangeRange);
			});

			if (renderAsData) {
				// TODO enable to define other layer options in renderAs
				options = {
					...options,
					style: renderAsData.options?.style || options?.style,
					pointAsMarker: renderAsData.options?.hasOwnProperty('pointAsMarker')
						? renderAsData.options.pointAsMarker
						: options?.pointAsMarker,
					renderingTechnique:
						renderAsData.options?.renderingTechnique ||
						options?.renderingTechnique,
				};
			}
		}

		return options;
	}

	render() {
		const {type} = this.props;
		const options = this.getOptions();

		if (type === 'tiledVector' || type === 'tiled-vector') {
			// TODO
			// return this.renderTiledVectorLayer(options);
		} else {
			return this.renderBasicVectorLayer(options);
		}
	}

	renderTiledVectorLayer(options) {
		// const {options: opt, ...props} = this.props;
		//
		// return <TiledVectorLayer {...props} {...options} />;
	}

	renderBasicVectorLayer(options) {
		const {options: opt, ...props} = this.props;

		if (options.renderingTechnique === 'canvas') {
			return <CanvasVectorLayer {...props} {...options} />;
		} else {
			return (
				<IndexedVectorLayer
					component={SvgVectorLayer}
					{...props}
					{...options}
				/>
			);
		}
	}
}

export default VectorLayer;
