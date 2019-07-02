import { 
  ADD_WIDGET,
  UPDATE_WIDGET,
  RESET_LAYOUT,
  DESTROY_WIDGET,
  ACTIVATE_WIDGET
} from '../actions/flexlayout';

import { WidgetStatus } from '../components/constants';

export const FLEXLAYOUT_DEFAULT_STATUS = { 
  widgets: {
    'details': { id: 'details', name: 'Details', component: 'Metadata', panelName: "leftPanel" }, 
    'general': { id: 'general', name: 'General', status: WidgetStatus.ACTIVE, instancePath: 'nwbfile.general', component: 'Metadata', panelName: "leftPanel" },
  },

};

export default (state = FLEXLAYOUT_DEFAULT_STATUS, action) => {

  switch (action.type) {
    
  case ADD_WIDGET:
  case UPDATE_WIDGET: { 
    const newWidget = { ...state.widgets[action.data.id], panelName: extractPanelName(action), ...action.data, };
    return {
      ...state, widgets: { 
        ...Object.fromEntries(Object.values(state.widgets).map(widget => [
          widget.id, 
          {
            ...widget, 
            status: widget.panelName == newWidget.panelName && newWidget.status == WidgetStatus.ACTIVE ? WidgetStatus.HIDDEN : widget.status // Other tabs in the panel must be hidden
          }
        ])), 
        [action.data.id]: newWidget 
      }
    } ;
  }
  case DESTROY_WIDGET:
    return {
      ...state, widgets: { 
        ...state.widgets, 
        [action.data.id]: undefined
      }
    }
  case ACTIVATE_WIDGET: 
    return {
      ...state, widgets: { 
        ...state.widgets, 
        details: { ...state.widgets['details'], instancePath: state.widgets[action.data.id].instancePath },
        [action.data.id]: { ...state.widgets[action.data.id], status: WidgetStatus.ACTIVE }
      }
    }
  
  case RESET_LAYOUT:
    return FLEXLAYOUT_DEFAULT_STATUS;
  
  default:
    return state
  }
}

function extractPanelName (action) {
  return action.data.component == "Plot" ? "rightPanel" : "leftPanel";
}
