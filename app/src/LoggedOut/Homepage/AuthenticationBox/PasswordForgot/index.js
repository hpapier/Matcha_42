// Modules imports.
import React, { Component } from 'react';
import { Mutation } from 'react-apollo';

// Local import.
import personIcon from '../../../../../assets/person.svg';
import emailIcon from '../../../../../assets/email.svg';
import { SEND_EMAIL_RESET_MUTATION } from '../../../../../query';
import './index.sass';

class PasswordForgot extends Component {
  state = {
    username: '',
    email: '',
    errorMsg: ''
  };

  handleSubmit = (e, mutation) => {
    e.preventDefault();
    console.log('Submit');

    this.setState({ errorMsg: '' });
    const { username, email } = this.state;
    if (!username || !email) {
      this.setState({ errorMsg: 'Veuillez remplir tout les champs' });
      return;
    }

    const regexp = /('|<|;|>|\/|\(|\)|\.|&|"|§|!|\$|\^|\+|\\|\-|,|\?|=|\*|£|%|°|¨|\`|:|#|\||›|\/|‚|™)/;
    if (username.match(regexp)) {
      this.setState({ errorMsg: 'Les caractères spéciaux sont interdits.'});
      return;
    }

    mutation({
      variables: {
        username,
        email
      }
    })
    .then(r => {
      if (r.data.sendEmailReset.message === 'Success')
        this.setState({ username: '', email: '', errorMsg: '' });
    });
  }

  getCorrectMsg = msg => {
    if (msg === 'User not exist')
      return 'Ce compte n\'existe pas';
    if (msg === 'Account not confirmed')
      return 'Votre compte n\'est pas encore confirmé';
    if (msg === 'Success')
      return 'Un email de ré-initialisation a bien été envoyé';
    return 'Oups! Une erreur est survenue..';
  }

  render() {
    return (
      <Mutation mutation={SEND_EMAIL_RESET_MUTATION}>
      {
        (sendEmailReset, { loading, data, error }) => {
          return (
            <form id='lgo-password-forgot' onSubmit={(e) => this.handleSubmit(e, sendEmailReset)}>
              <div id='lgo-password-forgot-line'></div>

              <div id='lgo-password-forgot-username'>
                <img src={personIcon} alt='' id='lgo-password-forgot-username-icon' />
                <input type='text' id='lgo-password-forgot-username-input' placeholder="Nom d'utilisateur" onChange={e => this.setState({ username: e.target.value })} value={this.state.username} />
              </div>

              <div id='lgo-password-forgot-email'>
                <img src={emailIcon} alt='' id='lgo-password-forgot-email-icon' />
                <input type='text' id='lgo-password-forgot-email-input' placeholder='Adresse email' type='email' onChange={e => this.setState({ email: e.target.value })} value={this.state.email} />
              </div>

              { loading ?
                <div id='lgo-password-forgot-loading-box'>
                  <div id='lgo-password-forgot-loading-box-animation'></div>
                </div> : 
                <button id='lgo-password-forgot-submit' type='submit'>envoyer un email</button> }
              {
                this.state.errorMsg ?
                <div className='lgo-password-forgot-error'>{this.state.errorMsg}</div> :
                  error ?
                  <div className='lgo-password-forgot-error'>{typeof error === 'object' ? 'Oups! Une erreur est survenue..' : error}</div> :
                    data ?
                    <div className={ data.sendEmailReset.message === 'Success' ? 'lgo-password-forgot-success' : 'lgo-password-forgot-error'}>{this.getCorrectMsg(data.sendEmailReset.message)}</div> :
                    null
              }
            </form>
          );
        }
      }
      </Mutation>
    );
  }
};

export default PasswordForgot;