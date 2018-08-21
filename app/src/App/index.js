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
          console.log('---> ');
          // console.log(props.isLoggedIn);
          // console.log(response);
          if (response.networkStatus === 4) console.log("Refetching!");
          if (response.loading)
            return <div>Loading...</div>;

          if (response.error)
            return <div>Server error</div>;

          return (
            <div>
              {
                response.data.userStatus.status ?
                <LoggedIn /> :
                <LoggedOut firstRefetch={response.refetch}/>
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