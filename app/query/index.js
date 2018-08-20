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