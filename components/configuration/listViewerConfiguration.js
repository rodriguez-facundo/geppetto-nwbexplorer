import React from 'react';
import { GroupComponent, IconComponent, ColorComponent } from "geppetto-client/js/components/interface/listViewer/ListViewer";
import AddPlotMenuConnect from '../reduxconnect/AddPlotMenuConnect';

const AddToPlotComponent = ({ icon, label, action, tooltip }) => ({ value }) => (
  <AddPlotMenuConnect 
    icon={icon}  
    action={action} 
    instancePath={value.path}
  />
)

const conf = [
  {
    id: "path",
    title: "Path",
    source: "path",
  },
  {
    id: "type",
    title: "Type",
    source: "type"
  },
  {
    id: "description",
    title: "Description",
    source: "description",
  },
  
  {
    id: "controls",
    title: "Controls",
    customComponent: GroupComponent,
      
    configuration: [
      {
        id: "showdetails",
        customComponent: IconComponent,
        configuration: {
          action: "clickShowDetails",
          icon: "info-circle",
          label: "Show details",
          tooltip: "Show details",
        },
      },
      {
        id: "plot",
        customComponent: ColorComponent,
        visible: entity => entity.type === 'timeseries',
        source: entity => entity,
        configuration: {
          action: "clickShowPlot",
          icon: "area-chart",
          label: "Plot",
          tooltip: "Plot time series",
          defaultColor: entity => entity.color,
          
        },
      },
      {
        id: "image",
        customComponent: IconComponent,
        visible: entity => entity.type === 'imageseries',
        source: entity => entity,
        configuration: {
          action: "clickShowImg",
          icon: "picture-o",
          label: "Plot",
          tooltip: "Plot image series"
        },
      },
      {
        id: "addToPlot",
        customComponent: AddToPlotComponent,
        visible: entity => entity.type === 'timeseries',
        configuration: {
          icon: "gpt-addplot",
          action: "clickAddToPlot",
          label: "Add Plot",
          tooltip: "Add plot",
        }
      }
    ]
  },
  
];

export default conf;