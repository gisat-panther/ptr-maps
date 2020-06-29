import React from 'react';

import Context from '@gisatcz/cross-package-react-context';
import _ from "lodash";
const HoverContext = Context.getContext('HoverContext');



export default function contextWrapper(WrappedFeature) {
    return class extends React.PureComponent {
        static contextType = HoverContext;

        constructor(props) {
            super(props);

            this.hoveredFromContext = false;
            this.changeContext = this.changeContext.bind(this);
        }

        changeContext(hoveredItems, options) {
            if (hoveredItems && this.context && this.context.onHover) {
                this.context.onHover(hoveredItems, options);
            } else if (!hoveredItems && this.context && this.context.onHoverOut) {
                this.context.onHoverOut();
            }
        }

        render() {
            if (this.props.fid && this.context && this.context.hoveredItems) {
                this.hoveredFromContext = _.indexOf(this.context.hoveredItems, this.props.fid) !== -1
            }

            // TODO interactive without context case?
            if (this.context && this.props.hoverable) {
                return <WrappedFeature {...this.props} changeContext={this.changeContext} hoveredFromContext={this.hoveredFromContext}/>;
            } else {
                return <WrappedFeature {...this.props}/>;
            }
        }
    }
}