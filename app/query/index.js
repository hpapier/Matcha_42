import gql from 'graphql-tag';

export const USER_STATUS_QUERY = gql`
  {
    userStatus {
      status
    }
  }
`;