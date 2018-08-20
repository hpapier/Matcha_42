import { LOG_USER_IN } from '../../constant';

export const logUserIn = token => {
  localStorage.setItem('auth_token', token);
  return {
    type: LOG_USER_IN
  };
}