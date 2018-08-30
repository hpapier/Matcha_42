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
  statusBar: 'home'
};

export default store;