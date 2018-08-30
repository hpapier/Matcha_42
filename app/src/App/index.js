import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Query } from 'react-apollo';

import { USER_STATUS_QUERY } from '../../query';
import LoggedIn from '../Router/LoggedIn';
import LoggedOut from '../Router/LoggedOut';
import './index.sass';

const App = props => {
  return (
    <Query query={USER_STATUS_QUERY} pollInterval={500}>
      {
        response => {
          console.log('--> RENDERING APP COMPONENT..');
          if (response.loading) {
            return (
              <div id='app-loading'>
                <div id='app-loading-animation'></div>
              </div>
            );
          }

          if (response.error)
            return <div id='app-error'>Oups! Une erreur est survenu..</div>;

          return (
            <div>
              {
                response.data.userStatus.status ?
                <LoggedIn firstRefetch={response.refetch} /> :
                <LoggedOut firstRefetch={response.refetch} />
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