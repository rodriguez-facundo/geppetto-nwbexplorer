import { combineReducers } from 'redux';

import general from './general';
import nwbfile from './nwbfile';

export default combineReducers({
  general,
  nwbfile
})