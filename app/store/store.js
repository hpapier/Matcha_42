const store = {
  user: {
    id: null,
    username: '',
    lastname: '',
    firstname: '',
    email: '',
    birthDate: '',
    genre: '',
    sexualOrientation: '',
    bio: '',
    popularityScore: 0,
    location: '',
    creationDate: '',
    lastConnexion: '',
    userTags: [],
    userImages: [],
    profilPicture: null,
    isComplete: false
  },
  refetching: false,
  interests: [],
  statusBar: 'home',
  homepage: {
    statusView: 'suggestion'
  },
  userPref: {
    ageStart: 18,
    ageEnd: 100,
    scoreStart: 10,
    scoreEnd: 100,
    location: 10,
    tags: []
  },
  currentFiltre: [],
  currentOrder: '',
  simpleUserList: [],
  visitorList: [],
  userProfilToGet: null,
  currentUserProfilInfo: null,
  notificationList: [],
  userLikeList: [],
  userVisiteList: [],
  userMatchList: [],
  likerList: [],
  roomList: [],
  currentMsgRoom: []
};

export default store;