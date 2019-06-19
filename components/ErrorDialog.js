import React, { Component } from 'react'
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Collapsible from 'react-collapsible';

const NWB_FILE_NOT_FOUND_ERROR = 'NWBFileNotFound';
const MODULE_NOT_FOUND_ERROR = 'ModuleNotFoundError';

export default class ErrorDialog extends Component {

  componentDidUpdate (prevProps, prevState){
    const { error, need2RecoverFromError, closeError, resetFlexlayoutState, unloadNWBFile } = this.props;

    if (need2RecoverFromError && !prevProps.need2RecoverFromError){
      switch (error.ename) {
      
      case NWB_FILE_NOT_FOUND_ERROR:
        resetFlexlayoutState()
        unloadNWBFile();
        break;
       

      case MODULE_NOT_FOUND_ERROR:
        // TODO: handle nwbwidgets not found
        break;

      default:
        break;
      }
      closeError()
    }
  }
  render () {
    const { error, startRecoveryFromError } = this.props;
    
    return error 
      ? <Dialog
        open={true}
        disableBackdropClick
        disableEscapeKeyDown
        maxWidth="sm"
      >
        <DialogTitle>{error.ename}</DialogTitle>
        <DialogContent>
          <pre dangerouslySetInnerHTML={{ __html: IPython.utils.fixConsole(error.evalue) }}/>
          <Collapsible 
            style={{ marginTop: '15px' }} 
            open={false} 
            trigger="Details"
            triggerStyle={{ color: "grey" }}
          >
            <pre dangerouslySetInnerHTML={{ __html: IPython.utils.fixConsole(error.traceback) }}/>
          </Collapsible>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => startRecoveryFromError()} color="secondary" autoFocus variant="contained" >
              Ok
          </Button>
        </DialogActions>
      </Dialog>
      : <div/>
  }
}