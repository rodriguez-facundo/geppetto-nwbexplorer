import React from 'react';
import Plot from 'geppetto-client/js/components/interface/plot/Plot.js';

export default class NWBTimeseriesPlotComponent extends React.Component{
  constructor (props) {
    super(props);
  }

  render () {
    const { instancePath, color = 'white' } = this.props;
    return <Plot 
      instancePath={{ x: `${instancePath}.time`, y:`${instancePath}.data` }}
      lineOptions={{ color: color }}
      id={instancePath ? instancePath : "empty"}
    />;
  }
}