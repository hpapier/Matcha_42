import React, { Component } from 'react';
import personIcon from '../../../../../assets/person.svg';
import emailIcon from '../../../../../assets/email.svg';
import './index.sass';

class PasswordForgot extends Component {
  render() {
    return (
      <div id='lgo-password-forgot'>
        <div id='lgo-password-forgot-line'></div>

        <div id='lgo-password-forgot-username'>
          <img src={personIcon} alt='' id='lgo-password-forgot-username-icon' />
          <input type='text' id='lgo-password-forgot-username-input' placeholder="Nom d'utilisateur" />
        </div>

        <div id='lgo-password-forgot-email'>
          <img src={emailIcon} alt='' id='lgo-password-forgot-email-icon' />
          <input type='text' id='lgo-password-forgot-email-input' placeholder='Adresse email' />
        </div>

        <button id='lgo-password-forgot-submit'>envoyer un email</button>
      </div>
    );
  }
};

export default PasswordForgot;