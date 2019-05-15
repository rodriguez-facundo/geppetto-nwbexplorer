import { createStore } from "redux";
import loadFileReducer from "./reducers/loadFileReducer";

function isEmbeddedInIframe () {
  return window.location !== window.parent.location;
}

const INIT_STATE = { 
  nwbFileUrl: null,
  model: null, 
  loading: false,
  isLoadedInNotebook: false,
  isLoadingInNotebook: false,
  showNotebook: false,
  notebookReady: false,
  embedded: isEmbeddedInIframe()
};

function configureStore (state = INIT_STATE) {
  return createStore(
    loadFileReducer,
    state,
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
  );
}
export default configureStore;