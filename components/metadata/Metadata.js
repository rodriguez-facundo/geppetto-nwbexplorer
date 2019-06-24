import React from 'react';
import Collapsible from 'react-collapsible';
import HTMLViewer from 'geppetto-client/js/components/interface/htmlViewer/HTMLViewer';

const anchorme = require('anchorme');
const Type = require('geppetto-client/js/geppettoModel/model/Type');

const GEPPETTO = require('geppetto');
// require('./style.less');
 

export default class Metadata extends React.Component {

  constructor (props) {
    super(props);

    this.state = { html: undefined, }
    
    this.setData = this.setData.bind(this);
    
    this.getVariable = this.getVariable.bind(this);

    this.content = {
      keys : [],
      values : []
    };

  }

  setData (anyInstance, counter, firstOne = true) {
    var anchorOptions = {
      "attributes": {
        "target": "_blank",
        "class": "popup_link"
      },
      "html": true,
      ips: false,
      emails: true,
      urls: true,
      TLDs: 20,
      truncate: 0,
      defaultProtocol: "http://"
    };
    var type = anyInstance;
    if (!type) {
      return 
    }


    if (!(type instanceof Type)) {
      type = anyInstance.getType();
    }

    if (type.getMetaType() == GEPPETTO.Resources.COMPOSITE_TYPE_NODE) {
      for (var i = 0; i < type.getVariables().length; i++) {
        var v = type.getVariables()[i];
        var nameKey = v.getName();
        this.content.keys[i] = nameKey;
        var id = `OSB_el_${i}`;
        this.setData(v, i, false);
      }
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
          <div>
            <HTMLViewer 
              id={id} 
              content={anchorme(value.text, anchorOptions)}
            />
          </div>
        </Collapsible>
      );
    } else if (type.getMetaType() == GEPPETTO.Resources.HTML_TYPE) {
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
          <div style={{ textAlign: 'center' }}>
            <HTMLViewer 
              id={id} 
              content={value.html}
            /> 
          </div>
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