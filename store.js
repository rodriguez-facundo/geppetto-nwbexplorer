import { createStore } from "redux";
import all from "./reducers/all";

function isEmbeddedInIframe () {
  return window.location !== window.parent.location;
}

const INIT_STATE = { 
  general: { 
    embedded: isEmbeddedInIframe(),
    toggleInfoPanel: false 
  },
  nwbfile: {
    isLoadedInNotebook: false,
    isLoadingInNotebook: false,
    showNotebook: false,
    notebookReady: false,
    nwbFileUrl: null,
    model: null, 
    loading: false
  }
};

function configureStore (state = INIT_STATE) {
  return createStore(
    all,
    state,
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
  );
}
export default configureStore;