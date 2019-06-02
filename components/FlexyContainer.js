import { connect } from 'react-redux';
import Flexy from './Flexy';
import { 
  activateNode,
  destroyNode,
  hideNode,
  createNode,
  maximizeNode,
} from '../actions/flexlayout';

const mapStateToProps = state => ({ 
  nodes: state.flexlayout.nodes, 
  newNode: state.flexlayout.newNode
});

const mapDispatchToProps = dispatch => ({ 
  hideNode: id => dispatch(hideNode(id)),
  destroyNode: id => dispatch(destroyNode(id)),
  maximizeNode: id => dispatch(maximizeNode(id)),
  activateNode: id => dispatch(activateNode(id)),
  createNode: json => dispatch(createNode(json)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Flexy);