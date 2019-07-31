import React from 'react';
import PlotComponent from 'geppetto-client/js/components/interface/plot/PlotComponent.js';

export default class NWBTimeseriesPlotComponent extends React.Component{

  render () {
    const { instancePath, guestList, color = 'white' } = this.props;

    const plots = [{ 
      x: `${instancePath}.time`, 
      y:`${instancePath}.data`, 
      lineOptions: { color: color } 
    }]

    if (guestList && guestList.length > 0) {
      plots.push(
        ...guestList.map(guest => ({ 
          x: `${guest.instancePath}.time`, 
          y: `${guest.instancePath}.data`, 
          lineOptions: { color: guest.color } 
        }))
      )
    }

    return (
      <PlotComponent 
        plots={plots}
        id={instancePath ? instancePath : "empty"}
      />
    )
  }
}