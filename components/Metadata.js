import React from 'react';
import Collapsible from 'react-collapsible';

const Type = require('geppetto-client/js/geppettoModel/model/Type');

export default class Metadata extends React.Component {

  state = { content: [] }

  prettyFormat (string) {
    let output = string.charAt(0).toUpperCase() + string.slice(1);
    return output.replace('_interface_map', '').replace('_', ' ')
  }

  setData (anyInstance) {
    const { prettyFormat } = this;
    let metadata;
    const content = []
    let type = anyInstance;
    
    if (!type) {
      return 
    }

    if (!(type instanceof Type)) {
      type = anyInstance.getType();
    }   
      
    type.getChildren().forEach(variable => {
      const variableType = variable.getType().getName();
      let name = variable.getId()

      if (variableType == 'Text' ) {
        let value = variable.getInitialValue().value.text
        metadata = prettyFormat(value)
      
      } else if (variableType == 'map' ) { 
        metadata = variable.getType().getChildren().map(v => {
          if (v.getType().getName() == 'Text') {
            let name = v.getId()
            let value = v.getInitialValue().value.text
            return <p key={name}><span class="label">{prettyFormat(name)}</span>: {prettyFormat(value)}</p>
          }
        })
      }

      if (metadata) {
        content.push(
          <Collapsible 
            open={true}
            trigger={prettyFormat(name)}
            triggerStyle={{ }}
          >
            <div>{metadata}</div>
          </Collapsible>
        );
      }
      
    })

    this.setState({ content })
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
    const { content } = this.state;
    return (
      <div style={{ marginBottom:'1em' }}>
        {
          content.map((item, key) => 
            <div key={key}>
              {item}
            </div>
          )
        }
      </div>
    );
  }
}