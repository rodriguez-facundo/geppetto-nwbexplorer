
import Utils from '../Utils';
import { loadedNWBFileInNotebook as loadedNWBFileInNotebookCreator } from './creators/nwbfile';

import nwbFileService from '../services/NWBFileService';

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

/*
 * reducers cannot be async. Moving this line to func level
 * action.dispatch(unloadNWBFileInNotebookCreator());
 */
export const unloadNWBFile = (nwbFilesSate, action) => ({
  ...nwbFilesSate,
  nwbFileUrl: null, 
  model: null
})


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


