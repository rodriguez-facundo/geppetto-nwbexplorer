import { connect } from 'react-redux';
import Flexy from './Flexy';
import { 
  activateNode,
  destroyNode,
  maximizeNode,
  minimizeNode,
} from '../actions/flexlayout';

const mapStateToProps = state => ({ nodes: state.flexlayout.nodes, });

const mapDispatchToProps = dispatch => ({ 
  activateNode: id => dispatch(activateNode(id)),
  destroyNode: id => dispatch(destroyNode(id)),
  maximizeNode: id => dispatch(maximizeNode(id)),
  minimizeNode: id => dispatch(minimizeNode(id))
});

export default connect(mapStateToProps, mapDispatchToProps)(Flexy);