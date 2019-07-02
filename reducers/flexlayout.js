import { 
  SHOW_WIDGET,
  RESET_LAYOUT,
} from '../actions/flexlayout';


export const FLEXLAYOUT_DEFAULT_STATUS = { 
  widgets: {
    'details': { id: 'details', name: 'Details', component: 'Metadata', status: 'HIDDEN', panelName: "leftPanel" }, 
    'general': { id: 'general', name: 'General', instancePath: 'nwbfile.general', component: 'Metadata', panelName: "leftPanel" },
  },

};

export default (state = FLEXLAYOUT_DEFAULT_STATUS, action) => {

  switch (action.type) {
    
  case SHOW_WIDGET: { 
    const newWidget = { ...state.widgets[action.data.id], panelName: extractPanelName(action), ...action.data, };
    return {
      ...state, widgets: { 
        ...Object.fromEntries(Object.values(state.widgets).map(widget => 
          ([widget.id,
            {
              ...widget , 
              status: widget.panelName == newWidget.panelName ? 'HIDDEN' : widget.status // only one tab active per panel
            }]))), 
        [action.data.id]: newWidget 
      }
    } ;
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
