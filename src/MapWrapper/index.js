import React from 'react';
import classNames from 'classnames';

import './style.scss';

class MapWrapper extends React.PureComponent {
    render() {
        return (
            <div className="ptr-map-wrapper">
                {this.props.children}
            </div>
        );
    }
}

export default MapWrapper;
