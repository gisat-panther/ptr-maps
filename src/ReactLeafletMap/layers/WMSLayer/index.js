import { TileLayer } from 'leaflet';
import isEqual from 'fast-deep-equal';
import {MapLayer,withLeaflet } from 'react-leaflet';

import wms from './leaflet.wms';
export const EVENTS_RE = /^on(.+)$/i
class WMSLayer extends MapLayer {
  createLeafletElement(props) {
    const { url, params, singleTile, ...restParams } = props
    const { leaflet: _l, ...options } = this.getOptions({
      ...restParams,
      ...params,
    });

    if(singleTile) {
      const source = new wms.source(url, {...options, pane: _l.pane, 'tiled': false, identify: false});
      const layer = source.getLayer(options.layers);
      layer.options.pane = _l.pane;
      return layer;
    } else {
      return new TileLayer.WMS(url, options)
    }
  }

  updateLeafletElement(fromProps, toProps) {
    super.updateLeafletElement(fromProps, toProps);

    const { url: prevUrl } = fromProps;
    const { url } = toProps;

    if (url !== prevUrl) {
      this.leafletElement.setUrl(url)
    }
    if (!isEqual(fromProps.params, toProps.params)) {
      this.leafletElement.setParams({...toProps.params, pane: toProps.leaflet.pane})
    }
  }

  getOptions(params) {
    const superOptions = super.getOptions(params)
    return Object.keys(superOptions).reduce((options, key) => {
      if (!EVENTS_RE.test(key) ) {
        options[key] = superOptions[key]
      }
      return options
    }, {})
  }
}

export default withLeaflet(WMSLayer)