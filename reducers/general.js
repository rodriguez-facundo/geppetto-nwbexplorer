import { toggleInfoPanel } from '../actions/general';
import { TOGGLE_INFO_PANEL } from '../actions/creators/general';


export default ( state = {}, action ) => {
  
  switch (action.type) {

  case TOGGLE_INFO_PANEL:
    return { ...toggleInfoPanel(state, action) }

  default:
    return { ...state };
  }
}
