export const ACTIVATE_NODE = 'ACTIVATE_NODE';
export const DESTROY_NODE = 'DESTROY_NODE';
export const HIDE_NODE = 'HIDE_NODE';
export const MAXIMIZE_NODE = 'MAXIMIZE_NODE';
export const DELETE_ALL = 'DELETE_ALL';
export const CHANGE_INFO = 'CHANGE_INFO';

export const CREATE_NODE = "CREATE_NODE"

export const activateNode = id => ({
  id,
  type: ACTIVATE_NODE
})

export const destroyNode = id => ({ 
  id,
  type: DESTROY_NODE 
})

export const hideNode = id => ({ 
  id,
  type: HIDE_NODE
})

export const maximizeNode = id => ({ 
  id,
  type: MAXIMIZE_NODE
})

export const createNode = json => ({ 
  json,
  type: CREATE_NODE
})

/*
 * Change description information.
 */
export const changeDescriptionTabContent = instancePath => ({ 
  instancePath,
  type: CHANGE_INFO
})

export const deleteAll = () => ({ type: DELETE_ALL })
