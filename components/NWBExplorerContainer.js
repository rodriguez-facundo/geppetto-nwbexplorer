import { connect } from 'react-redux';
import NWBExplorer from './NWBExplorer';
import { unloadNWBFile, unloadNWBFileInNotebook } from '../actions/creators/nwbfile';
import { toggleInfoPanel } from '../actions/creators/general';

const mapStateToProps = state => ({
  toggleInfoPanel: state.general.toggleInfoPanel,
  model: state.nwbfile.model
});

const mapDispatchToProps = dispatch => ({ 
  toggleInfoPanel: () => dispatch(toggleInfoPanel(dispatch)),
  unloadNWBFile: () => {
    dispatch(unloadNWBFileInNotebook());
    dispatch(unloadNWBFile())
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(NWBExplorer);