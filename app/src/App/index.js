import React, { Component } from 'react';
import { connect } from 'react-redux';
import { gql } from 'apollo-boost';
import { withApollo } from 'react-apollo';
import RouteLoggedOut from '../RouteLoggedOut';
import RouteLoggedIn from '../RouteLoggedIn';
import './index.scss';
import { setUserInfoAndStage } from '../../store/reducer';

const GET_USER_INFO = gql`
  query userInformation($token: String) {
    getUserInfo(token: $token) {
      id
      email
      username
      lastname
      firstname
      password
      birthDate
      isConfirmed
      genre
      sexualOrientation
      bio,
      popularityScore
      location
      isComplete
      creationDate
      lastConnexion
      isConnected
      confirmationToken
      ageStart
      ageEnd
      scoreStart
      scoreEnd
      location
      tags
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
        return <RouteLoggedIn />;
      default:
        return <RouteLoggedOut />;
    }
  };
  
  render() {
    if (this.props.stage === 'onload') {
      let token = localStorage.getItem('auth_token');
      if (!token)
        token = 'null';

      this.props.client.query({
        query: GET_USER_INFO,
        variables: { token }
      })
      .then(res => {
        const {
          id, 
          email, 
          username,
          lastname,
          firstname,
          password,
          birthDate,
          isConfirmed,
          genre,
          sexualOrientation,
          bio,
          popularityScore,
          userLocation,
          isComplete,
          creationDate,
          lastConnexion,
          isConnected,
          confirmationToken,
          ageStart,
          ageEnd,
          scoreStart,
          scoreEnd,
          location,
          tags
        } = res.data.getUserInfo;

        const interestsTags = JSON.parse(tags).data;

        const data = { 
          id, 
          email, 
          username,
          lastname,
          firstname,
          password,
          birthDate,
          isConfirmed,
          genre,
          sexualOrientation,
          bio,
          popularityScore,
          userLocation,
          isComplete,
          creationDate,
          lastConnexion,
          isConnected,
          confirmationToken,
          ageStart,
          ageEnd,
          scoreStart,
          scoreEnd,
          location,
          tags: interestsTags
        };

        console.log('-- USER DATA --');
        console.log(data);

        this.props.setUserInfoAndStage({ stage: 'loggedIn', data });
      })
      .catch(err => {
        console.log('-- CATCH : FETCH DATA USER INFO --');
        console.log(err);
        this.props.setUserInfoAndStage({ stage: 'loggedOut', data: null });
      });
    }

    return this.action();
  }
}

const mapStateToProps = state => ({
  stage: state.stage
});

const mapDispatchToProps = dispatch => ({
  setUserInfoAndStage: data => dispatch(setUserInfoAndStage(data))
});

export default withApollo(connect(mapStateToProps, mapDispatchToProps)(App));