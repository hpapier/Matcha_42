// Modules imports.
import React, { Component } from 'react';
import { Query } from 'react-apollo';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';


// Locals imports.
import './index.sass';
import { GET_USER_INFO_QUERY } from '../../../query';
import { saveUserInfo, saveInterest } from '../../../store/action/synchronous';
import UserBox from '../UserBox';
import ViewPersonnalInfo from './View/PersonnalInfo';
import ViewPreferences from './View/Preferences';
import ViewSensibleInfo from './View/SensibleInfo';
import ViewAbout from './View/About';
import ViewImages from './View/Images';
import Logout from '../Utils/Logout';

// Profil Component
class Profil extends Component {
  onCompletedHandler = (data) => {
    this.props.saveUserInfo(data.userInformations);
    this.props.saveInterest(data.getInterests);
  }

  render() {
    return (
      <Query query={GET_USER_INFO_QUERY} fetchPolicy='cache-and-network' onCompleted={data => this.onCompletedHandler(data)}>
      {
        ({ loading, data, error, refetch }) => {
          if (loading)
            return <div id='profil-loading-box'><div id='profil-loading'></div></div>;
 
          if (error) {
            if (error.graphQLErrors[0].message === 'Not auth')
              return <Logout />;
            else
              return <div id='lgi-profil-error'>Oups! Une erreur est survenu, veuillez réessayer plus tard..</div>;
          }
            
          return (
            <div id='lgi-profil'>
              <UserBox />
              <div id='lgi-profil-infobox'>
                <div>
                  <ViewPersonnalInfo />
                  <ViewSensibleInfo />
                </div>
                <div>
                  <ViewPreferences />
                  <ViewAbout />
                  <ViewImages />
                </div>
              </div>
            </div>
          );
        }
      }
      </Query>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  saveUserInfo: data => dispatch(saveUserInfo(data)),
  saveInterest: data => dispatch(saveInterest(data))
})

// Exports.
export default connect(null, mapDispatchToProps)(withRouter(Profil));