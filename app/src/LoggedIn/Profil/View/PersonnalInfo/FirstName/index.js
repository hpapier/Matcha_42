// Modules imports.
import React, { Component } from 'react';
import { Mutation } from 'react-apollo';
import { connect } from 'react-redux';


// Locals imports.
import './index.sass';
import { UPDATE_FIRSTNAME_MUTATION } from '../../../../../../query';
import editIcon from '../../../../../../assets/edit.svg';
import validateIcon from '../../../../../../assets/validate.svg';
import cancelIcon from '../../../../../../assets/cancel.svg';
import { updateUserFirstnameMechanism } from '../../../../../../store/action/synchronous';


// FirstName Component
class FirstName extends Component {
  state = {
    modifActive: false,
    firstnameInput: '',
    errorMsg: ''
  };

  updateMechanism = mutation => {
    const { firstnameInput } = this.state;
    if (!firstnameInput) {
      this.setState({ errorMsg: 'Veuillez remplir le champs. '});
      return;
    }

    const regexp = /('|<|;|>|\/|\(|\)|\.|&|"|§|!|\$|\^|\+|\\|\-|,|\?|=|\*|£|%|°|¨|\`|:|#|\||›|\/|‚|™)/;
    if (firstnameInput.match(regexp)) {
      this.setState({ errorMsg: 'Caractères spéciaux interdits.'});
      return;
    }

    if (firstnameInput.length > 255) {
      this.setState({ errorMsg: 'Maximum 255 caractères.'});
      return;
    }

    mutation({ variables: { firstname: firstnameInput }})
    .then(r => {
      this.setState({ modifActive: false, errorMsg: '', firstnameInput: '' });
      this.props.updateUserFirstnameMechanism(r.data.updateUserFirstname.data);
    })
    .catch(e => this.setState({ modifActive: true, errorMsg: "Oups! Une erreur est survenue.." }));
  }

  render() {
    return (
      <Mutation mutation={UPDATE_FIRSTNAME_MUTATION}>
      {
        (updateUserFirstname, { loading, error, data }) => {
          const { firstnameInput, modifActive, errorMsg } = this.state;
          const { userFirstname } = this.props;
          return (
            <div id='lgi-profil-view-pi-firstname'>
              <div id='lgi-profil-view-pi-firstname-box1'>
                <div id='lgi-profil-view-pi-firstname-box1-title'>prénom</div>
                {
                  !modifActive ?
                  <div id='lgi-profil-view-pi-firstname-box1-content'>{userFirstname.length > 30 ? userFirstname.substring(0, 30) + '..' : userFirstname}</div> :
                  <input
                    id='lgi-profil-view-pi-firstname-box1-input'
                    type='text'
                    value={firstnameInput}
                    onChange={e => loading ? null : this.setState({ firstnameInput: e.target.value })}
                    placeholder='Saisissez un prénom..'
                    autoFocus
                  />
                }
                { errorMsg && modifActive ? <div id='lgi-profil-view-pi-firstname-box1-error'>{errorMsg}</div> : null }
              </div>
              <div id='lgi-profil-view-pi-firstname-box2'>
              {
                loading ? 
                <div id='lgi-profil-view-pi-firstname-box2-loading'></div> :
                  !modifActive ?
                  <button
                    onClick={() => this.setState({ modifActive: true })}
                    id='lgi-profil-view-pi-firstname-box2-edit'
                  >
                    <img src={editIcon} alt='edit' id='lgi-profil-view-pi-firstname-box2-edit-icon' />
                  </button> :
                  <div id='lgi-profil-view-pi-firstname-box2-update'>
                    <button
                      id='lgi-profil-view-pi-firstname-box2-update-validate'
                      onClick={() => this.updateMechanism(updateUserFirstname)}
                    >
                      <img src={validateIcon} alt='validate' />
                    </button>
                    <button
                      id='lgi-profil-view-pi-firstname-box2-update-cancel'
                      onClick={() => this.setState({ modifActive: false, firstnameInput: '', errorMsg: '' })}
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
  userFirstname: state.user.firstname
});

const mapDispatchToProps = dispatch => ({
  updateUserFirstnameMechanism: firstname => dispatch(updateUserFirstnameMechanism(firstname))
})

// Exports.
export default connect(mapStateToProps, mapDispatchToProps)(FirstName);