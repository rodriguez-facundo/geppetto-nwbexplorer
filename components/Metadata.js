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
    const content = []
    let type = anyInstance;
    
    if (!type) {
      return 
    }

    if (!(type instanceof Type)) {
      type = anyInstance.getType();
    }   
      
    type.getChildren().forEach((variable, index) => {

      if (variable.getName() == 'str' ) {
        let value = variable.getInitialValue().value.text
        let name = variable.getId()
          
        content.push(
          <Collapsible 
            open={true}
            trigger={prettyFormat(name)}
          >
            <p>{prettyFormat(value)}</p>
          </Collapsible>
        );
      } else if (variable.getName() == 'subject' ) {
        
        let name = variable.getId()
          
        const subject = variable.getType().getChildren().map(v => {
          if (v.getName() == 'str') {
            let name = v.getId()
            let value = v.getInitialValue().value.text
            return <p key={name}>{`${prettyFormat(name)}: ${prettyFormat(value)}`}</p>
          }
        })

        content.push(
          <Collapsible 
            open={true}
            trigger={prettyFormat(name)}
          >
            <div>{subject}</div>
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