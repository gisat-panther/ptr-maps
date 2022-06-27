import PropTypes from 'prop-types';
import classNames from 'classnames';

import './style.scss';
import {Button} from '@gisatcz/ptr-atoms';

const MapWrapper = ({
	title = false,
	active,
	onMapRemove,
	stateMapKey,
	mapKey,
	name,
	children,
}) => {
	const renderTitle = () => {
		if (title === true) {
			title = name || mapKey || stateMapKey || 'Map';
		}

		return (
			<div className="ptr-map-wrapper-title" title={title}>
				{title}
			</div>
		);
	};

	const renderCloseButton = () => {
		const wrapperMapKey = stateMapKey || mapKey;

		return (
			<div className="ptr-map-wrapper-close-button">
				<Button
					icon="times"
					inverted
					invisible
					onClick={() => onMapRemove(wrapperMapKey)}
				/>
			</div>
		);
	};

	const wrapperClasses = classNames('ptr-map-wrapper', {
		active: active,
	});

	return (
		<div className={wrapperClasses}>
			<div className="ptr-map-wrapper-header">
				{onMapRemove ? renderCloseButton() : null}
				{title ? renderTitle() : null}
			</div>
			{children}
		</div>
	);
};

MapWrapper.propTypes = {
	active: PropTypes.bool,
	children: PropTypes.node,
	mapKey: PropTypes.string,
	name: PropTypes.string,
	onMapRemove: PropTypes.func,
	stateMapKey: PropTypes.string,
	title: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
};

export default MapWrapper;
