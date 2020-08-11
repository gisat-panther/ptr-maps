import React from "react";
import Loadable from 'react-loadable';
import {isServer} from '@gisatcz/ptr-core';
import PresentationEmpty from './presentationEmpty';

const LoadableReactLeafletMap = Loadable({
    loader: () => {
        return isServer ? import('./presentationEmpty') : import('../ReactLeafletMap')},
    render(loaded, props) {
        let ReactLeafletMap = loaded.default;
        return <ReactLeafletMap {...props}/>
    },
    loading: (props) => {
        if (props.error) {
            return <div>Error!</div>;
        } else {
            return <div>Loading...</div>;
        }
    }
});  

const isomorphicLoadableReactLeafletMap = (props) => {
    return isServer ? <PresentationEmpty /> : <LoadableReactLeafletMap {...props}/>
}
export default isomorphicLoadableReactLeafletMap