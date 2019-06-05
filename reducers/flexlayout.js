import { 
  ACTIVATE_NODE,
  DESTROY_NODE,
  HIDE_NODE,
  CREATE_NODE,
  MAXIMIZE_NODE,
  DELETE_ALL,
  CHANGE_INFO
} from '../actions/flexlayout';

export const FLEXLAYOUT_DEFAULT_STATUS = { 
  nodes: [],
  descriptionTabInstancePath: 'empty',
  newNode: false
};


/*
 * status could be one of:
 *  - ACTIVE:     the user can see the tab content.
 *  - HIDED:       the tab is minimized, or other tab in the node is currently selected.
 *  - DESTROYED:  the tab was deleted from flexlayout.
 *  - MAXIMIZED:  the tab is maximized (only one tab can be maximized simultaneously)
 */
const newTabNode = id => ({
  id,
  status: "ACTIVE"
})


export default (state = FLEXLAYOUT_DEFAULT_STATUS, action) => {
  // clone nodes
  const nodes = state.nodes.map(node => ({ ...node }))
  // find node
  const node = nodes.find(node => node.id == action.id)
  
  let descriptionTabInstancePath = state.descriptionTabInstancePath;
  let newNode = false;
  
  switch (action.type) {
    
  case ACTIVATE_NODE:
    if (node){
      node.status = "ACTIVE"
    } else {
      nodes.push(newTabNode(action.id))
    }
    break;
  
  case DESTROY_NODE:
    node.status = "DESTROYED"
    break;
  
  case HIDE_NODE:
    node.status = "HIDED"
    break;
  
  case MAXIMIZE_NODE:
    node.status = "MAXIMIZED"
    break;

  case CREATE_NODE:
    newNode = action.json
    break;

  case CHANGE_INFO:
    descriptionTabInstancePath = action.instancePath;
    break;
  
  case DELETE_ALL:
    return FLEXLAYOUT_DEFAULT_STATUS
  
  }
  
  return { nodes, newNode, descriptionTabInstancePath }
}