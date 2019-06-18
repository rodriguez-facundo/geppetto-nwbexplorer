export const RESET_LAYOUT = 'RESET_LAYOUT';
export const HIDE_WIDGET = 'HIDE_WIDGET';
export const DESTROY_WIDGET = 'DESTROY_WIDGET';
export const MAXIMIZE_WIDGET = 'MAXIMIZE_WIDGET';
export const ACTIVATE_WIDGET = 'ACTIVATE_WIDGET';

export const CHANGE_DETAILS_WIDGET_INSTANCE_PATH = 'CHANGE_DETAILS_WIDGET_INSTANCE_PATH';

export const CREATE_WIDGET = "CREATE_WIDGET"

export const activateWidget = id => ({
  id,
  type: ACTIVATE_WIDGET
})

export const destroyWidget = id => ({ 
  id,
  type: DESTROY_WIDGET 
})

export const hideWidget = id => ({ 
  id,
  type: HIDE_WIDGET
})

export const maximizeWidget = id => ({ 
  id,
  type: MAXIMIZE_WIDGET
})

export const createWidget = json => ({ 
  json,
  type: CREATE_WIDGET
})

export const changeDetailsWidgetInstancePath = instancePath => ({ 
  instancePath,
  type: CHANGE_DETAILS_WIDGET_INSTANCE_PATH
})
