import { 
  ACTIVATE_WIDGET,
  DESTROY_WIDGET,
  HIDE_WIDGET,
  CREATE_WIDGET,
  MAXIMIZE_WIDGET,
  DELETE_ALL,
  CHANGE_DETAILS_WIDGET_INSTANCE_PATH
} from '../actions/flexlayout';

export const FLEXLAYOUT_DEFAULT_STATUS = { 
  widgets: [],
  detailsWidgetInstancePath: 'empty',
  newWidget: false
};


/*
 * status could be one of:
 *  - ACTIVE:     the user can see the tab content.
 *  - HIDDEN:       the tab is minimized, or other tab in the node is currently selected.
 *  - DESTROYED:  the tab was deleted from flexlayout.
 *  - MAXIMIZED:  the tab is maximized (only one tab can be maximized simultaneously)
 */
const createNewWidgetState = id => ({
  id,
  status: "ACTIVE"
})


export default (state = FLEXLAYOUT_DEFAULT_STATUS, action) => {
  // clone widgets
  const widgets = state.widgets.map(widget => ({ ...widget }))
  // find widget
  const widget = widgets.find(widget => widget.id == action.id)
  
  let newWidget = false;
  let detailsWidgetInstancePath = state.detailsWidgetInstancePath;
  
  
  switch (action.type) {
    
  case ACTIVATE_WIDGET:
    if (widget){
      widget.status = "ACTIVE"
    } else {
      widgets.push(createNewWidgetState(action.id))
    }
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

  case CREATE_WIDGET:
    newWidget = action.json
    break;

  case CHANGE_DETAILS_WIDGET_INSTANCE_PATH:
    detailsWidgetInstancePath = action.instancePath;
    break;
  
  case DELETE_ALL:
    return FLEXLAYOUT_DEFAULT_STATUS
  
  }
  
  return { widgets, newWidget, detailsWidgetInstancePath }
}