import Loadable from 'react-loadable';
import {isServer} from '@gisatcz/ptr-core';
import PresentationEmpty from './presentationEmpty';

const LoadableMap = Loadable({
	loader: () => {
		return isServer
			? import('../LoadableMap/presentationEmpty')
			: import('../Map');
	},
	render(loaded, props) {
		let PresentationMap = loaded.default;
		return <PresentationMap {...props} />;
	},
	loading: props => {
		if (props.error) {
			return <span>Error!</span>;
		} else {
			return <span>Loading...</span>;
		}
	},
});

const isomorphicMap = props => {
	return isServer ? <PresentationEmpty /> : <LoadableMap {...props} />;
};
export default isomorphicMap;
