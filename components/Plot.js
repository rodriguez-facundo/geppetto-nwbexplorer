import React, { Fragment } from 'react';
import Plot from 'geppetto-client/js/components/interface/plot/Plot.js';

export default ({ model, instancePath }) => {
  if (!model) {
    return 
  }
  return (
    <Plot 
      instancePath={instancePath}
      lineOptions={{ color: 'rgb(0, 0, 0)' }}
      id={instancePath ? instancePath : "empty"}
    />
  )
}