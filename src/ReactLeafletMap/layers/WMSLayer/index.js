import { TileLayer } from 'leaflet'
import isEqual from 'fast-deep-equal'

import {GridLayer,withLeaflet } from 'react-leaflet';

export const EVENTS_RE = /^on(.+)$/i
class WMSTileLayer extends GridLayer {
  createLeafletElement(props) {
    const { url, ...params } = props
    const { leaflet: _l, ...options } = this.getOptions(params)
    return new TileLayer.WMS(url, options)
  }

  updateLeafletElement(fromProps, toProps) {
    super.updateLeafletElement(fromProps, toProps)

    const { url: prevUrl, opacity: _po, zIndex: _pz, ...prevProps } = fromProps
    const { leaflet: _pl, ...prevParams } = this.getOptions(prevProps)
    const { url, opacity: _o, zIndex: _z, ...props } = toProps
    const { leaflet: _l, ...params } = this.getOptions(props)

    if (url !== prevUrl) {
      this.leafletElement.setUrl(url)
    }
    if (!isEqual(params, prevParams)) {

        const forbidenParams = ['pane', 'minZoom', 'maxZoom', 'crs'];
        const filteredParams = Object.keys(params).reduce((options, key) => {
        if (!forbidenParams.includes(key)) {
            options[key] = params[key]
        }
        return options
        }, {})


      this.leafletElement.setParams(filteredParams)
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