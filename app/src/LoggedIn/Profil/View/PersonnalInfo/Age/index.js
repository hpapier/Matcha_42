// Modules imports.
import React, { Component } from 'react';
import { Mutation } from 'react-apollo';
import { connect } from 'react-redux';


// Locals imports.
import './index.sass';
import { UPDATE_DATE_MUTATION } from '../../../../../../query';
import editIcon from '../../../../../../assets/edit.svg';
import validateIcon from '../../../../../../assets/validate.svg';
import cancelIcon from '../../../../../../assets/cancel.svg';
import { updateUserBirthDateMechanism } from '../../../../../../store/action/synchronous';


// birthdate Component
class birthdate extends Component {
  state = {
    modifActive: false,
    dateValue: '',
    errorMsg: ''
  };

  updateMechanism = mutation => {
    const { dateValue } = this.state;
    if (!dateValue) {
      this.setState({ errorMsg: 'Date invalide. '});
      return;
    }

    const date = new Date(dateValue);
    if (date.getFullYear() > 2018 || date.getFullYear() < 1850) {
      this.setState({ errorMsg: 'Date invalide. '});
      return;
    }

    if (date === 'Invalid date') {
      this.setState({ errorMsg: 'Date invalide. '});
      return;
    }

    mutation({ variables: { birthdate: date }})
    .then(r => {
      this.setState({ modifActive: false, errorMsg: '', dateValue: '' });
      this.props.updateUserBirthDateMechanism(r.data.updateUserBirthDate.data);
    })
    .catch(e => {
      this.setState({ modifActive: true, errorMsg: "Oups! Une erreur est survenue.." });
    });
  }

  getAge = date => {
    var today = new Date();
    var birthDate = new Date(date);
    var age = today.getFullYear() - birthDate.getFullYear();
    var m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
  }

  render() {
    return (
      <Mutation mutation={UPDATE_DATE_MUTATION}>
      {
        (updateUserBirthDate, { loading }) => {
          const { dateValue, modifActive, errorMsg } = this.state;
          const { birthdate } = this.props;
          return (
            <div id='lgi-profil-view-pi-birthdate'>
              <div id='lgi-profil-view-pi-birthdate-box1'>
                <div id='lgi-profil-view-pi-birthdate-box1-title'>âge</div>
                {
                  !modifActive ?
                  <div id='lgi-profil-view-pi-birthdate-box1-content'>{!birthdate ? 0 : this.getAge(birthdate)}</div> :
                  <input
                    id='lgi-profil-view-pi-birthdate-box1-input'
                    type='date'
                    value={dateValue}
                    onChange={e => loading ? null : this.setState({ dateValue: e.target.value })}
                  />
                }
                { errorMsg && modifActive ? <div id='lgi-profil-view-pi-birthdate-box1-error'>{errorMsg}</div> : null }
              </div>
              <div id='lgi-profil-view-pi-birthdate-box2'>
              {
                loading ? 
                <div id='lgi-profil-view-pi-birthdate-box2-loading'></div> :
                  !modifActive ?
                  <button
                    onClick={() => this.setState({ modifActive: true })}
                    id='lgi-profil-view-pi-birthdate-box2-edit'
                  >
                    <img src={editIcon} alt='edit' id='lgi-profil-view-pi-birthdate-box2-edit-icon' />
                  </button> :
                  <div id='lgi-profil-view-pi-birthdate-box2-update'>
                    <button
                      id='lgi-profil-view-pi-birthdate-box2-update-validate'
                      onClick={() => this.updateMechanism(updateUserBirthDate)}
                    >
                      <img src={validateIcon} alt='validate' />
                    </button>
                    <button
                      id='lgi-profil-view-pi-birthdate-box2-update-cancel'
                      onClick={() => this.setState({ modifActive: false, dateValue: '', errorMsg: '' })}
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
  birthdate: state.user.birthDate
});

const mapDispatchToProps = dispatch => ({
  updateUserBirthDateMechanism: birthdate => dispatch(updateUserBirthDateMechanism(birthdate))
})

// Exports.
export default connect(mapStateToProps, mapDispatchToProps)(birthdate);