import React, { Component } from 'react';
import { connect } from 'react-redux';
import { logUserIn } from '../../../store/reducer';
import { gql } from 'apollo-boost';
import { graphql, compose, withApollo } from 'react-apollo';
import './index.scss';

const GET_USER_INFO = gql`
  query checkUserInfo($email: String!, $password: String!){
    checkUserInfo(email: $email, password: $password) {
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
      bio
      popularityScore
      location
      isComplete
      creationDate
      lastConnexion
      isConnected
      token
    }
  }
`;

class SignIn extends Component {
  state = {
    email: '',
    pwd: '',
    error: false
  }

  handleSubmit = e => {
    console.log('SUBMIT');
    e.preventDefault();
    if (this.state.email && this.state.pwd) {
      this.props.client.query({
        query: GET_USER_INFO,
        variables: {
          email: this.state.email,
          password: this.state.pwd
        }
      })
      .then(res => {
        console.log('- THEN -');
        console.log(res);
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
          location,
          isComplete,
          creationDate,
          lastConnexion,
          isConnected,
          token
        } = res.data.checkUserInfo;

        if (isConfirmed) {
          localStorage.setItem('auth_token', token);
          this.props.logUserIn({
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
            location,
            isComplete,
            creationDate,
            lastConnexion,
            isConnected
          }, 'loggedIn');
        } else {
          this.setState({ error: 'Account not confirmed' });
          this.props.client.resetStore();
        }
      })
      .catch(err => {
        console.log('- CATCH -');
        console.log(err);
        const t = JSON.stringify(err);
        this.setState({ error: JSON.parse(t).graphQLErrors[0].message });
        this.props.client.resetStore();
      });
    } else {
      this.setState({ error: 'Email or pwd incomplete'});
    }
  }

  render() {
    const { signup, reset } = this.props.changeState;
    return (
      <div id="sign-in">
        <div id="sign-in-title">Connexion</div>
        <form id="sign-in-form" onSubmit={e => this.handleSubmit(e)}>
          <label id="sign-in-form-label-email" htmlFor="email">Adresse email</label>
          <input id="sign-in-form-input-email" type="text" name="email" onChange={e => this.setState({ email: e.target.value })} />
          <label id="sign-in-form-label-pwd" htmlFor="pwd">Mot de passe</label>
          <input id="sign-in-form-input-pwd" type="password " name="pwd" onChange={e => this.setState({ pwd: e.target.value })} />

          <div id="sign-in-fom-btn-box">
            <div id="sign-in-fom-btn-box-1">
              <button id="sign-in-fom-btn-box-sign-up" type="button" onClick={signup}>S'inscrire</button>
              <button id="sign-in-fom-btn-box-sign-in" type="submit">Connexion</button>
            </div>
            <button id="sign-in-fom-btn-box-reset-token" type="button" onClick={reset}>Réinitialiser le mot de passe</button>
          </div>
        </form>
        <div id="sign-in-error">{(this.state.error) ? this.state.error : null}</div>
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  logUserIn: (data, stage) => dispatch(logUserIn(data, stage))
});

export default withApollo(connect(null, mapDispatchToProps)(SignIn));