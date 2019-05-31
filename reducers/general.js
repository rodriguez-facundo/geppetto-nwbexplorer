import { ENABLE_INFO_PANEL, DISABLE_INFO_PANEL } from '../actions/general';
import * as nwbfileActions from '../actions/nwbfile';
import * as notebookActions from '../actions/notebook';

function isEmbeddedInIframe () {
  return window.location !== window.parent.location;
}

export const GENERAL_DEFAULT_STATUS = { 
  embedded: isEmbeddedInIframe(),
  toggleInfoPanel: false,
  loading: false,
};

export default ( state = {}, action ) => ({ 
  ...state, 
  ...reduceGeneral(state, action) 
});

function reduceGeneral (state, action) {
  switch (action.type) {
  case ENABLE_INFO_PANEL:
    return { toggleInfoPanel: true } 
  case DISABLE_INFO_PANEL:
    return { toggleInfoPanel: false } 
  case nwbfileActions.LOAD_NWB_FILE:
    return { loading: 'Loading NWB file' }
  case nwbfileActions.LOAD_NWB_FILE_IN_NOTEBOOK: 
    return { loading: 'Loading NWB file into Python notebook' }
  case notebookActions.LOAD_NOTEBOOK:
    return {
      loading: 'Initializing Python notebook', 
      showNotebook: true, 
      notebookReady: false
    }
  case nwbfileActions.UNLOAD_NWB_FILE:
  case nwbfileActions.NWB_FILE_LOADED:
  case nwbfileActions.SET_NWB_FILE:
  case notebookActions.NOTEBOOK_READY:
  case nwbfileActions.LOADED_NWB_FILE_IN_NOTEBOOK:
    return { loading: false };
  default:
    return state;
  }

}


