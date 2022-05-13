// eslint-disable-next-line no-unused-vars
import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import {mapConstants} from '@gisatcz/ptr-core';
import {Icon, Button} from '@gisatcz/ptr-atoms';
import {map as mapUtils} from '@gisatcz/ptr-utils';
import './style.scss';

const MapControls = ({
	view,
	viewLimits,
	updateView,
	resetHeading,
	mapKey,
	zoomOnly,
	levelsBased,
	mapHeight,
	mapWidth,
}) => {
	const tiltIncrement = 5;
	const headingIncrement = 1.0;
	const zoomIncrement = 0.04;
	const resetHeadingDisabled = !view?.heading || view?.heading === 360;

	const handleTiltUp = () => {
		const update = {tilt: view.tilt - tiltIncrement};
		updateView(update, mapKey);
	};

	const handleTiltDown = () => {
		const update = {tilt: view.tilt + tiltIncrement};
		updateView(update, mapKey);
	};

	const handleHeadingRight = () => {
		const update = {heading: view.heading - headingIncrement};
		updateView(update, mapKey);
	};
	const handleHeadingLeft = () => {
		const update = {heading: view.heading + headingIncrement};
		updateView(update, mapKey);
	};
	const handleZoomIn = () => {
		let update = null;
		if (levelsBased && view && view.boxRange) {
			// remove 1 from box range to prevent rounding issues
			update = {boxRange: (view.boxRange - 1) / 2};
		} else {
			update = {boxRange: view.boxRange * (1 - zoomIncrement)};
		}
		updateView(update, mapKey);
	};

	const handleZoomOut = () => {
		let update;
		if (levelsBased && view && view.boxRange) {
			// add 1 to box range to prevent rounding issues
			update = {boxRange: view.boxRange * 2 + 1};
		} else {
			update = {boxRange: view.boxRange * (1 + zoomIncrement)};
		}
		updateView(update, mapKey);
	};

	const handleResetHeading = () => {
		resetHeading(mapKey);
	};

	const isZoomButtonActive = type => {
		const definedLimits = viewLimits?.boxRangeRange;
		const currentBoxRange = view?.boxRange;

		if (levelsBased) {
			const currentLevel = mapUtils.view.getZoomLevelFromBoxRange(
				currentBoxRange,
				mapWidth,
				mapHeight
			);

			if (type === 'in') {
				let maxZoom = mapConstants.defaultLevelsRange[1];
				if (definedLimits && definedLimits[0]) {
					let definedLimitAsLevel = mapUtils.view.getZoomLevelFromBoxRange(
						definedLimits[0],
						mapWidth,
						mapHeight
					);
					if (definedLimitAsLevel < maxZoom) {
						maxZoom = definedLimitAsLevel;
					}
				}

				return currentLevel < maxZoom;
			} else {
				let minZoom = mapConstants.defaultLevelsRange[0];
				if (definedLimits && definedLimits[1]) {
					let definedLimitAsLevel = mapUtils.view.getZoomLevelFromBoxRange(
						definedLimits[1],
						mapWidth,
						mapHeight
					);
					if (definedLimitAsLevel > minZoom) {
						minZoom = definedLimitAsLevel;
					}
				}

				return currentLevel > minZoom;
			}
		} else {
			if (type === 'in') {
				const limit =
					(definedLimits && definedLimits[0]) || mapConstants.minBoxRange;
				return currentBoxRange * (1 - zoomIncrement) >= limit;
			} else {
				const limit =
					(definedLimits && definedLimits[1]) || mapConstants.maxBoxRange;
				return currentBoxRange * (1 + zoomIncrement) <= limit;
			}
		}
	};

	// TODO different controls for 2D
	return (
		<div className="ptr-map-controls">
			{/* <div className="exaggerate-control control">
                        <HoldButton 
                            pressCallback={() => {this.handleExaggerateMinus()}}
                            onClick={() => {this.handleExaggerateMinus()}}
                            onMouseDown={200}
                            pressCallbackTimeout={20}
                            finite={false}
                        >
                            <Icon style={{transform: 'rotate(90deg)'}} icon='arrow-left' width={22} height={22} viewBox={'0 0 34 34'}/>
                        </HoldButton>
                        <HoldButton 
                            pressCallback={() => {this.handleExaggerateMinus()}}
                            onClick={() => {this.handleExaggerateMinus()}}
                            onMouseDown={200}
                            pressCallbackTimeout={20}
                            finite={false}
                        >
                            <Icon style={{transform: 'rotate(-90deg)'}} icon='arrow-left' width={22} height={22} viewBox={'0 0 34 34'}/>
                        </HoldButton>
                    </div> */}
			<div className="zoom-control control">
				<Button
					onHold={() => {
						handleZoomIn();
					}}
					onClick={() => {
						handleZoomIn();
					}}
					disabled={!isZoomButtonActive('in')}
				>
					<Icon icon="plus-thick" />
				</Button>
				<Button
					onHold={() => {
						handleZoomOut();
					}}
					onClick={() => {
						handleZoomOut();
					}}
					disabled={!isZoomButtonActive('out')}
				>
					<Icon icon="minus-thick" />
				</Button>
			</div>
			{!zoomOnly ? (
				<>
					<div className="rotate-control control">
						<Button
							onHold={() => {
								handleHeadingRight();
							}}
							onClick={() => {
								handleHeadingRight();
							}}
						>
							<Icon icon="rotate-right" />
						</Button>
						<Button
							onClick={() => {
								handleResetHeading();
							}}
							disabled={resetHeadingDisabled}
						>
							<Icon
								style={{
									transform: `rotate(${view ? -view.heading : 0}deg)`,
								}}
								icon="north-arrow"
							/>
						</Button>
						<Button
							onHold={() => {
								handleHeadingLeft();
							}}
							onClick={() => {
								handleHeadingLeft();
							}}
						>
							<Icon icon="rotate-left" />
						</Button>
					</div>
					<div className="tilt-control control">
						<Button
							className="tilt-more-control"
							onHold={() => {
								handleTiltDown();
							}}
							onClick={() => {
								handleTiltDown();
							}}
						>
							<Icon icon="tilt-more" />
						</Button>
						<Button
							className="tilt-more-control"
							onHold={() => {
								handleTiltUp();
							}}
							onClick={() => {
								handleTiltUp();
							}}
						>
							<Icon icon="tilt-less" />
						</Button>
					</div>
				</>
			) : null}
		</div>
	);
};

MapControls.propTypes = {
	heading: PropTypes.number,
	view: PropTypes.object,
	viewLimits: PropTypes.object,
	updateView: PropTypes.func,
	resetHeading: PropTypes.func,
	mapKey: PropTypes.string,
	zoomOnly: PropTypes.bool,
	levelsBased: PropTypes.oneOfType([PropTypes.bool, PropTypes.array]),
	mapHeight: PropTypes.number,
	mapWidth: PropTypes.number,
};

export default MapControls;
