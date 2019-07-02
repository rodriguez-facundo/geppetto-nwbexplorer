export const UPDATE_WIDGET = 'UPDATE_WIDGET';
export const ACTIVATE_WIDGET = 'ACTIVATE_WIDGET';
export const ADD_WIDGET = 'ADD_WIDGET';
export const RESET_LAYOUT = 'RESET_LAYOUT';
export const DESTROY_WIDGET = 'DESTROY_WIDGET';


import { WidgetStatus } from '../components/constants';


export const showPlot = ({ path, type }) => ({ 
  type: UPDATE_WIDGET,
  data: {
    id: path.replace('.', '_'), 
    instancePath: path, 
    type, 
    component: 'Plot', 
    name: path.split('.').slice(-1).pop(),
    status: WidgetStatus.ACTIVE,
    panelName: 'rightPanel'
  }
});


export const newWidget = ({ path, type, component, panelName }) => ({ 
  type: UPDATE_WIDGET,
  data: {
    id: path.replace('.', '_'), 
    instancePath: path, 
    type, 
    component: component, 
    name: path.split('.').slice(-1).pop(),
    status: WidgetStatus.ACTIVE,
    panelName: panelName
  }
});


export const minimizeWidget = id => ({ 
  type: UPDATE_WIDGET,
  data: {
    id,
    status: WidgetStatus.MINIMIZED
  }
  
});

export const maximizeWidget = id => ({ 
  type: UPDATE_WIDGET,
  data: {
    id,
    status: WidgetStatus.MAXIMIZED
  }
});
export const activateWidget = id => ({ 
  type: ACTIVATE_WIDGET,
  data: { id }

});

export const updateDetailsWidget = path => ({ 
  type: UPDATE_WIDGET,
  data: { id: 'details', instancePath: path, status: WidgetStatus.ACTIVE }
});

export const destroyWidget = id => ({ 
  type: DESTROY_WIDGET,
  data: { id }
  
});

export const resetLayout = { type: RESET_LAYOUT, };

