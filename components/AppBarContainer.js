import { connect } from 'react-redux';
import Appbar from './AppBar';
import { unloadNWBFile, unloadNWBFileInNotebook } from '../actions/nwbfile';
import { enableInfoPanel, disableInfoPanel } from '../actions/general';

import { showPlot, resetLayout } from '../actions/flexlayout';

const mapStateToProps = () => ({});

const mapDispatchToProps = dispatch => ({ 
  enableInfoPanel: () => dispatch(enableInfoPanel),
  disableInfoPanel: () => dispatch(disableInfoPanel),
  unloadNWBFile: () => {
    dispatch(unloadNWBFileInNotebook());
    dispatch(unloadNWBFile);
  },
  showPlot: instanceDescriptor => dispatch(showPlot(instanceDescriptor)),
  resetLayout: () => dispatch(resetLayout)
});

export default connect(mapStateToProps, mapDispatchToProps)(Appbar);