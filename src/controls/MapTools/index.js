import PropTypes from 'prop-types';
import './mapTools.scss';
const MapTools = props => {
	return <div className="map-tools">{props.children}</div>;
};

MapTools.propTypes = {
	children: PropTypes.node,
};

export default MapTools;
