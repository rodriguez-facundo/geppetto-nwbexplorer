import React from 'react';
import NWBExplorer from './NWBExplorer';

export default class MainTemplate extends React.Component {

  render () {
    return (
      <div className="mainContainer">
        <div className="midContainer">
          <NWBExplorer />
        </div>
      </div>
    );
  }

}