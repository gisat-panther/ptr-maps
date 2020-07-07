import { TileLayer } from 'leaflet'
import isEqual from 'fast-deep-equal'

import {GridLayer,withLeaflet } from 'react-leaflet';

export const EVENTS_RE = /^on(.+)$/i
class WMSTileLayer extends GridLayer {
  createLeafletElement(props) {
    const { url, params, ...restParams } = props
    const { leaflet: _l, ...options } = this.getOptions({
      ...restParams,
      ...params,
    });
    return new TileLayer.WMS(url, options)
  }

  updateLeafletElement(fromProps, toProps) {
    super.updateLeafletElement(fromProps, toProps);

    const { url: prevUrl } = fromProps;
    const { url } = toProps;

    if (url !== prevUrl) {
      this.leafletElement.setUrl(url)
    }
    if (!isEqual(fromProps.params, toProps.params)) {
      this.leafletElement.setParams(toProps.params)
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

export default withLeaflet(WMSTileLayer)