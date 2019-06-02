import { 
  ACTIVATE_NODE,
  DESTROY_NODE,
  MAXIMIZE_NODE,
  MINIMIZE_NODE
} from '../actions/flexlayout';

export const FLEXLAYOUT_DEFAULT_STATUS = { nodes: [] };

const newNode = id => ({
  id,
  status: "ACTIVE"
})


export default (state = FLEXLAYOUT_DEFAULT_STATUS, action) => {
  // clone nodes
  const nodes = state.nodes.map(node => ({ ...node }))
  // find node
  const node = nodes.find(node => node.id == action.id)
  
  switch (action.type) {
    
  case ACTIVATE_NODE:
    if (node){
      node.status = "ACTIVE"
    } else {
      nodes.push(newNode(action.id))
    }
    break;
  
  case DESTROY_NODE:
    node.status = "DESTROYED"
    break;
  
  case MAXIMIZE_NODE:
    node.status = "MAXIMIZED"
    break;
  
  case MINIMIZE_NODE:
    node.status = "MINIMIZED"
    break;
  }

  return { nodes }
}