import initialState from './store';
import { LOG_USER_IN } from './constant';

export default (state = initialState, action) => {
  switch (action.type) {
    case LOG_USER_IN:
      return {
        ...state,
        isLoggedIn: true
      };
    default:
      return state;
  }
}