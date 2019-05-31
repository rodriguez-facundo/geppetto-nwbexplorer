import Utils from '../Utils';

export const LOAD_NOTEBOOK = 'LOAD_NOTEBOOK';
export const NOTEBOOK_READY = 'NOTEBOOK_READY';


export const loadNotebook = { type: LOAD_NOTEBOOK };

export function notebookReady (){
  // FIXME for some reason the callback for python messages is not being always called
  Utils.execPythonMessage('from nwb_explorer.nwb_main import main');
  
  return { type: NOTEBOOK_READY };
}