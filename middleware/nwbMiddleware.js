import nwbFileService from '../services/NWBFileService';
import Utils from '../Utils';

import {
  LOAD_NWB_FILE, LOAD_NWB_FILE_IN_NOTEBOOK, NWB_FILE_LOADED, UNLOAD_NWB_FILE_IN_NOTEBOOK,
  loadedNWBFileInNotebook, loadNWBFileInNotebook 
} from '../actions/nwbfile';


import { NOTEBOOK_READY } from '../actions/notebook';

const nwbMiddleware = store => next => action => {
  switch (action.type) {
  case LOAD_NWB_FILE:
    GEPPETTO.CommandController.execute(`Project.loadFromURL("${action.data.nwbFileUrl}")`);
    break;

  case NWB_FILE_LOADED:
    store.dispatch(loadNWBFileInNotebook);
    break;
  case LOAD_NWB_FILE_IN_NOTEBOOK:
    nwbFileService.loadNWBFileInNotebook(store.getState().nwbfile.nwbFileUrl).then(
      () => store.dispatch(loadedNWBFileInNotebook)
    );
    break;
  case UNLOAD_NWB_FILE_IN_NOTEBOOK:
    Utils.execPythonMessage('del nwbfile');
    break;
  
  case NOTEBOOK_READY:
    // FIXME for some reason the callback for python messages is not being always called
    Utils.execPythonMessage('from nwb_explorer.nwb_main import main');
    break;
  }
  next(action);
}


export default nwbMiddleware;