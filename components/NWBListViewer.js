import React, { Component } from 'react';
import ListViewer from './listviewer/ListViewer';
import listViewerConf from './configuration/listviewer.js';

export default class NWBListViewer extends Component {

  constructor (props) {
    super(props);
    this.showPlot = this.props.showPlot ? this.props.showPlot : () => console.debug('showPlot not defined');
  }

  clickShowPlot = instance => {
    this.showPlot({ path: instance.getPath(), type: instance.getVariable().getType().getName() });
  }

  getInstances () {
    return GEPPETTO.ModelFactory.allPaths.
      filter(({ path, type }) => path.startsWith(this.props.basePath))
    // .map(({ path }) => Instances.getInstance(path));
  }

  render (){
    // return 'POLLO' + this.props.basePath;
    
    return <ListViewer 
      columnConfiguration={listViewerConf} 
      instances={this.getInstances()} 
      handler={this} 
      infiniteScroll={true} />
     
  }

}