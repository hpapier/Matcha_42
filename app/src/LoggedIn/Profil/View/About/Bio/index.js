// Modules imports.
import React, { Component } from 'react';
import { Mutation } from 'react-apollo';
import { connect } from 'react-redux';


// Locals imports.
import './index.sass';
import { UPDATE_BIO_MUTATION } from '../../../../../../query';
import editIcon from '../../../../../../assets/edit.svg';
import validateIcon from '../../../../../../assets/validate.svg';
import cancelIcon from '../../../../../../assets/cancel.svg';
import { updateUserBioMechanism } from '../../../../../../store/action/synchronous';


// Bio Component
class Bio extends Component {
  state = {
    errorMsg: '',
    bioInput: ''
  };

  _unmount = false;

  componentWillUnmount() {
    this._unmount = true
  }

  updateMechanism = (mutation) => {
    const { bioInput } = this.state;
    if (!bioInput) {
      this.setState({ errorMsg: 'Veuillez remplir le champs.' });
      return;
    }

    if (bioInput.length > 255) {
      this.setState({ errorMsg: 'Maximum 255 caractères.' });
      return;
    }

    mutation({ variables: { bio: bioInput }})
    .then(r => {
      if (!this._unmount)
        this.setState({ errorMsg: '', modifActive: false });
      this.props.updateUserBioMechanism(r.data.updateUserBio.data);
    })
    .catch(e => {
      if (!this._unmount) {
        this.setState({ errorMsg: "Oups! Une erreur est survenue.." });
      }
    });
  }

  render() {
    return (
      <Mutation mutation={UPDATE_BIO_MUTATION}>
      {
        (updateUserBio, { loading, error, data }) => {
          const { errorMsg, modifActive, bioInput } = this.state;
          const { bio } = this.props;
          return (
            <div id='lgi-profil-view-pi-bio'>
              <div id='lgi-profil-view-pi-bio-box1'>
                <div id='lgi-profil-view-pi-bio-box1-title'>Bio</div>
                {
                  !modifActive ? 
                  <div id='lgi-profil-view-pi-bio-box1-content'>{bio ? bio : 'Aucune bio'}</div> :
                  <div>
                    <textarea id='lgi-profil-view-pi-bio-box1-textarea' cols={4} placeholder='Saisissez une bio..' onChange={e => this.setState({ bioInput: e.target.value })}></textarea>
                  </div>
                }
                { errorMsg && modifActive ? <div id='lgi-profil-view-pi-bio-box1-error'>{errorMsg}</div> : null }
              </div>
              <div id='lgi-profil-view-pi-bio-box2'>
              {
                loading ? 
                <div id='lgi-profil-view-pi-bio-box2-loading'></div> :
                  !modifActive ?
                  <button
                  onClick={() => this.setState({ modifActive: true })}
                  id='lgi-profil-view-pi-bio-box2-edit'
                  >
                    <img src={editIcon} alt='edit' id='lgi-profil-view-pi-bio-box2-edit-icon' />
                  </button> :
                  <div id='lgi-profil-view-pi-bio-box2-update'>
                    <button
                      id='lgi-profil-view-pi-bio-box2-update-validate'
                      onClick={() => this.updateMechanism(updateUserBio)}
                    >
                      <img src={validateIcon} alt='validate' />
                    </button>
                    <button
                      id='lgi-profil-view-pi-bio-box2-update-cancel'
                      onClick={() => this.setState({ modifActive: false, bioInput: '', errorMsg: '' })}
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
  bio: state.user.bio
});

const mapDispatchToProps = dispatch => ({
  updateUserBioMechanism: bio => dispatch(updateUserBioMechanism(bio))
});


// Exports.
export default connect(mapStateToProps, mapDispatchToProps)(Bio);