import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Mutation } from 'react-apollo';
import { logUserIn } from '../../../../../store/action/synchronous';
import PasswordForgot from '../PasswordForgot';
import personIcon from '../../../../../assets/person.svg';
import lockIcon from '../../../../../assets/lock.svg';
import './index.sass';

import { USER_AUTH_MUTATION } from '../../../../../query';

class SignUp extends Component {
  state = {
    activeResetPwd: false,
    usernameInput: '',
    passwordInput: '',
    errorMsg: false
  };

  handleSubmit = async (e, mutation) => {
    e.preventDefault();
    this.setState({ errorMsg: false });
    const regexp = /('|<|;|>|\/|\(|\)|\.|&|"|§|!|\$|\^|\+|\\|\-|,|\?|=|\*|£|%|°|¨|\`|:|#|\||›|\/|‚|™)/;
    const { usernameInput, passwordInput } = this.state;
    if (!usernameInput || !passwordInput) {
      this.setState({ errorMsg: 'Tout les champs doivent être remplis' });
      return;
    }

    if (usernameInput.match(regexp) || passwordInput.match(regexp)) {
      this.setState({ errorMsg: 'Les caractères spéciaux sont interdits.'});
      return;
    }

    const { firstRefetch } = this.props;
    mutation({
      variables: {
      username: usernameInput,
      password: passwordInput
      }
    })
    .then(res => {
      if (res.data) {
        if (res.data.userAuth.message === 'Success') {
          localStorage.setItem('auth_token', res.data.userAuth.token);
          firstRefetch();
        }
      }
    });
  }

  getCorrectMsg = msg => {
    if (msg === 'Success')
      return '';
    if (msg === 'User not exist')
      return 'Ce compte n\'existe pas';
    if (msg === 'Wrong password')
      return 'Mot de passe incorrect';
    if (msg === 'Account not confirmed')
      return 'Ce compte n\’est pas confirmé';
    return 'Oups! Une erreur est survenue..';
  }

  render() {
    const { activeResetPwd, usernameInput, passwordInput, errorMsg } = this.state;
    return (
      <Mutation mutation={USER_AUTH_MUTATION}>
      {
        (userAuth, { loading, data, error }) => {
          return (
            <div id='lgo-sign-up'>
              <form onSubmit={e => this.handleSubmit(e, userAuth)} id='lgo-sign-up-form'>
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
        
                { loading ? <div id='lgo-sign-up-loading'><div id='lgo-sign-up-loading-animation'></div></div> : <button type='submit' id='lgo-sign-up-submit'>connexion</button> }
              </form>
              <div onClick={() => this.setState({ activeResetPwd: !this.state.activeResetPwd })} id='lgo-sign-up-forgot'>Mot de passe oublié ?</div>
              { errorMsg ?
                <div className='lgo-sign-up-error'>{errorMsg}</div> :
                  error ? <div className='lgo-sign-up-error'>{typeof error === 'object' ? 'Oups! Une erreur est survenue..' : error}</div>:
                    (data) ? (data.userAuth) ? <div className={data.userAuth.message === 'Success' ? 'lgo-sign-up-success' : 'lgo-sign-up-error'}>{this.getCorrectMsg(data.userAuth.message)}</div> : null : null
              }
              {
                activeResetPwd ?
                <PasswordForgot /> :
                null
              }
            </div>
          );
        }
      }
      </Mutation>
    );
  }
};

const mapDispatchToProps = dispatch => ({
  logUserIn: () => dispatch(logUserIn())
});

export default connect(null, mapDispatchToProps)(SignUp);