import React from 'react';
import parseGeoRaster from 'georaster';
import CogLayerComponent from './CogLayer';
import {withLeaflet} from 'react-leaflet';

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
			this.setState({georaster});
		});
	}

	render() {
		if (this.state.georaster) {
			return (
				<CogLayerComponent {...this.props} georaster={this.state.georaster} />
			);
		} else {
			return null;
		}
	}
}

export default withLeaflet(CogLayerWrapper);
