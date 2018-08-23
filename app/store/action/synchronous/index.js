import { SAVE_USER_INFO, CHANGE_STATUS_BAR } from '../../constant';

export const saveUserInfo = data => ({
  type: SAVE_USER_INFO,
  payload: data
});

export const statusBarMechanism = status => ({
  type: CHANGE_STATUS_BAR,
  payload: status
});