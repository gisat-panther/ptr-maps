import GL from '@luma.gl/constants';
import constants from './constants';
import view from './utils/view';
import DeckGlMap from './DeckGlMap';
import GoToPlace from './controls/GoToPlace';
import MapGrid from './MapGrid';
import MapControls from './controls/MapControls';
import MapScale from './controls/MapScale';
import MapSet, {MapSetMap, MapSetPresentationMap} from './MapSet';
import MapTools from './controls/MapTools';
import MapWrapper from './MapWrapper';
import PresentationMap from './Map';
import ReactLeafletMap from './ReactLeafletMap';
import SimpleLayersControl from './controls/SimpleLayersControl';
import WorldWindMap from './WorldWindMap';
import * as proj from './proj';

import * as deckgl_core from '@deck.gl/core';
import * as deckgl_layers from '@deck.gl/layers';
import * as deckgl_geolayers from '@deck.gl/geo-layers';

//loadable
import LoadableMapControls from './controls/LoadableMapControls';
import LoadableMapSet from './LoadableMapSet';
import LoadableReactLeafletMap from './LoadableReactLeafletMap';
import LoadableMap from './LoadableMap';

export {
	constants,
	proj,
	view,
	DeckGlMap,
	GoToPlace,
	GL,
	deckgl_core,
	deckgl_layers,
	deckgl_geolayers,
	LoadableMapControls,
	LoadableMapSet,
	LoadableReactLeafletMap,
	LoadableMap,
	MapControls,
	MapGrid,
	MapTools,
	MapScale,
	MapSetMap,
	MapSetPresentationMap,
	MapSet,
	MapWrapper,
	PresentationMap,
	ReactLeafletMap,
	SimpleLayersControl,
	WorldWindMap,
};

export default {
	constants,
	view,
	proj,

	DeckGlMap,
	GoToPlace,
	GL,
	deckgl_core,
	deckgl_layers,
	deckgl_geolayers,

	LoadableMapControls,
	LoadableMapSet,
	LoadableReactLeafletMap,
	LoadableMap,

	MapControls,
	MapGrid,
	MapScale,
	MapSetMap,
	MapSetPresentationMap,
	MapSet,
	MapWrapper,
	MapTools,
	PresentationMap,
	SimpleLayersControl,
	ReactLeafletMap,
	WorldWindMap,
};
