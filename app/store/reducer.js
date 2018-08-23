import initialState from './store';
import { SAVE_USER_INFO, CHANGE_STATUS_BAR } from './constant';

export default (state = initialState, action) => {
  switch (action.type) {
    case SAVE_USER_INFO:
      return {
        ...state,
        user: {
          username: action.payload.username,
          lastname: action.payload.lastname,
          firstname: action.payload.firstname,
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
      }
    default:
      return state;
  }
}