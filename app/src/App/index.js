import React, { Component } from 'react';
import { Query } from 'react-apollo';

import { USER_STATUS_QUERY } from '../../query';
import LoggedIn from '../Router/LoggedIn';
import LoggedOut from '../Router/LoggedOut';

const App = props => {
  return (
    <Query query={USER_STATUS_QUERY}>
      {
        response => {
          if (response.loading)
            return <div>Loading...</div>;

          if (response.error)
            return <div>Server error</div>;

          return (
            <div>
              {
                response.data.userStatus.status ?
                <LoggedIn /> :
                <LoggedOut />
              }
            </div>
          );
        }
      }
    </Query>
  );
}

export default App;