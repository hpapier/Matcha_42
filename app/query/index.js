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
      interests {
        id
        interestId
      }
      images {
        id
        path
      }
    }

    getInterests {
      id
      name
    }
  }
`;