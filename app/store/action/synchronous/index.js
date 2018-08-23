import { SAVE_USER_INFO } from '../../constant';

export const saveUserInfo = data => ({
  type: SAVE_USER_INFO,
  payload: data
});
