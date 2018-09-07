// Modules imports.
import React, { Component } from 'react';
import { Query } from 'react-apollo';
import { connect } from 'react-redux';


// Locals imports.
import './index.sass';
import { GET_USER_PROFIL_QUERY } from '../../../../query';
import Logout from '../../Utils/Logout';
import { changeStatusView, getUserProfil } from '../../../../store/action/synchronous';


// Profil Component.
class Profil extends Component {
  onCompletedHandler = data => {
    console.log('ON DATA COMPLETED HANDLER');
    console.log(data);
  };

  handleErrorCallback = () => {
    const { getUserProfil, changeStatusView } = this.props;
    getUserProfil(null);
    changeStatusView('suggestion');
  }

  render() {
    return (
      <Query query={GET_USER_PROFIL_QUERY} onCompleted={data => this.onCompletedHandler(data)} variables={{ userId: this.props.userProfilToGet.id }}>
      {
        ({ loading, error }) => {
          if (loading)
            return <div id='lgi-complete-profil-loading'><div id='lgi-complete-profil-loading-animation'></div></div>;

          if (error) {
            if (error.graphQLErrors[0]) {
              if (error.graphQLErrors[0].message === 'Not auth')
                return <Logout />;
            }
            else
              return (
                <div id='lgi-complete-profil-error'>
                  <div id='lgi-complete-profil-error-text'>Oups! Une erreur est survenu..</div>
                  <div id='lgi-complete-profil-error-btn' onClick={this.handleErrorCallback}>Revenir au suggestion</div>
                </div>
              );
          }

          return (
            <div>
              Profil Component
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
  getUserProfil: data => dispatch(getUserProfil(data))
});


// Export.
export default connect(mapStateToProps, mapDispatchToProps)(Profil);