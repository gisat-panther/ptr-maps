import React from 'react';

import VectorLayer from "./layers/VectorLayer";
import WmsLayer from "./layers/WmsLayer";
import WmtsLayer from "./layers/WmtsLayer";

function getLayerByType(layer, group, zIndex) {
	if (layer.type){
		switch (layer.type) {
			case 'wmts':
				return (
					<WmtsLayer
						key={layer.key}
						data={layer}
						group={group}
						zIndex={zIndex}
					/>
				);
			case 'wms':
				return (
					<WmsLayer
						key={layer.key}
						data={layer}
						group={group}
						zIndex={zIndex}
					/>
				);
			case 'vector':
				return (
					<VectorLayer
						key={layer.key}
						data={layer}
						group={group}
						zIndex={zIndex}
					/>
				);
			default:
				return null;
		}
	} else {
		return null
	}
}

export default {
	getLayerByType
}