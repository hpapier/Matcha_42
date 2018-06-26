import React, { Component } from 'react';
import { connect } from 'react-redux';
import { logUserIn } from '../../../store/reducer';
import { gql } from 'apollo-boost';
import { graphql, compose, withApollo } from 'react-apollo';


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
    e.preventDefault();
    if (this.state.email && this.state.pwd) {
      console.log(`email: ${this.state.email}`);
      console.log(`pwd: ${this.state.pwd}`);
      this.props.client.query({
        query: GET_USER_INFO,
        variables: {
          email: this.state.email,
          password: this.state.pwd
        }
      })
      .then(res => {
        console.log('-- THEN --');
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
          console.log(this.props.client);
        } else {
          this.setState({ error: 'Account not confirmed' });
        }
      })
      .catch(err => {
        console.log('-- CATCH --');
        const t = JSON.stringify(err);
        this.setState({ error: JSON.parse(t).graphQLErrors[0].message });
      });
    } else {
      console.log('Nop');
    }
  }

  render() {
    console.log(this.props);
    const { changeState } = this.props;
    return (
      <div>
        <p>Connexion</p>
        <form onSubmit={e => this.handleSubmit(e)}>
          <label htmlFor="email">Adresse email</label>
          <input type="text" name="email" onChange={e => this.setState({ email: e.target.value })} />
          <label htmlFor="pwd">Mot de passe</label>
          <input type="text" name="pwd" onChange={e => this.setState({ pwd: e.target.value })} />
          
          <div>
            <button type="button" onClick={changeState}>S'inscrire</button>
            <button type="submit">Connexion</button>
          </div>
        </form>
        {(this.state.error) ? this.state.error : null}
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  logUserIn: (data, stage) => dispatch(logUserIn(data, stage))
});

export default withApollo(connect(null, mapDispatchToProps)(SignIn));