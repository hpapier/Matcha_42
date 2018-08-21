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
      console.log(res);
      if (res.data) {
        if (res.data.userAuth.message === 'Success') {
          localStorage.setItem('auth_token', res.data.userAuth.token);
          firstRefetch();
        }
      }
    });
  }

  render() {
    const { activeResetPwd, usernameInput, passwordInput, errorMsg } = this.state;
    return (
      <Mutation mutation={USER_AUTH_MUTATION}>
      {
        (userAuth, { loading, data, error }) => {
          console.log(error);
          return (
            <div id='lgo-sign-up'>
              <form onSubmit={e => this.handleSubmit(e, userAuth)}>
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
        
                { loading ? <div>LOADING</div> : <button type='submit' id='lgo-sign-up-submit'>connexion</button> }
              </form>
              <div onClick={() => this.setState({ activeResetPwd: !this.state.activeResetPwd })} id='lgo-sign-up-forgot'>Mot de passe oublié ?</div>
              { errorMsg ?
                <div className='lgo-sign-up-error'>{errorMsg}</div> :
                  error ? <div className='lgo-sign-up-error'>{typeof error === 'object' ? 'Server error' : error}</div>:
                    (data) ? (data.userAuth) ? <div className={data.userAuth.message === 'Success' ? 'lgo-sign-up-success' : 'lgo-sign-up-error'}>{data.userAuth.message}</div> : null : null
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