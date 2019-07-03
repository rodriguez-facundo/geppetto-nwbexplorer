import { GroupComponent, IconComponent, LinkComponent, ImageComponent, ParameterInputComponent } from "../listviewer/ListViewer";

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
        customComponent: IconComponent,
        configuration: {
          action: "clickShowPlot",
          icon: "area-chart",
          label: "Plot",
          tooltip: "Plot time series",
          condition: entity => entity.get('type') == 'timeseries'
        },
      },
    ]
  },
  
];

export default conf;