import { connect } from 'react-redux';
import Appbar from './AppBar';
import { unloadNWBFile, unloadNWBFileInNotebook } from '../actions/nwbfile';

import { showPlot, resetLayout } from '../actions/flexlayout';

const mapStateToProps = () => ({});

const mapDispatchToProps = dispatch => ({ 
  exit: () => {
    dispatch(unloadNWBFileInNotebook());
    dispatch(unloadNWBFile);
    dispatch(resetLayout)
  },
  showPlot: instanceDescriptor => dispatch(showPlot(instanceDescriptor)),
  resetLayout: () => dispatch(resetLayout)
});

export default connect(mapStateToProps, mapDispatchToProps)(Appbar);