import React, { Fragment } from 'react';
import ReduxPlot from 'geppetto-client/js/components/interface/plot/ReduxPlot.js';
import WidgetCapability from 'geppetto-client/js/components/widgets/WidgetCapability';
import Button from '@material-ui/core/Button'
const ExtendedWidgetCapability = WrappedComponent => {
  class Widget extends WrappedComponent {

    constructor (props) {
      super(props);
    }

    render () {
      const wrappedComponentProps = Object.assign({}, this.props);
      

      // Things to remove
      delete wrappedComponentProps.setDraggable

      // Add some redux here
      wrappedComponentProps['someData'] = [1, 2, 3]
      
      return <WrappedComponent {...wrappedComponentProps} />
    }
  }
  return Widget;
}


export default class Plot extends React.Component {
  constructor (props) {
    super(props);
    this.state = { instancePath2Plot: false };
  }

  componentDidUpdate (prevProps){
    /*
     * if (prevProps.instancePath2Plot != this.state.instancePath2Plot){
     *   this.forceUpdate()
     * }
     */
  }
  render () {
    const { model } = this.props;
    
    if (!model) {
      return '';
    }
    // const PlotWidget = ExtendedWidgetCapability(WidgetCapability.createWidget(Plot));
    
    return (
      <Fragment>
        <ReduxPlot style={{ zIndex: 9999 }} id="a_beautiful_world" instancePath2Plot={this.state.instancePath2Plot}/>
        <Button onClick={() => this.setState(oldState => ({ instancePath2Plot: !oldState.instancePath2Plot }))}/>
      </Fragment>
    );
  }
}
