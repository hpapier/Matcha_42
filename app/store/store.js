const store = {
  stage: 'onload',
  email: '',
  username: '',
  lastname: '',
  firstname: '',
  password: '',
  birthDate: '',
  day: '',
  month: '',
  year: '',
  genre: '',
  sexualOrientation: '',
  userInfo: {
    id: '',
    email: '',
    username: '',
    lastname: '',
    firstname: '',
    password: '',
    birthDate: '',
    isConfirmed: '',
    genre: '',
    sexualOrientation: '',
    bio: '',
    popularityScore: '',
    userLocation: '',
    isComplete: '',
    creationDate: '',
    lastConnexion: '',
    isConnected: ''
  },
  preferences: {
    age: [18, 100],
    tiopopularityScore: [10, 100],
    location: 0,
    interestTags: []
  }
};

export default store;