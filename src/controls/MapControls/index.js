import React from "react";
import PropTypes from 'prop-types';
import constants from "../../constants";
import {Icon, Button} from '@gisatcz/ptr-atoms';
import './style.scss';

class MapControls extends React.PureComponent {

	static propTypes = {
		view: PropTypes.object,
		viewLimits: PropTypes.object,
		updateView: PropTypes.func,
		resetHeading: PropTypes.func,
		mapKey:PropTypes.string,
		zoomOnly: PropTypes.bool,
		levelsBased: PropTypes.oneOfType([
			PropTypes.bool,
			PropTypes.array
		])
	};

	constructor() {
		super();

		this.tiltIncrement = 5;
		this.headingIncrement = 1.0;
		this.zoomIncrement = 0.04;
		this.exaggerationIncrement = 1;

		this.state = {
			resetHeadingDisabled: false
		}
	}

	componentDidUpdate(prevProps, prevState, snapshot) {
		if (this.state.resetHeadingDisabled && (!this.props.view.heading || this.props.heading === "360")) {
			this.setState({
				resetHeadingDisabled: false
			})
		}
	}

	handleTiltUp() {
		const update = {tilt: this.props.view.tilt - this.tiltIncrement};
		this.props.updateView(update, this.props.mapKey);
	};

	handleTiltDown() {
		const update = {tilt: this.props.view.tilt + this.tiltIncrement};
		this.props.updateView(update, this.props.mapKey);
	};

	handleHeadingRight() {
		const update = {heading: this.props.view.heading - this.headingIncrement};
		this.props.updateView(update, this.props.mapKey);
	}
	handleHeadingLeft() {
		const update = {heading: this.props.view.heading + this.headingIncrement};
		this.props.updateView(update, this.props.mapKey);
	}
	handleZoomIn() {
		let update = null;
		if (this.props.levelsBased && this.props.view && this.props.view.boxRange) {
			update = {boxRange: this.props.view.boxRange/2};
		} else {
			update = {boxRange: this.props.view.boxRange * (1 - this.zoomIncrement)};
		}
		this.props.updateView(update, this.props.mapKey);
	}

	handleZoomOut() {
		let update;
		if (this.props.levelsBased && this.props.view && this.props.view.boxRange) {
			update = {boxRange: this.props.view.boxRange*2};
		} else {
			update = {boxRange: this.props.view.boxRange * (1 + this.zoomIncrement)};
		}
		this.props.updateView(update, this.props.mapKey);
	}

	handleResetHeading() {
		this.props.resetHeading(this.props.mapKey);
		this.setState({
			resetHeadingDisabled: true
		})
	}

	handleExaggeratePlus() {
		// const update = {elevation: this.props.view.elevation + this.exaggerationIncrement};
		// this.props.updateView(update, this.props.mapKey);
	}

	handleExaggerateMinus() {
		// const update = {elevation: Math.max(1, this.props.view.elevation - this.exaggerationIncrement)};
		// this.props.updateView(update, this.props.mapKey);
	}

	isZoomButtonActive(type) {
		const definedLimits = this.props.viewLimits && this.props.viewLimits.boxRangeRange;
		const currentBoxRange = this.props.view && this.props.view.boxRange;

		const limit = type === 'in' ? (definedLimits && definedLimits[0] || constants.minBoxRange) : (definedLimits && definedLimits[1] || constants.maxBoxRange);

		if (this.props.levelsBased) {
			if (type === "in") {
				return currentBoxRange/2 >= limit;
			} else {
				return currentBoxRange*2 <= limit;
			}
		} else {
			if (type === "in") {
				return currentBoxRange * (1 - this.zoomIncrement) >= limit;
			} else {
				return currentBoxRange * (1 + this.zoomIncrement) <= limit;
			}
		}
	}

	render () {
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
						onHold={() => {this.handleZoomIn()}}
						onClick={() => {this.handleZoomIn()}}
						disabled={!this.isZoomButtonActive('in')}
					>
						<Icon icon='plus-thick'/>
					</Button>
					<Button
						onHold={() => {this.handleZoomOut()}}
						onClick={() => {this.handleZoomOut()}}
						disabled={!this.isZoomButtonActive('out')}
					>
						<Icon icon='minus-thick'/>
					</Button>
				</div>
				{!this.props.zoomOnly ? (
					<>
						<div className="rotate-control control">
							<Button
								onHold={() => {this.handleHeadingRight()}}
								onClick={() => {this.handleHeadingRight()}}
							>
								<Icon icon='rotate-right'/>
							</Button>
							<Button
								onClick={() => {this.handleResetHeading()}}
								disabled={this.state.resetHeadingDisabled}
							>
								<Icon style={{transform: `rotate(${this.props.view ? -this.props.view.heading : 0}deg)`}} icon='north-arrow'/>
							</Button>
							<Button
								onHold={() => {this.handleHeadingLeft()}}
								onClick={() => {this.handleHeadingLeft()}}
							>
								<Icon icon='rotate-left'/>
							</Button>
						</div>
						<div className="tilt-control control">
							<Button
								className="tilt-more-control"
								onHold={() => {this.handleTiltDown()}}
								onClick={() => {this.handleTiltDown()}}
							>
								<Icon icon='tilt-more'/>
							</Button>
							<Button
								className="tilt-more-control"
								onHold={() => {this.handleTiltUp()}}
								onClick={() => {this.handleTiltUp()}}
							>
								<Icon icon='tilt-less'/>
							</Button>
						</div>
					</>
				) : null}
			</div>
		)
	}
}

export default MapControls;