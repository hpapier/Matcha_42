// Modules imports.
import React, { Component } from 'react';
import { Mutation } from 'react-apollo';
import { connect } from 'react-redux';


// Locals imports.
import './index.sass';
import { UPDATE_LASTNAME_MUTATION } from '../../../../../../query';
import editIcon from '../../../../../../assets/edit.svg';
import validateIcon from '../../../../../../assets/validate.svg';
import cancelIcon from '../../../../../../assets/cancel.svg';
import { updateUserLastnameMechanism } from '../../../../../../store/action/synchronous';


// LastName Component
class LastName extends Component {
  state = {
    modifActive: false,
    lastnameInput: '',
    errorMsg: ''
  };

  updateMechanism = mutation => {
    const { lastnameInput } = this.state;
    if (!lastnameInput) {
      this.setState({ errorMsg: 'Veuillez remplir le champs. '});
      return;
    }

    const regexp = /('|<|;|>|\/|\(|\)|\.|&|"|§|!|\$|\^|\+|\\|\-|,|\?|=|\*|£|%|°|¨|\`|:|#|\||›|\/|‚|™)/;
    if (lastnameInput.match(regexp)) {
      this.setState({ errorMsg: 'Caractères spéciaux interdits.'});
      return;
    }

    if (lastnameInput.length > 255) {
      this.setState({ errorMsg: 'Maximum 255 caractères.'});
      return;
    }

    mutation({ variables: { lastname: lastnameInput }})
    .then(r => {
      this.setState({ modifActive: false, errorMsg: '', lastnameInput: '' });
      this.props.updateUserLastnameMechanism(r.data.updateUserLastname.data);
    })
    .catch(e => this.setState({ modifActive: true, errorMsg: "Oups! Une erreur est survenue.." }));
  }

  render() {
    return (
      <Mutation mutation={UPDATE_LASTNAME_MUTATION}>
      {
        (updateUserLastname, { loading, error, data }) => {
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
  updateUserLastnameMechanism: lastname => dispatch(updateUserLastnameMechanism(lastname))
})

// Exports.
export default connect(mapStateToProps, mapDispatchToProps)(LastName);