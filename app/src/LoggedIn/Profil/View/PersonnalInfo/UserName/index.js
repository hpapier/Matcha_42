// Modules imports.
import React, { Component } from 'react';
import { Mutation } from 'react-apollo';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';


// Locals imports.
import './index.sass';
import { UPDATE_USERNAME_MUTATION } from '../../../../../../query';
import editIcon from '../../../../../../assets/edit.svg';
import validateIcon from '../../../../../../assets/validate.svg';
import cancelIcon from '../../../../../../assets/cancel.svg';
import { updateUsernameMechanism, clearStore } from '../../../../../../store/action/synchronous';


// UserName Component
class UserName extends Component {
  state = {
    modifActive: false,
    usernameInput: '',
    errorMsg: ''
  };

  _unmount = false;

  componentWillUnmount() {
    this._unmount = true;
  }

  updateMechanism = mutation => {
    const { usernameInput } = this.state;
    if (!usernameInput) {
      this.setState({ errorMsg: 'Veuillez remplir le champs. '});
      return;
    }

    const regexp = /('|<|;|>|\/|\(|\)|\.|&|"|§|!|\$|\^|\+|\\|\-|,|\?|=|\*|£|%|°|¨|\`|:|#|\||›|\/|‚|™)/;
    if (usernameInput.match(regexp)) {
      this.setState({ errorMsg: 'Caractères spéciaux interdits.'});
      return;
    }

    if (usernameInput.length > 255) {
      this.setState({ errorMsg: 'Maximum 255 caractères.'});
      return;
    }

    if (this.props.username === usernameInput) {
      this.setState({ modifActive: false, errorMsg: '', usernameInput: '' });
      return;
    }

    mutation({ variables: { username: usernameInput }})
    .then(r => {
      if (!this._unmount) {
        this.setState({ modifActive: false, errorMsg: '', usernameInput: '' });
        this.props.updateUsernameMechanism(r.data.updateUsername.data);
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
        if (message === 'Contains invalid char')
          this.setState({ modifActive: true, errorMsg: 'Caractères spéciaux interdits.' });
        else if (message === 'Character string too long')
          this.setState({ modifActive: true, errorMsg: 'Maximum 255 caractères.' });
        else if (message === 'Already exist')
          this.setState({ modifActive: true, errorMsg: "Nom d'utilisateur déjà pris." });
        else
          this.setState({ modifActive: true, errorMsg: 'Oups! Une erreur est survenue..' });
      }
    });
  }

  render() {
    return (
      <Mutation mutation={UPDATE_USERNAME_MUTATION}>
      {
        (updateUsername, { loading }) => {
          const { usernameInput, modifActive, errorMsg } = this.state;
          const { username } = this.props;
          return (
            <div id='lgi-profil-view-pi-username'>
              <div id='lgi-profil-view-pi-username-box1'>
                <div id='lgi-profil-view-pi-username-box1-title'>nom d'utilisateur</div>
                {
                  !modifActive ?
                  <div id='lgi-profil-view-pi-username-box1-content'>{username.length > 30 ? username.substring(0, 30) + '..' : username}</div> :
                  <input
                    id='lgi-profil-view-pi-username-box1-input'
                    type='text'
                    value={usernameInput}
                    onChange={e => loading ? null : this.setState({ usernameInput: e.target.value })}
                    placeholder="Saisissez un nom d'utilisateur.."
                    autoFocus
                  />
                }
                { errorMsg && modifActive ? <div id='lgi-profil-view-pi-username-box1-error'>{errorMsg}</div> : null }
              </div>
              <div id='lgi-profil-view-pi-username-box2'>
              {
                loading ? 
                <div id='lgi-profil-view-pi-username-box2-loading'></div> :
                  !modifActive ?
                  <button
                    onClick={() => this.setState({ modifActive: true })}
                    id='lgi-profil-view-pi-username-box2-edit'
                  >
                    <img src={editIcon} alt='edit' id='lgi-profil-view-pi-username-box2-edit-icon' />
                  </button> :
                  <div id='lgi-profil-view-pi-username-box2-update'>
                    <button
                      id='lgi-profil-view-pi-username-box2-update-validate'
                      onClick={() => this.updateMechanism(updateUsername)}
                    >
                      <img src={validateIcon} alt='validate' />
                    </button>
                    <button
                      id='lgi-profil-view-pi-username-box2-update-cancel'
                      onClick={() => this.setState({ modifActive: false, usernameInput: '', errorMsg: '' })}
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
  username: state.user.username
});

const mapDispatchToProps = dispatch => ({
  updateUsernameMechanism: username => dispatch(updateUsernameMechanism(username)),
  clearStore: () => dispatch(clearStore())
})

// Exports.
export default connect(mapStateToProps, mapDispatchToProps)(withRouter(UserName));