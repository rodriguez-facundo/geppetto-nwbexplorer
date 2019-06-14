import React, { Fragment } from 'react';
import ReduxPlot from 'geppetto-client/js/components/interface/plot/ReduxPlot.js';


export default ({ model, instancePath }) => {
  if (!model) {
    return 
  }
  return (
    <ReduxPlot 
      instancePath={instancePath}
      id={instancePath ? instancePath : "empty"}
    />
  )
}