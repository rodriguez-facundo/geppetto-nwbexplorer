import React, { Component } from 'react';
import ListViewer from './listviewer/ListViewer';
import listViewerConf from './configuration/listViewerConfiguration.js';

export default class NWBListViewer extends Component {

  constructor (props) {
    super(props);
    this.showPlot = this.props.showPlot ? this.props.showPlot : () => console.debug('showPlot not defined in ' + typeof this);
    this.updateDetailsWidget = this.props.updateDetailsWidget ? this.props.updateDetailsWidget : () => console.debug('updateDetailsWidget not defined in ' + typeof this);
  }

  clickShowPlot = entity => (
    this.showPlot({ path: entity.get('path'), type: entity.get('type') })
  )

  clickShowDetails = entity => (
    this.updateDetailsWidget( entity.get('path') )
  )

  getInstances () {
    return GEPPETTO.ModelFactory.allPaths.
      filter(({ path, type }) => path.match(this.props.pathPattern) && type.match('Model.nwblib'))
      .map(mapModelPathToList);
  }

  render (){
    
    return <ListViewer 
      columnConfiguration={listViewerConf} 
      instances={this.getInstances()} 
      handler={this} 
      infiniteScroll={true} />
     
  }

}

function mapModelPathToList ({ path }) {
  const instance = Instances.getInstance(path);
  try {
    var description = Instances.getInstance(path + '.details.description');
  } catch (Error){
    
  }
  
  return {
    path,
    type: instance.getType().getName(),
    description: description ? description.getValue().wrappedObj.value.text : '-'
  }
}
