import { createStore } from "redux";
import loadFileReducer from "./reducers/loadFileReducer";

const INIT_STATE = { 
  nwbFileUrl: null,
  model: null, 
  loading: false,
  isLoadedInNotebook: false,
  isLoadingInNotebook: false,
  showNotebook: false,
  notebookReady: false
};

function configureStore (state = INIT_STATE) {
  return createStore(
    loadFileReducer,
    state,
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
  );
}
export default configureStore;