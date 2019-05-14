import nwbFileService from '../services/NWBFileService';
import Utils from '../Utils';
export function loadNotebookAction (){

  return {
    type: "loadnotebook",
    payload: { loading: 'Initializing notebook', showNotebook: true, notebookReady: false }
  };
}

export function notebookReadyAction (dispatch){
  Utils.execPythonMessage('from nwb_explorer.nwb_main import main');
  return {
    type: "notebookready",
    payload: { loading: false, notebookReady: true, isLoadingInNotebook: false }
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

export function loadNWBFileInNotebookAction (nwbFileUrl, dispatch){
  nwbFileService.loadNWBFileInNotebook(nwbFileUrl).then(
    () => dispatch(nWBFileLoadedInNotebookAction())
  );
  return {
    type: "nwbfileloadinnotebook",
    payload: { isLoadedInNotebook: false, isLoadingInNotebook: true, loading: 'Loading file in notebook' }
  };
}


export function nWBFileLoadedInNotebookAction (){

  return {
    type: "nwbfileloadedinnotebook",
    payload: { isLoadedInNotebook: true, isLoadingInNotebook: false, loading: false }
  };
}

