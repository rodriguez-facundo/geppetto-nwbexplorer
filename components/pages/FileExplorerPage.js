import React from 'react';
import NWBExplorerContainer from '../NWBExplorerContainer';

export default class FileExplorerPage extends React.Component{

  render () {
    return (
      <div className="mainContainer">
        <div className="midContainer">
          <div id="instantiatedContainer" style={{ height: '90%', width: '100%' }}>
            <NWBExplorerContainer />
          </div>
        </div>
      </div>
    )
  }
}
