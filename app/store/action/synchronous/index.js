import {
  SAVE_USER_INFO,
  CHANGE_STATUS_BAR,
  UPDATE_USER_LASTNAME,
  UPDATE_USER_FIRSTNAME,
  UPDATE_USERNAME,
  UPDATE_USER_BIRTHDATE,
  UPDATE_GEOLOCATION_MECHANISM,
  UPDATE_EMAIL_MECHANISM,
  UPDATE_GENRE_MECHANISM,
  UPDATE_SEXUAL_ORIENTATION_MECHANISM,
  UPDATE_USER_BIO_MECHANISM,
  SAVE_INTEREST_MECHANISM,
  UPDATE_INTERESTS,
  UPDATE_USER_TAGS,
  UPDATE_USER_IMAGES,
  UPDATE_PROFIL_USER_IMAGES,
  UPDATE_REFETCHING,
  CLEAR_STORE,
  SAVE_USER_PREF,
  UPDATE_FILTRE,
  SAVE_LIST_OF_USER,
  CHANGE_STATUS_VIEW,
  GET_USER_PROFIL,
  SAVE_USER_PROFIL_INFO,
  CLEAN_USER_PROFIL,
  CHANGE_LIKE_STATUS_FOR_USER_LIST,
  SAVE_VISITOR_LIST,
  CHANGE_LIKE_STATUS_USER_PROFIL,
  CHANGE_LIKE_STATUS_FOR_VISITOR_LIST,
  CHANGE_BLOCK_STATUS_FOR_PROFIL_USER,
  UPDATE_ORDER,
  SAVE_NOTIF_LIST,
  CHANGE_MATCH_STATUS_USER_PROFIL
} from '../../constant';

export const clearStore = () => ({
  type: CLEAR_STORE
});

export const saveUserInfo = data => ({
  type: SAVE_USER_INFO,
  payload: data
});

export const statusBarMechanism = status => ({
  type: CHANGE_STATUS_BAR,
  payload: status
});

export const updateUserLastnameMechanism = data => ({
  type: UPDATE_USER_LASTNAME,
  payload: data
});

export const updateUserFirstnameMechanism = data => ({
  type: UPDATE_USER_FIRSTNAME,
  payload: data
});

export const updateUsernameMechanism = data => ({
  type: UPDATE_USERNAME,
  payload: data
});

export const updateUserBirthDateMechanism = data => ({
  type: UPDATE_USER_BIRTHDATE,
  payload: data
});

export const updateUserGeolocationMechanism = data => ({
  type: UPDATE_GEOLOCATION_MECHANISM,
  payload: data
});

export const updateEmailMechanism = data => ({
  type: UPDATE_EMAIL_MECHANISM,
  payload: data
});

export const updateGenreMechanism = data => ({
  type: UPDATE_GENRE_MECHANISM,
  payload: data
});

export const updateSexualOrientationMechanism = data => ({
  type: UPDATE_SEXUAL_ORIENTATION_MECHANISM,
  payload: data
});

export const updateUserBioMechanism = data => ({
  type: UPDATE_USER_BIO_MECHANISM,
  payload: data
});

export const saveInterest = data => ({
  type: SAVE_INTEREST_MECHANISM,
  payload: data
});

export const updateInterest = (userTags, interests) => ({
  type: UPDATE_INTERESTS,
  payload: { userTags, interests }
});

export const updateUserTags = tags => ({
  type: UPDATE_USER_TAGS,
  payload: tags
});

export const updateUserImages = data => ({
  type: UPDATE_USER_IMAGES,
  payload: data
});

export const updateUserProfilImg = data => ({
  type: UPDATE_PROFIL_USER_IMAGES,
  payload: data
});

export const updateRefetch = bool => ({
  type: UPDATE_REFETCHING,
  payload: bool
});

export const saveUserPref = data => ({
  type: SAVE_USER_PREF,
  payload: data
});

export const updateFiltre = data => ({
  type: UPDATE_FILTRE,
  payload: data
});

export const saveListOfUser = data => ({
  type: SAVE_LIST_OF_USER,
  payload: data
});

export const changeStatusView = status => ({
  type: CHANGE_STATUS_VIEW,
  payload: status
});

export const getUserProfil = user => ({
  type: GET_USER_PROFIL,
  payload: user
});

export const saveUserProfilInfo = data => ({
  type: SAVE_USER_PROFIL_INFO,
  payload: data
});

export const cleanUserProfil = () => ({
  type: CLEAN_USER_PROFIL
});

export const changeLikeStatusForUserList = data => ({
  type: CHANGE_LIKE_STATUS_FOR_USER_LIST,
  payload: data
});

export const saveVisitorList = data => ({
  type: SAVE_VISITOR_LIST,
  payload: data
});

export const changeLikeStatusOfUserProfil = () => ({
  type: CHANGE_LIKE_STATUS_USER_PROFIL
});

export const changeLikeStatusForVisitorList = (data) => ({
  type: CHANGE_LIKE_STATUS_FOR_VISITOR_LIST,
  payload: data
});

export const changeBlockStatusForProfilUser = () => ({
  type: CHANGE_BLOCK_STATUS_FOR_PROFIL_USER
});

export const updateOrder = data => ({
  type: UPDATE_ORDER,
  payload: data
});

export const saveNotifList = data => ({
  type: SAVE_NOTIF_LIST,
  payload: data
});

export const changeMatchStatusOfUserProfil = data => ({
  type: CHANGE_MATCH_STATUS_USER_PROFIL,
  payload: data
});