// eslint-disable-next-line no-unused-vars
import React from 'react';
import {find as _find, cloneDeep as _cloneDeep} from 'lodash';
import PropTypes from 'prop-types';

import CanvasVectorLayer from '../CanvasVectorLayer';
import IndexedVectorLayer from '../IndexedVectorLayer';
import SvgVectorLayer from '../SvgVectorLayer';
import TiledVectorLayer from '../TiledVectorLayer';
import viewUtils from '../../../utils/view';

const VectorLayer = ({
	mapKey,
	layerKey,
	uniqueLayerKey,
	onClick,
	opacity,
	options,
	resources,
	type,
	view,
	zoom,
	zIndex,
	crs,
	height,
	width,
}) => {
	const getOptions = () => {
		const renderAs = options?.renderAs;
		let renderAsOptions = {..._cloneDeep(options)};
		if (renderAs) {
			const boxRange = view?.boxRange;
			const renderAsData = _find(renderAs, renderAsItem => {
				return viewUtils.isBoxRangeInRange(
					boxRange,
					renderAsItem.boxRangeRange
				);
			});

			if (renderAsData) {
				// TODO enable to define other layer options in renderAs
				renderAsOptions = {
					...options,
					style: renderAsData.options?.style || options?.style,
					pointAsMarker: Object.has(renderAsData.options, 'pointAsMarker')
						? renderAsData.options?.pointAsMarker
						: options?.pointAsMarker,
					renderingTechnique:
						renderAsData.options?.renderingTechnique ||
						options?.renderingTechnique,
				};
			}
		}

		return renderAsOptions;
	};

	const renderTiledVectorLayer = options => {
		return (
			<TiledVectorLayer
				{...{
					...options,
					crs,
					height,
					width,
					mapKey,
					layerKey,
					uniqueLayerKey,
					onClick,
					opacity,
					resources,
					type,
					view,
					zoom,
					zIndex,
				}}
			/>
		);
	};

	const renderBasicVectorLayer = options => {
		if (options.renderingTechnique === 'canvas') {
			return (
				<CanvasVectorLayer
					{...{
						...options,
						crs,
						height,
						width,
						mapKey,
						layerKey,
						uniqueLayerKey,
						onClick,
						opacity,
						resources,
						type,
						view,
						zoom,
						zIndex,
					}}
				/>
			);
		} else {
			return (
				<IndexedVectorLayer
					component={SvgVectorLayer}
					{...{
						...options,
						crs,
						height,
						width,

						mapKey,
						layerKey,
						uniqueLayerKey,
						onClick,
						opacity,
						// options,
						resources,
						type,
						view,
						zoom,
						zIndex,
						// features: options.features,
						// style: options.style,
					}}
				/>
			);
		}
	};

	const layerOptions = getOptions();

	if (type === 'tiledVector' || type === 'tiled-vector') {
		return renderTiledVectorLayer(layerOptions);
	} else {
		return renderBasicVectorLayer(layerOptions);
	}
};

VectorLayer.propTypes = {
	mapKey: PropTypes.string,
	layerKey: PropTypes.string,
	uniqueLayerKey: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
	onClick: PropTypes.func,
	opacity: PropTypes.number,
	options: PropTypes.object,
	resources: PropTypes.object,
	type: PropTypes.string,
	view: PropTypes.object,
	zoom: PropTypes.number,
	zIndex: PropTypes.number,
};

export default VectorLayer;
