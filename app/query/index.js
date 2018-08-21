import gql from 'graphql-tag';

export const USER_STATUS_QUERY = gql`
  {
    userStatus {
      status
    }
  }
`;

export const USER_AUTH_QUERY = gql`
  query userAuth($username: String!, $password: String!){
    userAuth(username: $username, password: $password) {
      status
      message
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
  query emailTokenVerification($emailToken: String!) {
    emailTokenVerification(emailToken: $emailToken) {
      message
    }
  }
`;