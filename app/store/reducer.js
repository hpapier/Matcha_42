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
  UPDATE_USER_BIO_MECHANISM,
  SAVE_INTEREST_MECHANISM,
  UPDATE_INTERESTS,
  UPDATE_USER_TAGS,
  UPDATE_USER_IMAGES,
  UPDATE_PROFIL_USER_IMAGES,
  UPDATE_REFETCHING,
  CLEAR_STORE,
  SAVE_USER_PREF
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
          lastConnexion: action.payload.lastConnexion,
          userImages: action.payload.images,
          userTags: action.payload.interests,
          profilPicture: action.payload.profilPicture
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
    case SAVE_INTEREST_MECHANISM:
      return {
        ...state,
        interests: action.payload
      };
    case UPDATE_INTERESTS:
      return {
        ...state,
        interests: action.payload.interests,
        user: {
          ...state.user,
          userTags: action.payload.userTags
        }
      };
    case UPDATE_USER_TAGS:
      return {
        ...state,
        user: {
          ...state.user,
          userTags: action.payload
        }
      };
    case UPDATE_USER_IMAGES:
      return {
        ...state,
        user: {
          ...state.user,
          userImages: action.payload
        }
      };
    case UPDATE_PROFIL_USER_IMAGES:
      return {
        ...state,
        user: {
          ...state.user,
          profilPicture: action.payload
        }
      };
    case UPDATE_REFETCHING:
      return {
        ...state,
        refetching: action.payload
      };
    case CLEAR_STORE:
      return {
        ...initialState
      };
    case SAVE_USER_PREF:
      return {
        ...state,
        userPref: {
          ageStart: action.payload.ageStart,
          ageEnd: action.payload.ageEnd,
          scoreStart: action.payload.scoreStart,
          scoreEnd: action.payload.scoreEnd,
          location: action.payload.location,
          tags: !action.payload.tags ? [] : JSON.parse(action.payload.tags)
        }
      }
    default:
      return state;
  }
}