import React from 'react';
import PlotComponent from 'geppetto-client/js/components/interface/plot/PlotComponent.js';

export default class NWBTimeseriesPlotComponent extends React.Component{
  constructor (props) {
    super(props);

  }

  render () {
    const { instancePath, color = 'white' } = this.props;
    return <PlotComponent 
      plots={[{ x: `${instancePath}.time`, y:`${instancePath}.data`, lineOptions: { color: color } }]}
      id={instancePath ? instancePath : "empty"}
    />;
  }
}