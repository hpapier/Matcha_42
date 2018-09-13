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
  CHANGE_MATCH_STATUS_USER_PROFIL,
  SAVE_USER_LIKE_LIST,
  SAVE_USER_VISITE_LIST,
  UPDATE_LIKE_STATUS_USER_VISITE_LIST,
  SAVE_USER_MATCH_LIST,
  SAVE_LIKER_LIST
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
          profilPicture: action.payload.profilPicture,
          isComplete: action.payload.isComplete
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
      };
    case UPDATE_FILTRE:
      return {
        ...state,
        currentFiltre: action.payload
      };
    case SAVE_LIST_OF_USER:
      return {
        ...state,
        simpleUserList: action.payload.map(item => ({ ...item, isLiked: false }))
      };
    case CHANGE_STATUS_VIEW:
      return {
        ...state,
        homepage: {
          statusView: action.payload
        },
      };
    case GET_USER_PROFIL:
      return {
        ...state,
        userProfilToGet: action.payload
      };
    case SAVE_USER_PROFIL_INFO:
      return {
        ...state,
        currentUserProfilInfo: { ...action.payload }
      };
    case CLEAN_USER_PROFIL:
      return {
        ...state,
        userProfilToGet: null,
        currentUserProfilInfo: null,
        homepage: {
          statusView: 'suggestion'
        }
      };
    case CHANGE_LIKE_STATUS_FOR_USER_LIST:
      const newList = state.simpleUserList.map(item => {
        if (item.id === action.payload.id)
          return { ...item, isLiked: !action.payload.isLiked };
        return item;
      });

      const visitorListUpdated = state.visitorList.map(item => {
        if (item.id === action.payload.id)
          return { ...item, isLiked: !action.payload.isLiked };
        return item;
      })

      return {
        ...state,
        simpleUserList: newList,
        visitorList: visitorListUpdated
      };
    case SAVE_VISITOR_LIST:
      return {
        ...state,
        visitorList: action.payload
      };
    case CHANGE_LIKE_STATUS_USER_PROFIL:
      return {
        ...state,
        currentUserProfilInfo: { ...state.currentUserProfilInfo, isLiked: !state.currentUserProfilInfo.isLiked }
      }
    case CHANGE_LIKE_STATUS_FOR_VISITOR_LIST:
      const userSimpleListUpdated = state.simpleUserList.map(item => {
        if (item.id === action.payload.id)
          return { ...item, isLiked: !action.payload.isLiked };
        else
          return item;
      });

      const newVisitorList = state.visitorList.map(item => {
        if (item.id === action.payload.id)
          return { ...item, isLiked: !action.payload.isLiked };
        else
          return item;
      });

      return {
        ...state,
        visitorList: newVisitorList,
        simpleUserList: userSimpleListUpdated
      };
    case CHANGE_BLOCK_STATUS_FOR_PROFIL_USER:
      return {
        ...state,
        currentUserProfilInfo: { ...state.currentUserProfilInfo, isBlocked: !state.currentUserProfilInfo.isBlocked }
      };
    case UPDATE_ORDER:
      return {
        ...state,
        currentOrder: (action.payload === state.currentOrder) ? '' : action.payload
      };
    case SAVE_NOTIF_LIST:
      return {
        ...state,
        notificationList: action.payload
      };
    case CHANGE_MATCH_STATUS_USER_PROFIL:
      return {
        ...state,
        currentUserProfilInfo: { ...state.currentUserProfilInfo, isMatched: action.payload }
      };
    case SAVE_USER_LIKE_LIST:
      return {
        ...state,
        userLikeList: action.payload
      };
    case SAVE_USER_VISITE_LIST:
      return {
        ...state,
        userVisiteList: action.payload
      };
    case UPDATE_LIKE_STATUS_USER_VISITE_LIST:
      const newUserVisiteList = state.userVisiteList.map(item => {
        if (item.id === action.payload.id)
          return { ...item, isLiked: !action.payload.isLiked }
        return item;
      });

      return {
        ...state,
        userVisiteList: newUserVisiteList
      };
    case SAVE_USER_MATCH_LIST:
      return {
        ...state,
        userMatchList: action.payload
      };
    case SAVE_LIKER_LIST:
      return {
        ...state,
        likerList: action.payload
      }
    default:
      return state;
  }
};