import React from 'react';
import './index.scss';
import { saveUserInfo } from '../../../../store/reducer';
import { connect } from 'react-redux';
import { graphql, compose } from 'react-apollo';
import { gql } from 'apollo-boost';

const SAVE_TO_DB = gql`
mutation addUser($email: String!, $username: String!, $firstname: String!, $lastname: String!, $birthDate: String!, $genre: String!, $sexualOrientation: String!, $password: String!) {
  addUser(email: $email, username: $username, firstname: $firstname, lastname: $lastname, birthDate: $birthDate, genre: $genre, sexualOrientation: $sexualOrientation, password: $password) {
    email
    username
    firstname
    lastname
    birthDate
    genre
    sexualOrientation
  }
}
`;

class FormStep3 extends React.Component { 
    state = {
      password: '',
      verif: ''
    };

    handleSubmit = e => {
      e.preventDefault();
      if (this.state.password === '') {
        console.log('NOPPPP');
      } else {
        console.log('THIS SUBMIT');
        console.log(this.props);
        this.props.SaveToDb({
          variables: {
            email: this.props.email,
            username: this.props.username,
            firstname: this.props.firstname,
            lastname: this.props.lastname,
            birthDate: this.props.birthDate,
            genre: this.props.genre,
            sexualOrientation: this.props.sexualOrientation,
            password: this.state.password
          }
        })
        this.props.saveUserInfo({ password: this.state.password });
        this.props.changeState.next();
      }
    }

    render() {
      console.log(this.props);
      return (
          <div id="form-step-3">
              <form id="form-step-3-form" onSubmit={e => this.handleSubmit(e)}>
                <div id="form-step-3-form-box-1">
                  <label id="form-step-3-form-pwd-title">Mot de passe</label>
                  <input id="form-step-3-form-pwd" type="password" onChange={e => this.setState({ password: e.target.value })}/>
                </div>
                <div id="form-step-3-form-box-2">
                  <label id="form-step-3-form-verif-pwd-title">Vérification du mot de passe</label>
                  <input id="form-step-3-form-verif-pwd" type="password" onChange={e => this.setState({ verif: e.target.value })}/>
                </div>
                <div id="form-step-3-form-box-3">
                  <button id="form-step-3-previous" type="button" onClick={this.props.changeState.previous}>Previous</button>
                  <button id="form-step-3-submit" type="submit">Submit</button>
                </div>
              </form>
          </div>
      );
    }
}

const mapStateToProps = state => ({
  email: state.email,
  username: state.username,
  firstname: state.firstname,
  lastname: state.lastname,
  birthDate: state.birthDate,
  genre: state.genre,
  sexualOrientation: state.sexualOrientation
});

const mapDispatchToProps = dispatch => ({
  saveUserInfo: info => dispatch(saveUserInfo(info))
});

export default compose(
  graphql(SAVE_TO_DB, { name: 'SaveToDb'})
)(connect(mapStateToProps, mapDispatchToProps)(FormStep3));