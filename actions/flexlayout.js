export const ACTIVATE_NODE = 'ACTIVATE_NODE';
export const DESTROY_NODE = 'DESTROY_NODE';
export const MAXIMIZE_NODE = 'MAXIMIZE_NODE';
export const MINIMIZE_NODE = 'MINIMIZE_NODE';

export const activateNode = id => ({
  id,
  type: ACTIVATE_NODE
})

export const destroyNode = id => ({ 
  id,
  type: DESTROY_NODE 
})

export const maximizeNode = id => ({ 
  id,
  type: MAXIMIZE_NODE
})

export const minimizeNode = id => ({ 
  id,
  type: MINIMIZE_NODE
})

