import { 
  ACTIVATE_WIDGET,
  DESTROY_WIDGET,
  HIDE_WIDGET,
  CREATE_WIDGET,
  MAXIMIZE_WIDGET,
  RESET_LAYOUT,
  CHANGE_DETAILS_WIDGET_INSTANCE_PATH,
  CHANGE_INSTANCE_PATH_OF_CURRENT_SELECTED_PLOT,
  CHANGE_TS_DATA_RETRIEVE_STATUS,
  REQUEST_DATA_RETRIEVE,
  START_DATA_RETRIEVE,
  FINISH_DATA_RETRIEVE,
  TS_STATUS,
  FINISH_WIDGET_CREATION,
} from '../actions/flexlayout';

/*
 * status could be one of:
 *  - ACTIVE:     the user can see the tab content.
 *  - HIDDEN:       the tab is minimized, or other tab in the node is currently selected.
 *  - DESTROYED:  the tab was deleted from flexlayout.
 *  - MAXIMIZED:  the tab is maximized (only one tab can be maximized simultaneously)
 */
const createNewWidgetState = ({ id, name, component = 'Plot', instancePath = '', status = 'ACTIVE' }) => ({
  id,
  name,
  status,
  component,
  type: "tab",
  enableRename: false,
  // attr defined inside config, will also be available from within flexlayout nodes.  For example:  node.getNodeById(id).getConfig()
  config: { instancePath, panel: component == "Plot" ? "rightPanel" : "leftPanel" },
})


export const FLEXLAYOUT_DEFAULT_STATUS = { 
  widgets: [
    createNewWidgetState({ id: 'general', name: 'General', component: 'General' }),
    createNewWidgetState({ id: 'details', name: 'Details', component: 'details', status: 'HIDDEN' }), 
  ],
  detailsWidgetInstancePath: 'empty',
  newWidgetDescriptor: false,
  currentSelectedPlotInstancePath: 'empty',
  timeseriesDataRetrieveStatus: 'COMPLETED'
};

export default (state = FLEXLAYOUT_DEFAULT_STATUS, action) => {
  // clone widgets
  const widgets = state.widgets.map(widget => ({ ...widget }))
  // find widget
  let widget = widgets.find(widget => widget.id == action.id)
  
  let newWidgetDescriptor = false;
  let detailsWidgetInstancePath = state.detailsWidgetInstancePath;
  let currentSelectedPlotInstancePath = state.currentSelectedPlotInstancePath;
  let timeseriesDataRetrieveStatus = state.timeseriesDataRetrieveStatus;
  
  switch (action.type) {
    
  case ACTIVATE_WIDGET:
    widget.status = "ACTIVE"
    break;
  
  case DESTROY_WIDGET:
    widget.status = "DESTROYED"
    break;
  
  case HIDE_WIDGET:
    widget.status = "HIDDEN"
    break;
  
  case MAXIMIZE_WIDGET:
    widget.status = "MAXIMIZED"
    break;

  case CREATE_WIDGET: {
    if (action.jsonDescribingWidget) {
      newWidgetDescriptor = createNewWidgetState(action.jsonDescribingWidget);
      widget = widgets.find(widget => widget.id == action.jsonDescribingWidget.id);

      if (widget) {
        widget.status = 'ACTIVE'
      } else {
        widgets.push(newWidgetDescriptor)
      }
      
    }
    break
  }

  case FINISH_WIDGET_CREATION:
    // set back newWidgetDescriptor to false
    break;

  case CHANGE_DETAILS_WIDGET_INSTANCE_PATH:
    detailsWidgetInstancePath = action.instancePath;
    break;

  case CHANGE_INSTANCE_PATH_OF_CURRENT_SELECTED_PLOT:
    currentSelectedPlotInstancePath = action.instancePath;
    break;

  case CHANGE_TS_DATA_RETRIEVE_STATUS:
    timeseriesDataRetrieveStatus = action.newStatus;
    break;

  case REQUEST_DATA_RETRIEVE:
    timeseriesDataRetrieveStatus = TS_STATUS.START
    break;
  
  case START_DATA_RETRIEVE:
    timeseriesDataRetrieveStatus = TS_STATUS.PENDING
    break;
  
  case FINISH_DATA_RETRIEVE:
    timeseriesDataRetrieveStatus = TS_STATUS.COMPLETED
    break;


  case RESET_LAYOUT:
    return FLEXLAYOUT_DEFAULT_STATUS
  }
  
  return { widgets, newWidgetDescriptor, detailsWidgetInstancePath, currentSelectedPlotInstancePath, timeseriesDataRetrieveStatus }
}