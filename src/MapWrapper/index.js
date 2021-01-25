import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import './style.scss';
import {Button} from '@gisatcz/ptr-atoms';

class MapWrapper extends React.PureComponent {
	static propTypes = {
		active: PropTypes.bool,
		title: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
		onMapRemove: PropTypes.func,
	};

	static defaultProps = {
		title: false,
	};

	render() {
		const props = this.props;
		const wrapperClasses = classNames('ptr-map-wrapper', {
			active: this.props.active,
		});

		return (
			<div className={wrapperClasses}>
				<div className="ptr-map-wrapper-header">
					{props.onMapRemove ? this.renderCloseButton() : null}
					{props.title ? this.renderTitle() : null}
				</div>
				{this.props.children}
			</div>
		);
	}

	renderTitle() {
		let title = this.props.title;
		if (title === true) {
			title = this.props.name || this.props.mapKey || 'Map';
		}

		return (
			<div className="ptr-map-wrapper-title" title={title}>
				{title}
			</div>
		);
	}

	renderCloseButton() {
		let mapKey = this.props.stateMapKey || this.props.mapKey;

		return (
			<div className="ptr-map-wrapper-close-button">
				<Button
					icon="times"
					inverted
					invisible
					onClick={this.props.onMapRemove.bind(this, mapKey)}
				/>
			</div>
		);
	}
}

export default MapWrapper;
