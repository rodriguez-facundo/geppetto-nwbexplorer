import { connect } from 'react-redux';
import ErrorDialog from './ErrorDialog';
import { RESET_LAYOUT } from '../actions/flexlayout';
import { RECOVERED_FROM_ERROR, START_RECOVERY_FROM_ERROR } from '../actions/general';
import { UNLOAD_NWB_FILE_IN_NOTEBOOK, UNLOAD_NWB_FILE } from '../actions/nwbfile';

const mapStateToProps = state => ({ 
  error: state.general.error, 
  need2RecoverFromError: state.general.need2RecoverFromError
});

const mapDispatchToProps = dispatch => ({ 
  closeError: () => dispatch({ type: RECOVERED_FROM_ERROR }),
  resetFlexlayoutState: () => dispatch({ type: RESET_LAYOUT }),
  unloadNWBFile: () => {
    dispatch({ type: UNLOAD_NWB_FILE_IN_NOTEBOOK })
    dispatch({ type: UNLOAD_NWB_FILE });
  },
  startRecoveryFromError: () => dispatch({ type: START_RECOVERY_FROM_ERROR })
});

export default connect(mapStateToProps, mapDispatchToProps)(ErrorDialog);