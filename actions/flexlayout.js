export const DELETE_ALL = 'DELETE_ALL';
export const HIDE_WIDGET = 'HIDE_WIDGET';
export const DESTROY_WIDGET = 'DESTROY_WIDGET';
export const MAXIMIZE_WIDGET = 'MAXIMIZE_WIDGET';
export const ACTIVATE_WIDGET = 'ACTIVATE_WIDGET';
export const CHANGE_INSTANCE_PATH_OF_CURRENT_SELECTED_PLOT = 'CHANGE_INSTANCE_PATH_OF_CURRENT_SELECTED_PLOT';
export const CHANGE_DETAILS_WIDGET_INSTANCE_PATH = 'CHANGE_DETAILS_WIDGET_INSTANCE_PATH';
export const CREATE_WIDGET = 'CREATE_WIDGET';
export const CHANGE_TS_DATA_RETRIEVE_STATUS = 'CHANGE_TS_DATA_RETRIEVE_STATUS';

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

export const createWidget = jsonDescribingWidget => ({ 
  jsonDescribingWidget,
  type: CREATE_WIDGET
})

export const changeDetailsWidgetInstancePath = instancePath => ({ 
  instancePath,
  type: CHANGE_DETAILS_WIDGET_INSTANCE_PATH
})

export const changeInstancePathOfCurrentSelectedPlot = instancePath => ({ 
  instancePath,
  type: CHANGE_INSTANCE_PATH_OF_CURRENT_SELECTED_PLOT
})

export const changeTsDataRetrieveStatus = newStatus => ({
  newStatus,
  type: CHANGE_TS_DATA_RETRIEVE_STATUS
})

export const deleteAll = () => ({ type: DELETE_ALL })


export const TS_STATUS = {
  START: "START",
  PENDING: "PENDING",
  COMPLETED: "COMPLETED"
}