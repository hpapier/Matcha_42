const store = {
  user: {
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
    profilPicture: null
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
    scoreStart: 18,
    scoreEnd: 100,
    location: 10,
    tags: []
  }
};

export default store;