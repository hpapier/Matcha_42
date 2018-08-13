import React, { Component } from 'react';
import { Query } from 'react-apollo';

import { USER_STATUS_QUERY } from '../../query';

const App = props => {
  return (
    <Query query={USER_STATUS_QUERY}>
      {
        response => {
          console.log(response);
          return (
            <div>
              Hello App Component
            </div>
          );
        }
      }
    </Query>
  );
}

export default App;