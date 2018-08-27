// Modules imports.
import React, { Component } from 'react';
import { Mutation } from 'react-apollo';
import { connect } from 'react-redux';


// Locals imports.
import './index.sass';
import { UPDATE_EMAIL_MUTATION } from '../../../../../../query';
import editIcon from '../../../../../../assets/edit.svg';
import validateIcon from '../../../../../../assets/validate.svg';
import cancelIcon from '../../../../../../assets/cancel.svg';
import { updateEmailMechanism } from '../../../../../../store/action/synchronous';


// Email Component
class Email extends Component {
  state = {
    modifActive: false,
    emailInput: '',
    errorMsg: ''
  };

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

    if (emailInput.length > 100) {
      this.setState({ errorMsg: 'Maximum 100 caractères.'});
      return;
    }

    if (this.props.email === emailInput) {
      this.setState({ modifActive: false, errorMsg: '', emailInput: '' });
      return;
    }

    mutation({ variables: { email: emailInput }})
    .then(r => {
      this.setState({ modifActive: false, errorMsg: '', emailInput: '' });
      this.props.updateEmailMechanism(r.data.updateUserEmail.data);
    })
    .catch(e => {
      if (e.message === 'GraphQL error: Already exist.')
        this.setState({ modifActive: true, errorMsg: "Email déjà pris." });
      else
        this.setState({ modifActive: true, errorMsg: "Oups! Une erreur est survenue.." });
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
                  <div id='lgi-profil-view-pi-email-box1-content'>{email.length > 33 ? email.substring(0, 33) + '..' : email}</div> :
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
  updateEmailMechanism: email => dispatch(updateEmailMechanism(email))
})

// Exports.
export default connect(mapStateToProps, mapDispatchToProps)(Email);