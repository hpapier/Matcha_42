import initialState from './store';
import { TOGGLE_NETWORK_STATUS, SAVE_USER_INFO } from './actions';

export default (state = initialState, action) => {
  switch (action.type) {
    case TOGGLE_NETWORK_STATUS:
      return {
        ...state,
        isLoggedIn: !state.isLoggedIn
      }
    case SAVE_USER_INFO:
      return {
        ...state,
        ...action.payload
      }
    default:
      return state;
  }
}

export const logUserIn = () => ({
  type: TOGGLE_NETWORK_STATUS
});

export const saveUserInfo = data => ({
  type: SAVE_USER_INFO,
  payload: data
});