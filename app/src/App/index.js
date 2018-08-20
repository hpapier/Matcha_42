import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Query } from 'react-apollo';

import { USER_STATUS_QUERY } from '../../query';
import LoggedIn from '../Router/LoggedIn';
import LoggedOut from '../Router/LoggedOut';

const App = props => {
  return (
    <Query query={USER_STATUS_QUERY}>
      {
        response => {
          // console.log('---> ');
          // console.log(props.isLoggedIn);
          // console.log(response);
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

const mapStateToProps = state => ({
  isLoggedIn: state.isLoggedIn
})

export default connect(mapStateToProps, null)(App);