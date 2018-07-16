import initialState from './store';
import { TOGGLE_NETWORK_STATUS, SAVE_USER_INFO, STORE_USER_PREF } from './actions';

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
    case STORE_USER_PREF:
      if (action.payload.data === null) {
        return {
          ...state,
          stage: action.payload.stage
        }
      }

      return {
        ...state,
        stage: action.payload.stage,
        userInfo: {
          id: action.payload.data.id,
          email: action.payload.data.email,
          username: action.payload.data.username,
          lastname: action.payload.data.lastname,
          firstname: action.payload.data.firstname,
          password: action.payload.data.password,
          birthDate: action.payload.data.birthDate,
          isConfirmed: action.payload.data.isConfirmed,
          genre: action.payload.data.genre,
          sexualOrientation: action.payload.data.sexualOrientation,
          bio: action.payload.data.bio,
          popularityScore: action.payload.data.popularityScore,
          location: action.payload.data.location,
          isComplete: action.payload.data.isComplete,
          creationDate: action.payload.data.creationDate,
          lastConnexion: action.payload.data.lastConnexion,
          isConnected: action.payload.data.isConnected
        },
        preferences: {
          age: [action.payload.data.ageStart, action.payload.data.ageEnd],
          popularityScore: [action.payload.data.scoreStart, action.payload.data.scoreEnd],
          location: action.payload.data.location,
          interestTags: [action.payload.data.tags]
        }
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

export const setUserInfoAndStage = data => ({
  type: STORE_USER_PREF,
  payload: data
});