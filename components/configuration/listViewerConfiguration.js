import { GroupComponent, IconComponent, ColorComponent } from "geppetto-client/js/components/interface/listViewer/ListViewer";
import { FILEVARIABLE_LENGTH } from '../constants';
``
const conf = [
  {
    id: "path",
    title: "Path",
    source: ({ path }) => path.slice(FILEVARIABLE_LENGTH),
  },
  {
    id: "type",
    title: "Type",
    source: "type"
  },
  {
    id: "description",
    title: "Description",
    source: ({ path }) => path.slice(FILEVARIABLE_LENGTH),
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
      }
    ]
  },
  
];

export default conf;