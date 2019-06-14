import { connect } from 'react-redux';
import Flexy from './Flexy';
import { 
  activateWidget,
  destroyWidget,
  hideWidget,
  createWidget,
  maximizeWidget,
  changeDetailsWidgetInstancePath
} from '../actions/flexlayout';

const mapStateToProps = state => state.flexlayout;

const mapDispatchToProps = dispatch => ({ 
  hideWidget: id => dispatch(hideWidget(id)),
  destroyWidget: id => dispatch(destroyWidget(id)),
  maximizeWidget: id => dispatch(maximizeWidget(id)),
  activateWidget: id => dispatch(activateWidget(id)),
  createWidget: json => dispatch(createWidget(json)),
  changeDetailsWidgetInstancePath: instancePath => dispatch(changeDetailsWidgetInstancePath(instancePath))
});

export default connect(mapStateToProps, mapDispatchToProps)(Flexy);