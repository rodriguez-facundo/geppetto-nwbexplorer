
import Utils from '../Utils';


import nwbFileService from '../services/NWBFileService';

export const SET_NWB_FILE = 'SET_NWB_FILE';
export const LOAD_NWB_FILE = 'LOAD_NWB_FILE';
export const NWB_FILE_LOADED = 'NWB_FILE_LOADED';
export const UNLOAD_NWB_FILE = 'UNLOAD_NWB_FILE';
export const LOAD_NWB_FILE_IN_NOTEBOOK = 'LOAD_NWB_FILE_IN_NOTEBOOK';
export const LOADED_NWB_FILE_IN_NOTEBOOK = 'LOADED_NWB_FILE_IN_NOTEBOOK';
export const UNLOAD_NWB_FILE_IN_NOTEBOOK = 'UNLOAD_NWB_FILE_IN_NOTEBOOK';
export const CLEAR_MODEL = 'CLEAR_MODEL';

export function setNWBFile (nwbFileUrl) {
  return {
    type: SET_NWB_FILE,
    data: { nwbFileUrl: nwbFileUrl }
  }
}

export function loadNWBFile (nwbFileUrl) {
  GEPPETTO.CommandController.execute(`Project.loadFromURL("${nwbFileUrl}")`);
  return {
    type: LOAD_NWB_FILE,
    data: { nwbFileUrl: nwbFileUrl }
  }
}

export function loadNWBFileInNotebook (nwbFileUrl, dispatch) {
  nwbFileService.loadNWBFileInNotebook(nwbFileUrl).then(
    () => dispatch(loadedNWBFileInNotebook)
  );
  return { type: LOAD_NWB_FILE_IN_NOTEBOOK };
}


export const loadedNWBFileInNotebook = { type: LOADED_NWB_FILE_IN_NOTEBOOK };


export function unloadNWBFileInNotebook () {
  Utils.execPythonMessage('del nwbfile');
  return { type: UNLOAD_NWB_FILE_IN_NOTEBOOK, };
}

export const unloadNWBFile = { type: UNLOAD_NWB_FILE }

export function nwbFileLoaded (model) { 
  return {
    type: NWB_FILE_LOADED,
    data: { model: model.wrappedObj }
  }
}

export const clearModel = () => ({ type: CLEAR_MODEL })