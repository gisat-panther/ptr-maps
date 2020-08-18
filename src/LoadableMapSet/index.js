import React from "react";
import Loadable from 'react-loadable';
import {isServer} from '@gisatcz/ptr-core';
import PresentationEmpty from '../LoadableMap/presentationEmpty';

const LoadableMapSet = Loadable({
    loader: () => {
        return isServer ? import('../LoadableMap/presentationEmpty') : import('../MapSet/index.js')},
    render(loaded, props) {
        let MapSet = loaded.default;
        return <MapSet {...props}/>
    },
    loading: (props) => {
        if (props.error) {
            return <span>Error!</span>;
        } else {
            return <span>Loading...</span>;
        }
    }
});  

const isomorphicMapSet = (props) => {
    return isServer ? <PresentationEmpty /> : <LoadableMapSet {...props}/>
}
export default isomorphicMapSet