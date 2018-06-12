import React, { Component } from 'react';
import { connect } from 'react-redux';
import { gql } from 'apollo-boost';
import { Query } from 'react-apollo';
import LoggedOut from '../LoggedOut';
// import LoggedIn from '../LoggedIn';
import './index.scss';

const GET_USER_INFO = gql`
  query userInformation($token: String!) {
    getUserInfo(token: $token) {
      id
      name
      email
    }
  }
`;

class App extends Component {
  render() {
    const token = localStorage.getItem('auth_token');
    console.log(token);
    if (token) {
      return (
        <Query query={GET_USER_INFO} variables={{ token }}>
          {(data) => {
            console.log(data);
            return (<div>lol</div>);
          }}
        </Query>
      );
    }

    return (
      <div>
        <LoggedOut />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  isLoggedIn: state.isLoggedIn
});

export default connect(mapStateToProps)(App);