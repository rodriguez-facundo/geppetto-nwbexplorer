import { 
  ADD_WIDGET,
  UPDATE_WIDGET,
  RESET_LAYOUT,
  DESTROY_WIDGET,
  ACTIVATE_WIDGET,
  showList
} from '../actions/flexlayout';

import { WidgetStatus } from '../components/constants';

const acquisitionWidget = showList('Acquisition', 'nwbfile.acquisition.').data;
const stimulusWidget = showList('Stimulus', 'nwbfile.stimulus.', WidgetStatus.HIDDEN).data;

function removeUndefined (obj) {
  return Object.keys(obj).forEach(key => obj[key] === undefined ? delete obj[key] : '');
}

export const FLEXLAYOUT_DEFAULT_STATUS = { 
  widgets: {
    'general': { 
      id: 'general', 
      name: 'General', 
      status: WidgetStatus.ACTIVE, 
      instancePath: 'nwbfile', 
      component: 'Metadata', 
      panelName: "leftPanel" ,
      enableClose: false
    },
    'details': { 
      id: 'details', 
      name: 'Details', 
      status: WidgetStatus.HIDDEN, 
      component: 'Metadata', 
      panelName: "leftPanel",
      enableClose: false
    },
    
    [acquisitionWidget.id]: acquisitionWidget ,
    [stimulusWidget.id]: stimulusWidget ,
    
  },

};

export default (state = FLEXLAYOUT_DEFAULT_STATUS, action) => {
  if (action.data) {
    removeUndefined(action.data); // Prevent deletion in case of unpolished update action
  }
  
  switch (action.type) {
    
  case ADD_WIDGET:
  case UPDATE_WIDGET: { 
    const newWidget = { ...state.widgets[action.data.id], panelName: extractPanelName(action), ...action.data, };
    return {
      ...state, widgets: { 
        ...updateWidgetStatus(state.widgets, newWidget), 
        [action.data.id]: newWidget 
      }
    } ;
  }

  case DESTROY_WIDGET:{
    const newWidgets = { ...state.widgets };
    delete newWidgets[action.data.id];
    return { ...state, widgets: newWidgets };
  }

  case ACTIVATE_WIDGET: { 
    const activatedWidget = state.widgets[action.data.id];
    if (state.widgets['details'].panelName == activatedWidget.panelName) {
      return state;
    }
    const newDetails = activatedWidget.instancePath
      ? {
        ...state.widgets['details'], 
        instancePath: state.widgets[action.data.id].instancePath 
      } : state.widgets['details']; // We always show the meta data of currently selected widget
    return {
      ...state, widgets: { 
        ...updateWidgetStatus(state.widgets, { panelName: state.widgets[action.data.id], status: WidgetStatus.ACTIVE }), 
        details: newDetails,
        [action.data.id]: { ...activatedWidget, status: WidgetStatus.ACTIVE }
      }
    }
  }

  case RESET_LAYOUT:
    return FLEXLAYOUT_DEFAULT_STATUS;
  
  default:
    return state
  }
}

function updateWidgetStatus (widgets, { status, panelName }) {
  if (status != WidgetStatus.ACTIVE) {
    return widgets;
  }
  return Object.fromEntries(Object.values(widgets).filter(widget => widget).map(widget => [
    widget.id,
    {
      ...widget,
      status: widget.panelName == panelName ? WidgetStatus.HIDDEN : widget.status
    }
  ]));
}

function extractPanelName (action) {
  return action.data.component == "Plot" ? "rightPanel" : "leftPanel";
}
