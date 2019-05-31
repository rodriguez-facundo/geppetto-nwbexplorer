import * as TYPES from '../actions/notebook';

export const NOTEBOOK_DEFAULT_STATUS = {
  showNotebook: false,
  notebookReady: false,
};

export default ( state = {}, action ) => ({ ...state, ...reduceNotebook(state, action) });

function reduceNotebook (state = {}, action) {
  switch (action.type) {
    
  case TYPES.LOAD_NOTEBOOK:
    return { showNotebook: true, notebookReady: false }
  
  case TYPES.NOTEBOOK_READY:
    return { isLoadingInNotebook: true, notebookReady: false }
  default:
    return state;
  }
}