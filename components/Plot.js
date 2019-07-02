import React from 'react';
import Plot from 'geppetto-client/js/components/interface/plot/Plot.js';

export default class PlotComponent extends React.Component{
  constructor (props) {
    super(props);
  }

  render () {
    const { instancePath } = this.props;
    return <Plot 
      instancePath={{ x: `${instancePath}.time`, y:`${instancePath}.data` }}
      lineOptions={{ color: '#C5E7F1' }}
      id={instancePath ? instancePath : "empty"}
    />;
  }
}