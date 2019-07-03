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

  prettyFormat (string) {
    let output = string.charAt(0).toUpperCase() + string.slice(1);
    return output.replace('_interface_map', '').replace('_', ' ')
  }

  setData (anyInstance, counter, firstOne = true) {
    const { prettyFormat } = this;
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

    } else if (typeName.endsWith("interface_map")) {
      let prevCounter = this.content.keys.length;
      this.content.values[prevCounter] = (
        <Collapsible
          open={true}
          trigger={prettyFormat(typeName)}
        >
          {type.getChildren().map(instance => {
            const name = instance.getInitialValue().value.text;
            return <p key={name}>{prettyFormat(name)}</p>
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
          trigger={prettyFormat(this.content.keys[prevCounter])}
        >
          <p>{prettyFormat(value.text)}</p>
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
    const { instancePath } = this.props;
 
      
    if (instancePath != prevProps.instancePath) {
      this.setData(Instances.getInstance(instancePath))
    }

  }

  componentDidMount () {
    const { instancePath } = this.props;

    this.setData(Instances.getInstance(instancePath))
  }


  render () {
    return (
      <div style={{ marginBottom:'1em' }}>
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