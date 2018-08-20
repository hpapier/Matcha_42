import React, { Component } from 'react';
import { connect } from 'react-redux';
import { ApolloConsumer } from 'react-apollo';
import { logUserIn } from '../../../../../store/action/synchronous';
import PasswordForgot from '../PasswordForgot';
import personIcon from '../../../../../assets/person.svg';
import lockIcon from '../../../../../assets/lock.svg';
import './index.sass';

import { USER_AUTH_QUERY, USER_STATUS_QUERY } from '../../../../../query';

class SignUp extends Component {
  state = {
    activeResetPwd: false,
    usernameInput: '',
    passwordInput: '',
    errorMsg: false
  };

  handleSubmit = async (e, client) => {
    e.preventDefault();
    const { usernameInput, passwordInput } = this.state;
    if (!usernameInput || !passwordInput) {
      this.setState({ errorMsg: 'Tout les champs doivent être remplis' });
      return;
    }

    const { logUserIn } = this.props;
    const result = await client.query({
      query: USER_AUTH_QUERY,
      variables: {
        username: usernameInput,
        password: passwordInput
      }
    });
    const { data: userAuth} = result;
    logUserIn();
  }

  render() {
    const { activeResetPwd, usernameInput, passwordInput, errorMsg } = this.state;
    return (
      <ApolloConsumer>
      {
        client => {
          return (
            <div id='lgo-sign-up'>
              <form onSubmit={e => this.handleSubmit(e, client)}>
                <div id='lgo-sign-up-username'>
                  <img src={personIcon} alt='person-icon' id='lgo-sign-up-username-icon' />
                  <input
                    type='text'
                    autoComplete='off'
                    placeholder="Nom d'utilisateur"
                    id='lgo-sign-up-username-input'
                    onChange={e => this.setState({ usernameInput: e.target.value })} value={usernameInput}
                  />
                </div>
        
                <div id='lgo-sign-up-password'>
                  <img src={lockIcon} alt='lock-icon' id='lgo-sign-up-password-icon' />
                  <input
                    type='password'
                    autoComplete='off'
                    placeholder="Mot de passe"
                    id='lgo-sign-up-password-input'
                    onChange={e => this.setState({ passwordInput: e.target.value })} value={passwordInput}
                  />
                </div>
        
                <button type='submit' id='lgo-sign-up-submit'>connexion</button>
              </form>
              <div onClick={() => this.setState({ activeResetPwd: !this.state.activeResetPwd })} id='lgo-sign-up-forgot'>Mot de passe oublié ?</div>
              { errorMsg ? <div id='lgo-sign-up-error'>{errorMsg}</div> : null}
              {
                activeResetPwd ?
                <PasswordForgot /> :
                null
              }
            </div>
          );
        }
      }
      </ApolloConsumer>
    );
  }
};

const mapDispatchToProps = dispatch => ({
  logUserIn: () => dispatch(logUserIn())
});

export default connect(null, mapDispatchToProps)(SignUp);