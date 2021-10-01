import React from 'react';
import parseGeoRaster from 'georaster';
import {withLeaflet} from 'react-leaflet';
import {utils} from '@gisatcz/ptr-utils';
import CogLayerComponent from './CogLayer';

/**
 * Wrapper is used to load & parse geotiff data and to place layer to the pane for z-positioning
 */
class CogLayerWrapper extends React.PureComponent {
	constructor(props) {
		super(props);

		this.state = {
			georaster: null,
		};
	}

	// TODO handle pane z-index change & url change
	componentDidMount() {
		const {options, paneName, leaflet, zIndex} = this.props;
		const {url} = options;

		let pane = leaflet.map.getPane(paneName);
		if (!pane) {
			pane = leaflet.map.createPane(paneName);
			pane.style.zIndex = zIndex;
		}

		parseGeoRaster(url).then(georaster => {
			this.setState({georaster, key: utils.uuid()});
		});
	}

	componentWillUnmount() {
		const {paneName, leaflet} = this.props;
		if (paneName) {
			// delete pane and remove them from DOM
			delete leaflet.map._panes[paneName];
			const elements = document.querySelectorAll(`.leaflet-${paneName}-pane`);
			if (elements.length) {
				elements.forEach(element => element.remove());
			}
		}
	}

	componentDidUpdate(prevProps, prevState, snapshot) {
		const {options, paneName, leaflet, zIndex, opacity} = this.props;
		const {url} = options;

		if (zIndex !== prevProps.zIndex) {
			let pane = leaflet.map.getPane(paneName);
			pane.style.zIndex = zIndex;
		}

		if (url !== prevProps.options.url) {
			parseGeoRaster(url).then(georaster => {
				this.setState({georaster, key: utils.uuid()});
			});
		}

		// TODO find better solution for opacity change
		if (opacity !== prevProps.opacity) {
			this.setState({key: utils.uuid()});
		}
	}

	render() {
		if (this.state.georaster) {
			return (
				<CogLayerComponent
					{...this.props}
					georaster={this.state.georaster}
					key={this.state.key}
				/>
			);
		} else {
			return null;
		}
	}
}

export default withLeaflet(CogLayerWrapper);
