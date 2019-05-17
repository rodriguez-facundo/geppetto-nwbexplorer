import * as accions from '../actions/nwbfile';
import * as TYPES from '../actions/creators/nwbfile';

export default ( state = {}, action ) => {
  
  switch (action.type) {
    
  case TYPES.SET_NWB_FILE:
    return { ...accions.setNWBFile(state, action) }
  
  case TYPES.LOAD_NWB_FILE:
    return { ...accions.loadNWBFile(state, action) }
  
  case TYPES.NWB_FILE_LOADED:
    return { ...accions.nwbFileLoaded(state, action) }
  
  case TYPES.UNLOAD_NWB_FILE:
    return { ...accions.unloadNWBFile(state, action) }

  case TYPES.LOAD_NOTEBOOK:
    return { ...accions.loadNotebook(state, action) }
  
  case TYPES.NOTEBOOK_READY:
    return { ...accions.notebookReady(state, action) }

  case TYPES.LOAD_NWB_FILE_IN_NOTEBOOK:
    return { ...accions.loadNWBFileInNotebook(state, action) }

  case TYPES.LOADED_NWB_FILE_IN_NOTEBOOK:
    return { ...accions.loadedNWBFileInNotebook(state, action) }

  case TYPES.UNLOAD_NWB_FILE_IN_NOTEBOOK:
    return { ...accions.unloadNWBFileInNotebook(state, action) }

  default:
    return { ...state };
  }
}