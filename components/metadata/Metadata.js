import React from 'react';
import Collapsible from 'react-collapsible';

const Type = require('geppetto-client/js/geppettoModel/model/Type');

const GEPPETTO = require('geppetto');
 

export default class Metadata extends React.Component {

  constructor (props) {
    super(props);
    this.content = {
      keys : [],
      values : []
    };
  }

  setData (anyInstance, counter, firstOne = true) {
    let type = anyInstance;
    
    if (!type) {
      return 
    }

    if (!(type instanceof Type)) {
      type = anyInstance.getType();
    }
    let typeName = type.getName();

    if ( typeName == "general") {
      type.getVariables().forEach((instance, index) => {
        this.content.keys[index] = instance.getName();
        this.setData(instance, index, false);
      })

    } else if (typeName == "timeseries"){
      const detailsInstance = type.getChildren().find(child => child.getId() == 'details')
      
      detailsInstance.getType().getChildren().forEach((instance, index) => {
        this.content.keys[index] = instance.getName();
        this.setData(instance, index, false);
      })

    } else if (typeName == "Experiment_summary") {
      let prevCounter = this.content.keys.length;
      this.content.values[prevCounter] = (
        <Collapsible
          open={true}
          trigger={typeName}
        >
          {type.getChildren().map(instance => {
            const name = instance.getInitialValue().value.text;
            return <p key={name}>{name}</p>
          })}
        </Collapsible>
      )
    } else if (type.getMetaType() == GEPPETTO.Resources.TEXT_TYPE) {
      const value = this.getVariable(anyInstance).getInitialValues()[0].value;
      var prevCounter = this.content.keys.length;
      
      if (counter !== undefined) {
        prevCounter = counter;
      }
      
      this.content.values[prevCounter] = (
        <Collapsible 
          open={true}
          trigger={this.content.keys[prevCounter]}
        >
          <p>{value.text}</p>
        </Collapsible>
      );

    } 
    if (firstOne) {
      this.forceUpdate()
    }
  }

  getVariable (node) {
    if (node.getMetaType() == GEPPETTO.Resources.INSTANCE_NODE) {
      return node.getVariable();
    } else {
      return node;
    }
  }

  componentDidUpdate (prevProps, prevState) {
    const { mode, model, instancePath } = this.props;
    if (model){ 
      if (mode == 'general') {
        if (!!model != !!prevProps.model) {
          this.setData(Instances.getInstance('nwbfile.general'))  
        }
      } else {
        if (instancePath != prevProps.instancePath) {
          this.setData(Instances.getInstance(instancePath))
        }
      }
    }
  }

  componentDidMount () {
    const { mode, model, instancePath } = this.props;
    if (model && typeof Instances != "undefined") {
      const path = mode == "details" ? instancePath : 'nwbfile.general'
      this.setData(Instances.getInstance(path))
    }
  }


  render () {
    return (
      <div style={{ marginTop:'15px' }}>
        {
          this.content.values.map((item, key) => 
            <div key={key}>
              {React.cloneElement(item)}
            </div>
          )
        }
      </div>
    );
  }
}