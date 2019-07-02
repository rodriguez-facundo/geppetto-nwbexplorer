import React from 'react';
import ListViewer from '../ListViewer';
import instances from './instances-small.json';
import { faGhost, faChartArea, faHandPointer } from '@fortawesome/free-solid-svg-icons';
import { GroupComponent, IconComponent, LinkComponent, ImageComponent, ParameterInputComponent } from '../ListViewer';

const CustomHeading = ({ title }) => <span style={{ color: '#AA0000' }}>{title}</span>;


const conf = [
  {
    id: "path",
    title: "Path",
    source: 'path', // entity.path. Same as (entity) => entity.path
    cssClassName: 'red', 
    action: function (entity) {
      return this.selectAction(entity); // 'this' is bound to the handler
    }
  },
  {
    id: "link",
    title: "Link",
    source: () => 'http://www.geppetto.org/',
    customComponent: LinkComponent,
    configuration: {}
  },
  {
    id: "image",
    title: "Image",
    source: () => 'http://www.geppetto.org/images/logo.png',
    customComponent: ImageComponent,
    configuration: {
      alt: "Alt for the image",
      title: "Image title",
      action: () => alert('Image')
    }
  },
  {
    id: 'input',
    title: 'Input',
    customComponent: ParameterInputComponent,
    configuration: {
      placeholder: "Insert value",
      defaultValue: 3,
      type: 'number',
      onBlur: (obj, value) => console.log("New value: " + value),
      onKeyPress:  (obj, value) => console.log(obj, value),
      readOnly: false, 
      classString: 'input-custom',
      unit: 'mm' 
    }
  },
  {
    id: "controls",
    source: entity => entity,
    title: "Controls",
    customComponent: GroupComponent,
    customHeadingComponent: CustomHeading,
    
    configuration: [
      {
        id: "plot",
        customComponent: 'IconComponent', // We can use the string for default components
        configuration: {
          action: entity => alert('plot'), // No binding for arrow functions: will run on the current context
          icon: faChartArea,
          label: "Plot",
          tooltip: "Plot time series"
        },

      },
      {
        id: "select",
        customComponent: IconComponent,
        configuration: {
          action: 'selectAction', // This will call the method on the handler component: handler.selectAction(value) 
          icon: faHandPointer,
          label: "Select",
          tooltip: "Select in 3D canvas"
        },

      },
    ]
  },
  {
    id: "long",
    customComponent: IconComponent,
    source: entity => entity.path,
    configuration: {
      action: 'selectAction', // This will call the method on the handler component specified
      icon: faGhost,
      color: 'red',
      label: "Ghost",
      tooltip: "Ghost tooltip"
    },

  },
  {
    id: "pathHidden",
    displayName: "Path",
    visible: false,
    source: entity => entity.path // Can be specified also as the string "path"
  }
];

export default class ListViewerShowcase extends React.Component {
   
  selectAction (param) {
    console.log(param);
    alert("select " + param);
  }
  render () {
    
    return [this.exampleDefault(), 
            this.exampleFilter(),
            this.exampleFull()]
  }


  exampleDefault () {
    return <div id="example-default">
      <h1>Simple example with default parameters</h1>
      <div >
        <ListViewer instances={instances} />
      </div>
    </div>;
  }

  exampleFilter () {
    return <div id="example-filter">
      <h1>Simple example with data filter</h1>
      <p>Here we are filtering all data to be of metaType "CompositeType"</p>
      <div>
        <ListViewer filter={row => row.metaType == 'CompositeType'} instances={instances} />
      </div>
    </div>;
  }

  exampleScroll () {
    return <div id="example-scroll">
      <h1>Simple example with infinite scroll</h1>
      <p>Here we are filtering all data to be of metaType "CompositeType"</p>
      <div style={{ height: "400px", width: "100%" }}>
        <ListViewer infiniteScroll={true} instances={instances} />
      </div>
    </div>;
  }

  exampleFull () {
    return <div id="example-filter">
      <h1>Example from example1.js</h1>
      <div style={{ height: "400px", width: "100%" }}>
        <ListViewer columnConfiguration={conf} filter={() => true} instances={instances} handler={this} infiniteScroll={true} />
      </div>;
    </div>
  }
}