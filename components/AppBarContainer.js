import { connect } from 'react-redux';
import Appbar from './AppBar';
import { unloadNWBFile, unloadNWBFileInNotebook } from '../actions/nwbfile';
import { enableInfoPanel, disableInfoPanel } from '../actions/general';
import { createWidget, deleteAll, changeDetailsWidgetInstancePath, RESET_LAYOUT } from '../actions/flexlayout';

const mapStateToProps = state => ({
  toggleInfoPanel: state.general.toggleInfoPanel,
  model: state.nwbfile.model
});

const mapDispatchToProps = dispatch => ({ 
  enableInfoPanel: () => dispatch(enableInfoPanel),
  disableInfoPanel: () => dispatch(disableInfoPanel),
  unloadNWBFile: () => {
    dispatch(unloadNWBFileInNotebook());
    dispatch(unloadNWBFile);
  },
  createWidget: json => dispatch(createWidget(json)),
  deleteAll: () => dispatch({ type: RESET_LAYOUT }),
  changeDetailsWidgetInstancePath: instancePath => dispatch(changeDetailsWidgetInstancePath(instancePath))
});

export default connect(mapStateToProps, mapDispatchToProps)(Appbar);