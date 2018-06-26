import initialState from './store';
import { TOGGLE_NETWORK_STATUS, SAVE_USER_INFO, CHANGE_USER_STAGE } from './actions';

export default (state = initialState, action) => {
  switch (action.type) {
    case TOGGLE_NETWORK_STATUS:
      return {
        ...state,
        stage: action.payload.stage,
        userInfo: {
          ...action.payload.data
        }
      }
    case SAVE_USER_INFO:
      return {
        ...state,
        ...action.payload
      }
    case CHANGE_USER_STAGE:
      return {
        ...state,
        stage: action.payload
      }
    default:
      return state;
  }
}

export const logUserIn = (data, stage) => ({
  type: TOGGLE_NETWORK_STATUS,
  payload: { data, stage }
});

export const saveUserInfo = data => ({
  type: SAVE_USER_INFO,
  payload: data
});

export const changeStage = data => ({
  type: CHANGE_USER_STAGE,
  payload: data
});