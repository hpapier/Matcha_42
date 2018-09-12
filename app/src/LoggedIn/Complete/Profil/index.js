// Modules imports.
import React, { Component } from 'react';
import { Query } from 'react-apollo';
import { connect } from 'react-redux';


// Locals imports.
import './index.sass';
import { GET_USER_PROFIL_QUERY } from '../../../../query';
import Logout from '../../Utils/Logout';
import { changeStatusView, getUserProfil, saveUserProfilInfo } from '../../../../store/action/synchronous';
import ProfilImg from './ProfilImg';
import ProfilBody from './ProfilBody';
import ProfilActions from './ProfilActions';
import ProfilBio from './ProfilBio';
import ProfilSexualOrientation from './ProfilSexualOrientation';
import ProfilTags from './ProfilTags';


// Profil Component.
class Profil extends Component {
  onCompletedHandler = data => {
    console.log('data forced');
    const { saveUserProfilInfo } = this.props;
    const { getUserProfilInformation } = data;
    saveUserProfilInfo(getUserProfilInformation);
  };

  handleErrorCallback = () => {
    const { getUserProfil, changeStatusView } = this.props;
    getUserProfil(null);
    changeStatusView('suggestion');
  }

  render() {
    return (
      <Query query={GET_USER_PROFIL_QUERY} onCompleted={data => this.onCompletedHandler(data)} variables={{ userId: this.props.userProfilToGet.id }} fetchPolicy='network-only'>
      {
        ({ loading, error }) => {
          if (loading)
            return <div id='lgi-complete-profil-loading'><div id='lgi-complete-profil-loading-animation'></div></div>;

          if (error) {
            if (error.graphQLErrors && error.graphQLErrors[0]) {
              if (error.graphQLErrors[0].message === 'Not auth')
                return <Logout />;
              else if (error.graphQLErrors[0].message === 'Profil blocked')
                return (
                  <div className='lgi-complete-profil-error'>
                    <div className='lgi-complete-profil-error-text'>Ce profil vous a bloqué.</div>
                    <div className='lgi-complete-profil-error-btn' onClick={this.handleErrorCallback}>Revenir au suggestion</div>
                  </div>
                );
            }

            if (error)
              return (
                <div className='lgi-complete-profil-error'>
                  <div className='lgi-complete-profil-error-text'>Oups! Une erreur est survenu..</div>
                  <div className='lgi-complete-profil-error-btn' onClick={this.handleErrorCallback}>Revenir au suggestion</div>
                </div>
              );
          }

          return (
            <div id='lgi-complete-profil'>
              <div id='lgi-complete-profil-up-box'>
                <ProfilImg />
                <ProfilBody />
              </div>
              <div id='lgi-complete-profil-down-box'>
                <div id='lgi-complete-profil-down-box-left'>
                  <ProfilActions />
                </div>
                <div id='lgi-complete-profil-down-box-right'>
                  <ProfilBio />
                  <ProfilSexualOrientation />
                  <ProfilTags />
                </div>
              </div>
            </div>
          );
        }
      }
      </Query>
    );
  };
};


// Redux connexion.
const mapStateToProps = state => ({
  userProfilToGet: state.userProfilToGet
});

const mapDispatchToProps = dispatch => ({
  changeStatusView: data => dispatch(changeStatusView(data)),
  getUserProfil: data => dispatch(getUserProfil(data)),
  saveUserProfilInfo: data => dispatch(saveUserProfilInfo(data))
});


// Export.
export default connect(mapStateToProps, mapDispatchToProps)(Profil);