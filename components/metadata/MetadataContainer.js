import { connect } from 'react-redux';
import Metadata from './Metadata';
import { enableInfoPanel, disableInfoPanel } from '../../actions/general';
import { unloadNWBFile, unloadNWBFileInNotebook } from '../../actions/nwbfile';


const mapStateToProps = (state, ownProps) => ({ 
  instancePath: ownProps.instancePath,
  model: state.nwbfile.model
});

const mapDispatchToProps = dispatch => ({});

export default connect(mapStateToProps, mapDispatchToProps)(Metadata);