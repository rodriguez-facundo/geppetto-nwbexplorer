export const UPDATE_WIDGET = 'UPDATE_WIDGET';
export const ACTIVATE_WIDGET = 'ACTIVATE_WIDGET';
export const ADD_WIDGET = 'ADD_WIDGET';
export const RESET_LAYOUT = 'RESET_LAYOUT';
export const DESTROY_WIDGET = 'DESTROY_WIDGET';
export const ADD_PLOT_TO_EXISTING_WIDGET = 'ADD_PLOT_TO_EXISTING_WIDGET'

import { WidgetStatus } from '../components/constants';


export const showPlot = ({ path, type, color = 'red' }) => ({ 
  type: ADD_WIDGET,
  data: {
    id: 'plot@' + path, 
    instancePath: path,
    component: 'Plot', 
    type: type,
    name: path.split('.').slice(-1).pop(),
    status: WidgetStatus.ACTIVE,
    panelName: 'rightPanel',
    color: color,
    config: {}
  }
});

export const addToPlot = ({ hostId, instancePath, color, type }) => ({ 
  type: ADD_PLOT_TO_EXISTING_WIDGET,
  data: {
    hostId,
    instancePath,
    color,
    type
  }
});

export const showImg = ({ path, type }) => ({ 
  type: ADD_WIDGET,
  data: {
    id: 'img@' + path, 
    instancePath: path,
    component: 'Image', 
    type: type,
    name: path.split('.').slice(-1).pop(),
    status: WidgetStatus.ACTIVE,
    panelName: 'rightPanel',
    config: {}
  }
});


export const showList = (name, pathPattern, status = WidgetStatus.ACTIVE) => ({ 
  type: ADD_WIDGET,
  data: {
    id: 'list@' + pathPattern, 
    pathPattern: pathPattern, 
    component: 'NWBListViewer', 
    name: name,
    status: status,
    panelName: 'rightTop'
  }
});


export const newWidget = ({ path, component, panelName }) => ({ 
  type: ADD_WIDGET,
  data: {
    id: path, 
    instancePath: path, 
    component: component, 
    name: path.split('.').slice(-1).pop(),
    status: WidgetStatus.ACTIVE,
    panelName: panelName
  }
});

export const updateWidget = (newConf => ({ 
  type: UPDATE_WIDGET,
  data: newConf
}))


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

