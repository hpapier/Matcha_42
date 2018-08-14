import React, { Component } from 'react';
import PasswordForgot from '../PasswordForgot';
import personIcon from '../../../../../assets/person.svg';
import lockIcon from '../../../../../assets/lock.svg';
import './index.sass';

class SignUp extends Component {
  state = {
    activeResetPwd: false
  };

  render() {
    const { activeResetPwd } = this.state;
    return (
      <div id='lgo-sign-up'>
        <div id='lgo-sign-up-username'>
          <img src={personIcon} alt='person-icon' id='lgo-sign-up-username-icon' />
          <input type='text' placeholder="Nom d'utilisateur" id='lgo-sign-up-username-input' />
        </div>

        <div id='lgo-sign-up-password'>
          <img src={lockIcon} alt='lock-icon' id='lgo-sign-up-password-icon' />
          <input type='text' placeholder="Mot de passe" id='lgo-sign-up-password-input' />
        </div>

        <button id='lgo-sign-up-submit'>connexion</button>
        <div onClick={() => this.setState({ activeResetPwd: !this.state.activeResetPwd })} id='lgo-sign-up-forgot'>Mot de passe oublié ?</div>
        {
          activeResetPwd ?
          <PasswordForgot /> :
          null
        }
      </div>
    );
  }
};

export default SignUp;