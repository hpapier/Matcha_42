// Modules imports.
import React, { Component } from 'react';
import { Query, Mutation } from 'react-apollo';
import { Link } from 'react-router-dom';


// Local import.
import { RESET_TOKEN_VERIFICATION_QUERY, RESET_PASSWORD_MUTATION } from '../../../query';
import backgroundImage1 from '../../../assets/bg-1.jpg';
import lockIcon from '../../../assets/lock.svg';
import './index.sass';


// Set Password Form
class SetPasswordForm extends Component {
  state = {
    password: '',
    verif: '',
    errorMsg: ''
  };

  handleSubmit = (e, mutation) => {
    e.preventDefault();
    if (this.state.errorMsg)
      this.setState({ errorMsg: '' });

    const regexp = /('|<|;|>|\/|\(|\)|\.|&|"|§|!|\$|\^|\+|\\|\-|,|\?|=|\*|£|%|°|¨|\`|:|#|\||›|\/|‚|™)/;
    const { password, verif } = this.state;
    if (!password || !verif) {
      this.setState({ errorMsg: 'Veuillez completer tout les champs' });
      return;
    }

    if (password.match(regexp) || verif.match(regexp)) {
      this.setState({ errorMsg: 'Les caractères spéciaux sont interdits' });
      return;
    }

    if (password !== verif) {
      this.setState({ errorMsg: 'Vérification du mot de passe incorrect' });
      return;
    }

    const resetToken = this.props.resetToken;
    const username = this.props.username;
    mutation({ variables: { username, resetToken, password }})
    .then(r => {
      if (r.data.resetPassword.message === 'Success')
        this.setState({ password: '', verif: '', errorMsg: '' });
    })
  }

  render() {
    const { errorMsg } = this.state;
    return (
      <Mutation mutation={RESET_PASSWORD_MUTATION}>
      {
        (resetPassword, { loading, data, error }) => {
          return (
            <div>
              {
                data && data.resetPassword.message === 'Success' ?
                <div id='lgo-set-password-form-succes-view'>
                  <div id='lgo-set-password-form-succes-view-title'>Votre mot de passe a correctement été réinitialiser</div>
                  <Link id='lgo-homepage-view-response-box-link-reset-page'to='/'>Retour au site</Link>
                </div> : 
                <form id='lgo-set-password-form' onSubmit={e => this.handleSubmit(e, resetPassword)}>
                  <input type='text' autoComplete='username' hidden /> 
                  <div className='lgo-set-password-form-input-box top'>
                    <img src={lockIcon} alt='lock-icon' className='lgo-set-password-form-input-box-icon' />
                    <input type='password' autoComplete='new-password' placeholder='Mot de passe' className='lgo-set-password-form-input-box-input top' onChange={e => this.setState({ password: e.target.value })} value={this.state.password} />
                  </div>
                  <div className='lgo-set-password-form-input-box bottom'>
                    <img src={lockIcon} alt='lock-icon' className='lgo-set-password-form-input-box-icon' />
                    <input type='password' autoComplete='new-password' placeholder='Vérification du mot de passe' className='lgo-set-password-form-input-box-input bottom' onChange={e => this.setState({ verif: e.target.value })} value={this.state.verif} />
                  </div>
                  { loading ? <div id='lgo-set-password-form-loading-box'><div id='lgo-set-password-form-loading-box-animation'></div></div> : <button type='submit' id='lgo-set-password-form-submit'>réinitialiser</button> }
                  {
                    errorMsg ?
                    <div className='lgo-set-password-form-error'>{errorMsg}</div> :
                      error ?
                      <div className='lgo-set-password-form-error'>{typeof error === 'object' ? 'Oups! Une erreur est survenue..' : error}</div> :
                        data ?
                        <div className={data.resetPassword.message === 'Success' ? 'lgo-set-password-form-success' : 'lgo-set-password-form-error'}>{data.resetPassword.message}</div> :
                        null
                  }
                </form>
              }
            </div>
          );
        }
      }
      </Mutation>
    );
  }
};

// Confirm Email Component
const SetPassword = props => {
  const resetToken = props.match.params.token;
  const username = props.match.params.username;

  const getCorrectMsg = msg => {
    if (msg === 'Success')
      return <SetPasswordForm resetToken={resetToken} username={username} />;
    else if (msg === 'Invalid token')
      return 'Code invalide';
    else if (msg === 'User not exist')
      return 'Ce compte n\'existe pas.';
    else
      return 'Oups! Une erreur est survenue..';
  }

  return (
    <Query query={RESET_TOKEN_VERIFICATION_QUERY} variables={{ username, resetToken }}>
    {
      ({ loading, error, data }) => {
        console.log(data);
        return (
          <div id='lgo-homepage-reset-page'>
            <img id='lgo-homepage-background-reset-page' src={backgroundImage1} alt='background' />
            <div id='lgo-homepage-view-reset-page'>
              <div id='lgo-homepage-view-reset-page-title'>Réinitialisation de votre mot de passe</div>
              <div id='lgo-homepage-view-response-reset-page'>
                {
                  loading ? 
                  <div id='lgo-homepage-view-response-loading-reset-page-box'><div id='lgo-homepage-view-response-loading-reset-page'></div></div> :
                    error ?
                    <div className='lgo-homepage-view-response-error-reset-page'>{typeof error === 'object' ? 'Oups! Une erreur est survenue..' : error}</div> :
                      data ?
                      <div id='lgo-homepage-view-response-box-reset-page'>
                        <div className={data.resetTokenVerification.message !== 'Success' ? 'lgo-homepage-view-response-error-reset-page' : 'lgo-homepage-view-response-success-reset-page'}>{getCorrectMsg(data.resetTokenVerification.message)}</div>
                      </div> : 
                      null
                }
                { !loading ?
                    data ? 
                      data.resetTokenVerification.message !== 'Success' ?
                      <Link id='lgo-homepage-view-response-box-link-reset-page'to='/'>Retour au site</Link> :
                      null
                    : <Link id='lgo-homepage-view-response-box-link-reset-page'to='/'>Retour au site</Link>
                  : <Link id='lgo-homepage-view-response-box-link-reset-page'to='/'>Retour au site</Link>
                }
              </div>
            </div>
            <div id='lgo-homepage-box-reset-page'>
              <div id='lgo-homage-box-copyright-reset-page'>©hpapier 2017-2018</div>
            </div>
          </div>
        );
      }
    }
    </Query>
  );
};


// Export.
export default SetPassword;