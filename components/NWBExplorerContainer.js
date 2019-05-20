import { connect } from 'react-redux';
import NWBExplorer from './NWBExplorer';
import { unloadNWBFile, unloadNWBFileInNotebook } from '../actions/creators/nwbfile';
import { toggleInfoPanel } from '../actions/creators/general';

const mapStateToProps = state => ({
  toggleInfoPanel: state.general.toggleInfoPanel,
  model: state.nwbfile.model
});

const mapDispatchToProps = dispatch => ({ 
  toggleInfoPanel: () => dispatch(toggleInfoPanel()),
  unloadNWBFile: widgetTypes => {
    dispatch(unloadNWBFileInNotebook());
    dispatch(unloadNWBFile(widgetTypes))
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(NWBExplorer);