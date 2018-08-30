// Modules imports.
import React, { Component } from 'react';
import { Mutation } from 'react-apollo';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';


// Locals imports.
import './index.sass';
import { UPDATE_SEXUAL_ORIENTATION_MUTATION } from '../../../../../../query';
import editIcon from '../../../../../../assets/edit.svg';
import validateIcon from '../../../../../../assets/validate.svg';
import cancelIcon from '../../../../../../assets/cancel.svg';
import { updateSexualOrientationMechanism, clearStore } from '../../../../../../store/action/synchronous';


// Genre Component
class Genre extends Component {
  state = {
    modifActive: false,
    sexualOrentationInput: '',
    errorMsg: ''
  };

  _unmount = false;

  componentWillUnmount() {
    this._unmount = true;
  }

  updateMechanism = mutation => {
    const { sexualOrentationInput } = this.state;
    if (!sexualOrentationInput) {
      this.setState({ errorMsg: 'Veuillez choisir un genre. '});
      return;
    }

    if (this.props.sexualOrientation === sexualOrentationInput) {
      this.setState({ modifActive: false, errorMsg: '', sexualOrentationInput: '' });
      return;
    }

    mutation({ variables: { sexualOrientation: sexualOrentationInput }})
    .then(r => {
      if (!this._unmount) {
        this.setState({ modifActive: false, errorMsg: '', sexualOrentationInput: '' });
        this.props.updateSexualOrientationMechanism(r.data.updateUserSO.data);
      }
    })
    .catch(error => {
      if (error.graphQLErrors[0].message === 'Not auth') {
        localStorage.removeItem('auth_token');
        this.props.clearStore();
        this.props.history.push('/');
      }

      if (!this._unmount)
        this.setState({ modifActive: true, errorMsg: "Oups! Une erreur est survenue.." });
    });
  }

  render() {
    return (
      <Mutation mutation={UPDATE_SEXUAL_ORIENTATION_MUTATION}>
      {
        (updateUserSO, { loading }) => {
          const { modifActive, errorMsg } = this.state;
          const { sexualOrientation } = this.props;
          return (
            <div id='lgi-profil-view-pi-genre'>
              <div id='lgi-profil-view-pi-genre-box1'>
                <div id='lgi-profil-view-pi-genre-box1-title'>Orientation sexuelle</div>
                {
                  !modifActive ?
                  <div id='lgi-profil-view-pi-genre-box1-content'>{sexualOrientation === 'man' ? 'Homme' : (sexualOrientation === 'woman' ? 'Femme' : 'Homme et Femme')}</div> :
                  <select
                    id='lgi-profil-view-pi-genre-box1-input'
                    defaultValue='no-value'
                    onChange={e => loading ? null : this.setState({ sexualOrentationInput: e.target.value })}
                  >
                    <option value='no-value' hidden>Intéressé par..</option>
                    <option value='man'>Homme</option>
                    <option value='woman'>Femme</option>
                    <option value='bisexual'>Homme et Femme</option>
                  </select>
                }
                { errorMsg && modifActive ? <div id='lgi-profil-view-pi-genre-box1-error'>{errorMsg}</div> : null }
              </div>
              <div id='lgi-profil-view-pi-genre-box2'>
              {
                loading ? 
                <div id='lgi-profil-view-pi-genre-box2-loading'></div> :
                  !modifActive ?
                  <button
                    onClick={() => this.setState({ modifActive: true })}
                    id='lgi-profil-view-pi-genre-box2-edit'
                  >
                    <img src={editIcon} alt='edit' id='lgi-profil-view-pi-genre-box2-edit-icon' />
                  </button> :
                  <div id='lgi-profil-view-pi-genre-box2-update'>
                    <button
                      id='lgi-profil-view-pi-genre-box2-update-validate'
                      onClick={() => this.updateMechanism(updateUserSO)}
                    >
                      <img src={validateIcon} alt='validate' />
                    </button>
                    <button
                      id='lgi-profil-view-pi-genre-box2-update-cancel'
                      onClick={() => this.setState({ modifActive: false, sexualOrentationInput: '', errorMsg: '' })}
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
  sexualOrientation: state.user.sexualOrientation
});

const mapDispatchToProps = dispatch => ({
  updateSexualOrientationMechanism: sexualOrientation => dispatch(updateSexualOrientationMechanism(sexualOrientation)),
  clearStore: () => dispatch(clearStore())
})

// Exports.
export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Genre));