// Modules imports.
import React, { Component } from 'react';
import { Mutation } from 'react-apollo';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';


// Locals imports.
import './index.sass';
import { UPDATE_EMAIL_MUTATION } from '../../../../../../query';
import editIcon from '../../../../../../assets/edit.svg';
import validateIcon from '../../../../../../assets/validate.svg';
import cancelIcon from '../../../../../../assets/cancel.svg';
import { updateEmailMechanism, clearStore } from '../../../../../../store/action/synchronous';


// Email Component
class Email extends Component {
  state = {
    modifActive: false,
    emailInput: '',
    errorMsg: ''
  };

  _unmount = false;

  componentWillUnmount() {
    this._unmount = true;
  }

  updateMechanism = mutation => {
    const { emailInput } = this.state;
    if (!emailInput) {
      this.setState({ errorMsg: 'Veuillez remplir le champs. '});
      return;
    }

    const regexp = /^([a-zA-Z0-9._-]+)@([a-zA-Z]+)\.([a-zA-Z]+)$/;
    if (!emailInput.match(regexp)) {
      this.setState({ errorMsg: 'Veuillez rentrer une adresse mail valide.'});
      return;
    }

    if (emailInput.length > 255) {
      this.setState({ errorMsg: 'Maximum 255 caractères.'});
      return;
    }

    if (this.props.email === emailInput) {
      this.setState({ modifActive: false, errorMsg: '', emailInput: '' });
      return;
    }

    mutation({ variables: { email: emailInput }})
    .then(r => {
      if (!this._unmount) {
        this.setState({ modifActive: false, errorMsg: '', emailInput: '' });
        this.props.updateEmailMechanism(r.data.updateUserEmail.data);
      }
    })
    .catch(error => {
      if (error.graphQLErrors[0].message === 'Not auth') {
        localStorage.removeItem('auth_token');
        this.props.clearStore();
        this.props.history.push('/');
      }

      if (!this._unmount) {
        const { message } = error.graphQLErrors[0];
        if (message === 'Invalid email')
          this.setState({ modifActive: true, errorMsg: 'Caractères spéciaux interdits.' });
        else if (message === 'Character string too long')
          this.setState({ modifActive: true, errorMsg: 'Maximum 255 caractères.' });
        else if (message === 'Already exist')
          this.setState({ modifActive: true, errorMsg: 'Cet email existe déjà.' });
        else
          this.setState({ modifActive: true, errorMsg: 'Oups! Une erreur est survenue..' });
      }
    });
  }

  render() {
    return (
      <Mutation mutation={UPDATE_EMAIL_MUTATION}>
      {
        (updateUserEmail, { loading }) => {
          const { emailInput, modifActive, errorMsg } = this.state;
          const { email } = this.props;
          return (
            <div id='lgi-profil-view-pi-email'>
              <div id='lgi-profil-view-pi-email-box1'>
                <div id='lgi-profil-view-pi-email-box1-title'>email</div>
                {
                  !modifActive ?
                  <div id='lgi-profil-view-pi-email-box1-content'>{email ? email.length > 33 ? email.substring(0, 33) + '..' : email : null}</div> :
                  <input
                    id='lgi-profil-view-pi-email-box1-input'
                    type='email'
                    value={emailInput}
                    onChange={e => loading ? null : this.setState({ emailInput: e.target.value })}
                    placeholder="Saisissez une adresse email.."
                    autoFocus
                  />
                }
                { errorMsg && modifActive ? <div id='lgi-profil-view-pi-email-box1-error'>{errorMsg}</div> : null }
              </div>
              <div id='lgi-profil-view-pi-email-box2'>
              {
                loading ? 
                <div id='lgi-profil-view-pi-email-box2-loading'></div> :
                  !modifActive ?
                  <button
                    onClick={() => this.setState({ modifActive: true })}
                    id='lgi-profil-view-pi-email-box2-edit'
                  >
                    <img src={editIcon} alt='edit' id='lgi-profil-view-pi-email-box2-edit-icon' />
                  </button> :
                  <div id='lgi-profil-view-pi-email-box2-update'>
                    <button
                      id='lgi-profil-view-pi-email-box2-update-validate'
                      onClick={() => this.updateMechanism(updateUserEmail)}
                    >
                      <img src={validateIcon} alt='validate' />
                    </button>
                    <button
                      id='lgi-profil-view-pi-email-box2-update-cancel'
                      onClick={() => this.setState({ modifActive: false, emailInput: '', errorMsg: '' })}
                    >
                      <img src={cancelIcon} alt='cancel' />
                    </button>
                  </div>
              }
              </div>
            </div>
          );
        }
      }
      </Mutation>
    );
  }
}

const mapStateToProps = state => ({
  email: state.user.email
});

const mapDispatchToProps = dispatch => ({
  updateEmailMechanism: email => dispatch(updateEmailMechanism(email)),
  clearStore: () => dispatch(clearStore())
})

// Exports.
export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Email));