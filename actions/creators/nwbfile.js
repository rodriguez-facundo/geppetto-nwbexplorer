export const SET_NWB_FILE = 'SET_NWB_FILE';
export const LOAD_NWB_FILE = 'LOAD_NWB_FILE';
export const NWB_FILE_LOADED = 'NWB_FILE_LOADED';
export const UNLOAD_NWB_FILE = 'UNLOAD_NWB_FILE';

export const setNWBFile = nwbFileUrl => ({ 
  type: SET_NWB_FILE,
  nwbFileUrl
});

export const unloadNWBFile = widgetTypes => ({ 
  type: UNLOAD_NWB_FILE,
  widgetTypes
});

export const nwbFileLoaded = model => ({ 
  type: NWB_FILE_LOADED,
  model
});

export const loadNWBFile = nwbFileUrl => ({ 
  type: LOAD_NWB_FILE, 
  nwbFileUrl 
});

// ------------------------------------------------------------------------------------- //

export const LOAD_NOTEBOOK = 'LOAD_NOTEBOOK';
export const NOTEBOOK_READY = 'NOTEBOOK_READY';
export const LOAD_NWB_FILE_IN_NOTEBOOK = 'LOAD_NWB_FILE_IN_NOTEBOOK';
export const LOADED_NWB_FILE_IN_NOTEBOOK = 'LOADED_NWB_FILE_IN_NOTEBOOK';
export const UNLOAD_NWB_FILE_IN_NOTEBOOK = 'UNLOAD_NWB_FILE_IN_NOTEBOOK';

export const loadNotebook = () => ({ type: LOAD_NOTEBOOK });

export const notebookReady = () => ({ type: NOTEBOOK_READY });

export const loadedNWBFileInNotebook = () => ({ type: LOADED_NWB_FILE_IN_NOTEBOOK });

export const unloadNWBFileInNotebook = () => ({ type: UNLOAD_NWB_FILE_IN_NOTEBOOK });

export const loadNWBFileInNotebook = (nwbFileUrl, dispatch) => ({ 
  type: LOAD_NWB_FILE_IN_NOTEBOOK,
  nwbFileUrl,
  dispatch
});
