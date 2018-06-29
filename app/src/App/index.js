import React, { Component } from 'react';
import { connect } from 'react-redux';
import { gql } from 'apollo-boost';
import { withApollo } from 'react-apollo';
import RouteLoggedOut from '../RouteLoggedOut';
import LoggedIn from '../LoggedIn';
import './index.scss';
import { changeStage } from '../../store/reducer';

const GET_USER_INFO = gql`
  query userInformation($token: String) {
    getUserInfo(token: $token) {
      id
      email
      username
      firstname
      lastname
      birthDate
      isConfirmed
      genre
      sexualOrientation
    }
  }
`;

class App extends Component {
  action = () => {
    switch (this.props.stage) {
      case 'onload':
        return <div>Loading</div>;
      case 'loggedOut':
        return <RouteLoggedOut />;
      case 'loggedIn':
        return <LoggedIn />;
      default:
        return <RouteLoggedOut />;
    }
  };
  
  render() {
    console.log('APP RENDER');
    if (this.props.stage === 'onload') {
      let token = localStorage.getItem('auth_token');
      if (!token)
        token = 'null';

      this.props.client.query({
        query: GET_USER_INFO,
        variables: { token }
      })
      .then(res => this.props.changeStage('loggedIn'))
      .catch(err => this.props.changeStage('loggedOut'));
    }

    return this.action();
  }
}

const mapStateToProps = state => ({
  stage: state.stage
});

const mapDispatchToProps = dispatch => ({
  changeStage: data => dispatch(changeStage(data))
});

export default withApollo(connect(mapStateToProps, mapDispatchToProps)(App));