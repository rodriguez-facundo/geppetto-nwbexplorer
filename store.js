import { createStore } from "redux";
import all from "./reducers/all";
import { GENERAL_DEFAULT_STATUS } from "./reducers/general";
import { NOTEBOOK_DEFAULT_STATUS } from "./reducers/notebook";
import { NWBFILE_DEFAULT_STATUS } from "./reducers/nwbfile";

const INIT_STATE = { 
  general: GENERAL_DEFAULT_STATUS,
  nwbfile: NWBFILE_DEFAULT_STATUS,
  notebook: NOTEBOOK_DEFAULT_STATUS
};

function configureStore (state = INIT_STATE) {
  return createStore(
    all,
    state,
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
  );
}

export default configureStore;