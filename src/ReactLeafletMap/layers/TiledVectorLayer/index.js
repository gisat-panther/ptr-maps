import React from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import {withLeaflet} from "react-leaflet";
import IndexedVectorLayer from "../IndexedVectorLayer";
import VectorLayer from "../VectorLayer";

class TiledVectorLayer extends React.PureComponent {
	static propTypes = {

	};

	constructor(props) {
		super(props);
	}

	render() {
		const props = this.props;
		const tiles = props.features;

		if (tiles?.length) {
			return tiles.map(tile => {
				const uniqueLayerKey = `${props.uniqueLayerKey}_${tile.level}_${JSON.stringify(tile.tile)}`;

				return (
					<IndexedVectorLayer
						{...props}
						component={VectorLayer}
						key={uniqueLayerKey}
						uniqueLayerKey={uniqueLayerKey}
						layerKey={props.layerKey}
						features={tile.features}
					/>
				);
			});
		} else {
			return null;
		}

	}
}

export default withLeaflet(TiledVectorLayer);