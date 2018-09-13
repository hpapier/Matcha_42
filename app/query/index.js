import gql from 'graphql-tag';

export const USER_STATUS_QUERY = gql`
  {
    userStatus {
      status
    }
  }
`;

export const USER_AUTH_MUTATION = gql`
  mutation userAuth($username: String!, $password: String!){
    userAuth(username: $username, password: $password) {
      message
      token
    }
  }
`;

export const SIGN_UP_MUTATION = gql`
  mutation signUpMutation($username: String!, $email: String!, $lastname: String!, $firstname: String!, $birthDate: String!, $genre: String!, $interest: String!, $password: String!) {
    signUpMutation(username: $username, email: $email, lastname: $lastname, firstname: $firstname, birthDate: $birthDate, genre: $genre, interest: $interest, password: $password) {
      message
    }
  }
`;

export const EMAIL_TOKEN_VERIFICATION_QUERY = gql`
  query emailTokenVerification($username: String!, $emailToken: String!) {
    emailTokenVerification(username: $username, emailToken: $emailToken) {
      message
    }
  }
`;

export const SEND_EMAIL_RESET_MUTATION = gql`
  mutation sendEmailReset($username: String!, $email: String!) {
    sendEmailReset(username: $username, email: $email) {
      message
    }
  }
`;

export const RESET_TOKEN_VERIFICATION_QUERY = gql`
  query resetTokenVerification($username: String!, $resetToken: String!) {
    resetTokenVerification(username: $username, resetToken: $resetToken) {
      message
    }
  }
`;

export const RESET_PASSWORD_MUTATION = gql`
  mutation resetPassword($username: String!, $resetToken: String!, $password: String!) {
    resetPassword(username: $username, resetToken: $resetToken, password: $password) {
      message
    }
  }
`;

export const GET_USER_INFO_QUERY = gql`
  {
    userInformations {
      username
      lastname
      firstname
      birthDate
      genre
      sexualOrientation
      bio
      popularityScore
      location
      creationDate
      lastConnexion
      isComplete
      interests {
        id
        interestId
      }
      images {
        id
        path
      }
      email
      profilPicture
    }

    getInterests {
      id
      name
    }
  }
`;

export const FORCE_GEOLOCATION_MUTATION = gql`
  mutation forceGeolocation {
    forceGeolocation
  }
`;

export const USER_BOX_QUERY = gql`
  {
    userInformationsBox {
      username
      lastname
      firstname
      popularityScore
      profilPicture
      bio
    }

    userHistory {
      likeNumber
      visiteNumber
      matchNumber
    }
  }
`;

export const UPDATE_LASTNAME_MUTATION = gql`
  mutation updateUserLastname($lastname: String!) {
    updateUserLastname(lastname: $lastname) {
      data
    }
  }
`;


export const UPDATE_FIRSTNAME_MUTATION = gql`
  mutation updateUserFirstname($firstname: String!) {
    updateUserFirstname(firstname: $firstname) {
      data
    }
  }
`;

export const UPDATE_USERNAME_MUTATION = gql`
  mutation updateUsername($username: String!) {
    updateUsername(username: $username) {
      data
    }
  }
`;

export const UPDATE_DATE_MUTATION = gql`
  mutation updateUserBirthDate($birthdate: String!) {
    updateUserBirthDate(birthdate: $birthdate) {
      data
    }
  }
`;

export const UPDATE_GEOLOCATION_MUTATION = gql`
  mutation updateUserGeolocation($geolocation: String!) {
    updateUserGeolocation(geolocation: $geolocation) {
      data
    }
  }
`;

export const UPDATE_EMAIL_MUTATION = gql`
  mutation updateUserEmail($email: String!) {
    updateUserEmail(email: $email) {
      data
    }
  }
`;

export const UPDATE_PASSWORD_MUTATION = gql`
  mutation updateUserPassword($pPwd: String!, $nPwd: String!) {
    updateUserPassword(pPwd: $pPwd, nPwd: $nPwd) {
      data
    }
  }
`;

export const UPDATE_GENRE_MUTATION = gql`
  mutation updateUserGenre($genre: String!) {
    updateUserGenre(genre: $genre) {
      data
    }
  }
`;

export const UPDATE_SEXUAL_ORIENTATION_MUTATION = gql`
  mutation updateUserSO($sexualOrientation: String!) {
    updateUserSO(sexualOrientation: $sexualOrientation) {
      data
    }
  }
`;

export const UPDATE_BIO_MUTATION = gql`
  mutation updateUserBio($bio: String!) {
    updateUserBio(bio: $bio) {
      data
    }
  }
`;

export const ADD_TAGS_MUTATION = gql`
  mutation addTagToUser($tag: String!) {
    addTagToUser(tag: $tag) {
      userTags {
        id
        interestId
      }
      interests {
        id
        name
      }
    }
  }
`;

export const REMOVE_TAGS_MUTATION = gql`
  mutation removeTagToUser($tag: Int!) {
    removeTagToUser(tag: $tag) {
        id
        interestId
    }
  }
`;

export const ADD_USER_IMAGE_MUTATION = gql`
  mutation addUserImage($img: String!, $type: String!) {
    addUserImage(img: $img, type: $type) {
      id
      path
    }
  }
`;

export const REMOVE_USER_IMAGE_MUTATION = gql`
  mutation removeUserImage($imgId: Int!, $name: String!) {
    removeUserImage(imgId: $imgId, name: $name) {
      id
      path
    }
  }
`;

export const UPDATE_USER_PROFIL_IMAGE_MUTATION = gql`
  mutation updateProfilImg($imgId: Int!, $name: String!, $imgPath: String!) {
    updateProfilImg(imgId: $imgId, name: $name, imgPath: $imgPath) {
      path
    }
  }
`;

export const GET_USER_PREFERENCE_QUERY = gql`
  {
    getUserPreference {
      ageStart
      ageEnd
      scoreStart
      scoreEnd
      location
      tags
    }
  }
`;

export const UPDATE_USER_PREFERENCE_MUTATION = gql`
  mutation updateUserPreferences($ageStart: Int!, $ageEnd: Int!, $scoreStart: Int!, $scoreEnd: Int!, $location: Int!, $tags: String!) {
    updateUserPreferences(ageStart: $ageStart, ageEnd: $ageEnd, scoreStart: $scoreStart, scoreEnd: $scoreEnd, location: $location, tags: $tags) {
      ageStart
      ageEnd
      scoreStart
      scoreEnd
      location
      tags
    }
  }
`;

export const GET_LIST_OF_USER_QUERY = gql`
  {
    getListOfUser {
      id
      location
      popularityScore
      username
      age
      distance
      tags {
        id
        interestId
      }
      profilPicture
    }
  }
`;

export const GET_USER_PROFIL_QUERY = gql`
  query getUserProfilInformation($userId: Int!){
    getUserProfilInformation(userId: $userId) {
      id
      images {
        id
        path
      }
      actions
      lastConnexion
      isConnected
      username
      firstname
      lastname
      age
      location
      popularityScore
      bio
      genre
      sexualOrientation
      tags {
        id
        interestId
      }
      isMatched
      isBlocked
      isLiked
    }
  }
`;

export const LIKE_USER_MUTATION = gql`
  mutation likeUser($userId: Int!) {
    likeUser(userId: $userId) {
      isMatched
    }
  }
`;

export const UNLIKE_USER_MUTATION = gql`
  mutation unlikeUser($userId: Int!) {
    unlikeUser(userId: $userId) {
      isMatched
    }
  }
`;

export const GET_VISITOR_QUERY = gql`
  {
    getVisitorList {
      id
      popularityScore
      username
      age
      distance
      profilPicture
      isLiked
    }
  }
`;

export const BLOCK_USER_MUTATION = gql`
  mutation blockUser($userId: Int!) {
    blockUser(userId: $userId)
  }
`;

export const UNBLOCK_USER_MUTATION = gql`
  mutation unblockUser($userId: Int!) {
    unblockUser(userId: $userId)
  }
`;

export const REPORT_USER_MUTATION = gql`
  mutation reportUser($userId: Int!) {
    reportUser(userId: $userId)
  }
`;

export const NOTIFICATION_COMPONENT_QUERY = gql`
  {
    getUserNotification {
      id
      fromUserId
      fromUserName
      fromUserProfilPicture
      fromUserGenre
      action
      date
    }
  }
`;

export const NOTIFICATION_SUBSCRIPTION = gql`
  subscription notificationSub($token: String!){
    notificationSub(token: $token) {
      count
    }
  }
`;

export const FETCH_NOTIF_COUNT_QUERY = gql`
  {
    getCountNotification {
      count
    }
  }
`;

export const USER_LIKE_QUERY = gql`
  {
    getUserLike {
      id
      popularityScore
      username
      age
      distance
      profilPicture
      isLiked
      tags {
        id
        interestId
      }
    }
  }
`;

export const USER_VISITE_QUERY = gql`
  {
    getUserVisite {
      id
      popularityScore
      username
      age
      distance
      profilPicture
      isLiked
      tags {
        id
        interestId
      }
    }
  }
`;

export const USER_MATCH_QUERY = gql`
  {
    getUserMatch {
      id
      popularityScore
      username
      age
      distance
      profilPicture
      isLiked
      tags {
        id
        interestId
      }
    }
  }
`;

export const GET_LIKER_QUERY = gql`
  {
    getLikerList {
      id
      popularityScore
      username
      age
      distance
      profilPicture
      isLiked
    }
  }
`;