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
  UPDATE_PROFIL_USER_IMAGES
} from '../../constant';

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
})