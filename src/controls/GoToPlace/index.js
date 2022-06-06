import {useState} from 'react';
import PropTypes from 'prop-types';

import './style.scss';
import {Icon, Input} from '@gisatcz/ptr-atoms';

const GoToPlace = ({goToPlace}) => {
	const [text, setText] = useState(null);
	const [previousSearching, setPreviousSearching] = useState(null);

	const search = e => {
		if (e.charCode === 13 && goToPlace && text !== previousSearching) {
			goToPlace(text);
			setPreviousSearching(text);
		}
	};

	return (
		<div className="ptr-go-to-place-box" onKeyPress={search}>
			<Input placeholder="Zoom to" onChange={setText} value={text}>
				<Icon icon="search" />
			</Input>
		</div>
	);
};

GoToPlace.propTypes = {
	goToPlace: PropTypes.func,
};

export default GoToPlace;
