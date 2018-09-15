// Modules imports.
import React, { Component } from 'react';
import { Mutation } from 'react-apollo';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';


// Locals imports.
import './index.sass';
import { UPDATE_LASTNAME_MUTATION } from '../../../../../../query';
import editIcon from '../../../../../../assets/edit.svg';
import validateIcon from '../../../../../../assets/validate.svg';
import cancelIcon from '../../../../../../assets/cancel.svg';
import { updateUserLastnameMechanism, clearStore } from '../../../../../../store/action/synchronous';


// LastName Component
class LastName extends Component {
  state = {
    modifActive: false,
    lastnameInput: '',
    errorMsg: ''
  };

  _unmount = false;

  componentWillUnmount() {
    this._unmount = true;
  }

  updateMechanism = mutation => {
    const { lastnameInput } = this.state;
    if (!lastnameInput) {
      this.setState({ errorMsg: 'Veuillez remplir le champs. '});
      return;
    }

    const regexp = /('|<|;|>|\/|\(|\)|\.|&|"|§|!|\$|\^|\+|\\|\-|,|\?|=|\*|£|%|°|¨|\`|:|#|\||›|\/|‚|™)/;
    if (lastnameInput.match(regexp)) {
      this.setState({ errorMsg: 'Caractères spéciaux interdits.' });
      return;
    }

    if (lastnameInput.length > 255) {
      this.setState({ errorMsg: 'Maximum 255 caractères.' });
      return;
    }

    mutation({ variables: { lastname: lastnameInput }})
    .then(r => {
      if (!this._unmount) {
        this.setState({ modifActive: false, errorMsg: '', lastnameInput: '' });
        this.props.updateUserLastnameMechanism(r.data.updateUserLastname.data);
      }
    })
    .catch(error => {
      if (error.graphQLErrors && error.graphQLErrors[0]) {
        if (error.graphQLErrors[0].message === 'Not auth') {
          this.client.resetStore()
            .then(r => { return; })
            .catch(e => { return; })
          localStorage.removeItem('auth_token');
          this.props.clearStore();
          this.props.history.push('/');
        }
      }

      if (!this._unmount) {
        if (error.graphQLErrors[0].message === 'Contains invalid char')
          this.setState({ modifActive: true, errorMsg: 'Caractères spéciaux interdits.' });
        else if (error.graphQLErrors[0].message === 'Character string too long')
          this.setState({ modifActive: true, errorMsg: 'Maximum 255 caractères.' });
        else
          this.setState({ modifActive: true, errorMsg: 'Oups! Une erreur est survenue..' });
      }
    });
  }

  render() {
    return (
      <Mutation mutation={UPDATE_LASTNAME_MUTATION}>
      {
        (updateUserLastname, { loading, client }) => {
          this.client = client;
          const { lastnameInput, modifActive, errorMsg } = this.state;
          const { userLastname } = this.props;
          return (
            <div id='lgi-profil-view-pi-lastname'>
              <div id='lgi-profil-view-pi-lastname-box1'>
                <div id='lgi-profil-view-pi-lastname-box1-title'>nom</div>
                {
                  !modifActive ?
                  <div id='lgi-profil-view-pi-lastname-box1-content'>{userLastname.length > 30 ? userLastname.substring(0, 30) + '..' : userLastname}</div> :
                  <input
                    id='lgi-profil-view-pi-lastname-box1-input'
                    type='text'
                    value={lastnameInput}
                    onChange={e => loading ? null : this.setState({ lastnameInput: e.target.value })}
                    placeholder='Saisissez un nom..'
                    autoFocus
                  />
                }
                { errorMsg && modifActive ? <div id='lgi-profil-view-pi-lastname-box1-error'>{errorMsg}</div> : null }
              </div>
              <div id='lgi-profil-view-pi-lastname-box2'>
              {
                loading ? 
                <div id='lgi-profil-view-pi-lastname-box2-loading'></div> :
                  !modifActive ?
                  <button
                    onClick={() => this.setState({ modifActive: true })}
                    id='lgi-profil-view-pi-lastname-box2-edit'
                  >
                    <img src={editIcon} alt='edit' id='lgi-profil-view-pi-lastname-box2-edit-icon' />
                  </button> :
                  <div id='lgi-profil-view-pi-lastname-box2-update'>
                    <button
                      id='lgi-profil-view-pi-lastname-box2-update-validate'
                      onClick={() => this.updateMechanism(updateUserLastname)}
                    >
                      <img src={validateIcon} alt='validate' />
                    </button>
                    <button
                      id='lgi-profil-view-pi-lastname-box2-update-cancel'
                      onClick={() => this.setState({ modifActive: false, lastnameInput: '', errorMsg: '' })}
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
  userLastname: state.user.lastname
});

const mapDispatchToProps = dispatch => ({
  updateUserLastnameMechanism: lastname => dispatch(updateUserLastnameMechanism(lastname)),
  clearStore: () => dispatch(clearStore())
})

// Exports.
export default connect(mapStateToProps, mapDispatchToProps)(withRouter(LastName));