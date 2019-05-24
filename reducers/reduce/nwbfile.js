
import Utils from '../../Utils';
import { loadedNWBFileInNotebook as loadedNWBFileInNotebookCreator } from '../../actions/creators/nwbfile';

import nwbFileService from '../../services/NWBFileService';

export const loadNotebook = (nwbFilesSate, action) => ({
  ...nwbFilesSate,
  loading: 'Initializing notebook', 
  showNotebook: true, 
  notebookReady: false
})

export const notebookReady = (nwbFilesSate, action) => {
  // action.dispatch is available
  Utils.execPythonMessage('from nwb_explorer.nwb_main import main');
  return {
    ...nwbFilesSate,
    loading: false, 
    notebookReady: true, 
    isLoadingInNotebook: false
  };
}

export const unloadNWBFileInNotebook = (nwbFilesSate, action) => {
  Utils.execPythonMessage('del nwbfile');
  return {
    ...nwbFilesSate,
    isLoadedInNotebook: false
  };
}

/*
 * function dependenciesLoadedAction (){
 *   return {
 *     type: "notebookdependenciesloaded",
 *     payload: { notebookReady: true }
 *   };
 * }
 */

export const loadedNWBFileInNotebook = (nwbFilesSate, value) => ({
  ...nwbFilesSate,
  loading: false,
  isLoadedInNotebook: true,
  isLoadingInNotebook: false
})

export const loadNWBFileInNotebook = (nwbFilesSate, action) => {
  nwbFileService.loadNWBFileInNotebook(action.nwbFileUrl).then(
    () => action.dispatch(loadedNWBFileInNotebookCreator())
  );
  return {
    ...nwbFilesSate,
    isLoadedInNotebook: false, 
    isLoadingInNotebook: true,
    loading: 'Loading file in notebook'
  };
}

// ------------------------------------------------------------------------------------ //

export const setNWBFile = (nwbFilesSate, action) => ({
  ...nwbFilesSate,
  nwbFileUrl: action.nwbFileUrl, 
  loading: false
})

export const unloadNWBFile = async (nwbFilesSate, action) => {
  let controller

  Object.values(action.widgetTypes).forEach(async wtype => {
    controller = await GEPPETTO.WidgetFactory.getController(wtype)
    controller.getWidgets().forEach(w => w.destroy())
  })
  
  return {
    ...nwbFilesSate,
    nwbFileUrl: null, 
    model: null
  }
}


export const loadNWBFile = (nwbFilesSate, action) => {
  GEPPETTO.CommandController.execute(`Project.loadFromURL("${action.nwbFileUrl}")`);
  return {
    ...nwbFilesSate,
    nwbFileLoading: true,
    loading: 'Loading nwb file',
    nwbFileUrl: action.nwbFileUrl
  };
}

export const nwbFileLoaded = (nwbFilesSate, action) => ({
  ...nwbFilesSate,
  loading: false,
  model: action.model,
  nwbFileLoading: false
})


