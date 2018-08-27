import initialState from './store';
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
  UPDATE_USER_BIO_MECHANISM
} from './constant';

export default (state = initialState, action) => {
  switch (action.type) {
    case SAVE_USER_INFO:
      return {
        ...state,
        user: {
          username: action.payload.username,
          lastname: action.payload.lastname,
          firstname: action.payload.firstname,
          email: action.payload.email,
          birthDate: action.payload.birthDate,
          genre: action.payload.genre,
          sexualOrientation: action.payload.sexualOrientation,
          bio: action.payload.bio,
          popularityScore: action.payload.popularityScore,
          location: action.payload.location,
          creationDate: action.payload.creationDate,
          lastConnexion: action.payload.lastConnexion
        }
      };
    case CHANGE_STATUS_BAR:
      return {
        ...state,
        statusBar: action.payload
      };
    case UPDATE_USER_LASTNAME:
      return {
        ...state,
        user: {
          ...state.user,
          lastname: action.payload
        }
      };
    case UPDATE_USER_FIRSTNAME:
      return {
        ...state,
        user: {
          ...state.user,
          firstname: action.payload
        }
      };
    case UPDATE_USERNAME:
      return {
        ...state,
        user: {
          ...state.user,
          username: action.payload
        }
      };
    case UPDATE_USER_BIRTHDATE:
      return {
        ...state,
        user: {
          ...state.user,
          birthDate: action.payload
        }
      };
    case UPDATE_GEOLOCATION_MECHANISM:
      return {
        ...state,
        user: {
          ...state.user,
          location: action.payload
        }
      }
    case UPDATE_EMAIL_MECHANISM:
      return {
        ...state,
        user: {
          ...state.user,
          email: action.payload
        }
      }
    case UPDATE_GENRE_MECHANISM:
      return {
        ...state,
        user: {
          ...state.user,
          genre: action.payload
        }
      }
    case UPDATE_SEXUAL_ORIENTATION_MECHANISM:
      return {
        ...state,
        user: {
          ...state.user,
          sexualOrientation: action.payload
        }
      };
    case UPDATE_USER_BIO_MECHANISM:
      return {
        ...state,
        user: {
          ...state.user,
          bio: action.payload
        }
      };
    default:
      return state;
  }
}