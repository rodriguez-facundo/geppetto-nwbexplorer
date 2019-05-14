export function setNWBFileAction (nwbFileUrl){
  return {
    type: "setnwbfile",
    payload: { nwbFileUrl: nwbFileUrl, loading: false }
  };
}

export function loadNWBFileAction (nwbFileUrl){
  GEPPETTO.CommandController.execute('Project.loadFromURL("' + nwbFileUrl + '")');
  return {
    type: "loadnwbfile",
    payload: { nwbFileUrl: nwbFileUrl, loading: 'Loading nwb file', nwbFileLoading: true }
  };
}

export function nwbFileLoadedAction (model){

  return {
    type: "nwbfileloaded",
    payload: { model: model, loading: false, nwbFileLoading: false }
  };
}

