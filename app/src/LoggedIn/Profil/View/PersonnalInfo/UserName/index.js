// Modules imports.
import React, { Component } from 'react';
import { Mutation } from 'react-apollo';
import { connect } from 'react-redux';


// Locals imports.
import './index.sass';
import { UPDATE_USERNAME_MUTATION } from '../../../../../../query';
import editIcon from '../../../../../../assets/edit.svg';
import validateIcon from '../../../../../../assets/validate.svg';
import cancelIcon from '../../../../../../assets/cancel.svg';
import { updateUsernameMechanism } from '../../../../../../store/action/synchronous';


// UserName Component
class UserName extends Component {
  state = {
    modifActive: false,
    usernameInput: '',
    errorMsg: ''
  };

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
      this.setState({ modifActive: false, errorMsg: '', usernameInput: '' });
      this.props.updateUsernameMechanism(r.data.updateUsername.username);
    })
    .catch(e => {
      console.log('--- IN CATCH ---');
      console.log(e);
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
  updateUsernameMechanism: username => dispatch(updateUsernameMechanism(username))
})

// Exports.
export default connect(mapStateToProps, mapDispatchToProps)(UserName);