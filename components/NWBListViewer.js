import React, { Component } from 'react';
import ListViewer from 'geppetto-client/js/components/interface/listViewer/ListViewer';
import listViewerConf from './configuration/listViewerConfiguration.js';

const DEFAULT_MODEL_SETTINGS = { color:  'white' };
const TYPE_INCLUDE_REGEX = /^(?!.*details)Model.nwblib.*$/;

function mapModelPathToList ( path , modelSettings) {
  const instance = Instances.getInstance(path);
  try {
    var description = Instances.getInstance(path + '.description');
  } catch (Error){
    
  }
  
  return {
    path,
    type: instance.getType().getName(),
    description: description ? description.getValue().wrappedObj.value.text : '-',
    ...modelSettings
  }
}


export default class NWBListViewer extends Component {

  constructor (props) {
    super(props);
    this.updates = 0;
    this.showPlot = this.props.showPlot ? this.props.showPlot : () => console.debug('showPlot not defined in ' + typeof this);
    this.showImg = props.showImg ? props.showImg : () => console.debug('showImg not defined in ' + typeof this);
    this.updateDetailsWidget = this.props.updateDetailsWidget ? this.props.updateDetailsWidget : () => console.debug('updateDetailsWidget not defined in ' + typeof this);
    this.modelSettings = {};
    this.state = { update: 0 }
  }

  componentDidUpdate () {
    this.updates++;
  }
  getModelSettings (path) {
    return this.modelSettings[path] ? this.modelSettings[path] : DEFAULT_MODEL_SETTINGS ;
  }

  clickShowPlot ({ path, type, color }){
    this.modelSettings[path] = { color: color };
    this.setState({ update: this.state.update + 1 });
    this.showPlot({ path, type, color });
  }

  clickShowImg ({ path, type }) {
    this.showImg({ path, type });
  }

  clickShowDetails ({ path }){
    this.updateDetailsWidget( path )
  }

  getInstances () {
    return GEPPETTO.ModelFactory.allPaths.
      filter(({ path, type }) => path.match(this.props.pathPattern) && type.match(TYPE_INCLUDE_REGEX) )
      .map(({ path }) => mapModelPathToList(path, this.getModelSettings (path)));
  }

  render (){
    
    return <ListViewer 
      columnConfiguration={listViewerConf} 
      instances={this.getInstances()} 
      handler={this} 
      infiniteScroll={true} 
      update={this.state.update}/>

     
  }
  
  
}

