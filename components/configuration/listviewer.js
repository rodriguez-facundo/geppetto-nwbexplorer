import { GroupComponent, IconComponent, LinkComponent, ImageComponent, ParameterInputComponent } from '../listviewer/ListViewer';

const conf = [
  {
    id: "path",
    title: "Path",
    source: instance => instance.path,
  },
  {
    id: "description",
    title: "Description",
    source: instance => 'TODO',
    configuration: {}
  },
  {
    id: "type",
    title: "Type",
    source: instance => instance.type,
    configuration: {}
  },
  {
    id: "controls",
    source: entity => entity,
    title: "Controls",
    customComponent: GroupComponent,
      
    configuration: [
      {
        id: "plot",
        customComponent: IconComponent,
        configuration: {
          action: 'clickShowPlot',
          icon: 'area-chart',
          label: "Plot",
          tooltip: "Plot time series"
        },
        visible: true // instance => instance.getVariable().getType().getName() == 'timeseries'
      },
    
    ]
  },
  
];

export default conf;