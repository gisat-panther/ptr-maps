import Loadable from 'react-loadable';
import {isServer} from '@gisatcz/ptr-core';
import PresentationEmpty from './presentationEmpty';

const LoadableMapControls = Loadable({
	loader: () => {
		return isServer ? import('./presentationEmpty') : import('../MapControls');
	},
	render(loaded, props) {
		let MapControls = loaded.default;
		return <MapControls {...props} />;
	},
	loading: props => {
		if (props.error) {
			return <div>Error!</div>;
		} else {
			return <div>Loading...</div>;
		}
	},
});

const isomorphicLoadableMapControls = props => {
	return isServer ? <PresentationEmpty /> : <LoadableMapControls {...props} />;
};
export default isomorphicLoadableMapControls;
