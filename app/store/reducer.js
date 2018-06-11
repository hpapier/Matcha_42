import initialState from './store';
import { TOGGLE_NETWORK_STATUS } from './actions';

export default (state = initialState, action) => {
  switch (action.type) {
    case TOGGLE_NETWORK_STATUS:
      return {
        ...state,
        isLoggedIn: !state.isLoggedIn
      }
    default:
      return state;
  }
}

export const logUserIn = () => ({
  type: TOGGLE_NETWORK_STATUS
});