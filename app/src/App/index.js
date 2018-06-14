import React, { Component } from 'react';
import { connect } from 'react-redux';
import { gql } from 'apollo-boost';
import { Query } from 'react-apollo';
import LoggedOut from '../LoggedOut';
// import LoggedIn from '../LoggedIn';
import './index.scss';

const GET_USER_INFO = gql`
  query userInformation($token: String) {
    getUserInfo(token: $token) {
      id
      name
      email
    }
  }
`;

class App extends Component {
  render() {
    let token = localStorage.getItem('auth_token');
    if (!token)
      token = 'null';
    return (
      <Query query={GET_USER_INFO} variables={{ token }}>
        {({ data, loading, error, refetch }) => {
          if (loading)
            return <div>Loading...</div>;
          if (error)
            return <LoggedOut refetch={refetch}/>;

          console.log(data);
          return (<div>lol</div>);
        }}
      </Query>
    );
  }
}

const mapStateToProps = state => ({
  isLoggedIn: state.isLoggedIn
});

export default connect(mapStateToProps)(App);