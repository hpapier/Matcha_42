// Modules imports.
import React, { Component } from 'react';
import { Query } from 'react-apollo';
import { connect } from 'react-redux';


// Locals imports.
import './index.sass';
import { NOTIFICATION_COMPONENT_QUERY } from '../../../query';
import View from './View';
import Logout from '../Utils/Logout';
import { saveNotifList, saveUserInfo, saveInterest } from '../../../store/action/synchronous';


// Notification Component.
class Notification extends Component {
  onCompleteHandler = data => {
    const { getUserNotification, userInformations, getInterests } = data;
    const { saveNotifList, saveUserInfo, saveInterest } = this.props;
    saveNotifList(getUserNotification);
    saveUserInfo(userInformations);
    saveInterest(getInterests);
  }

  render() {
    return (
      <Query query={NOTIFICATION_COMPONENT_QUERY} onCompleted={data => this.onCompleteHandler(data)} pollInterval={500}>
      {
        ({ loading, error }) => {
          if (loading)
            return <div><div></div></div>;

          if (error) {
            console.log(error.graphQLErrors);
            if (error.graphQLErrors && error.graphQLErrors[0].message) {
              if (error.graphQLErrors[0].message === 'Not auth')
                return <Logout />;
            }

            return <div>Oups! Une erreur est survenu..</div>;
          }

          return (
            <div>
              <View />
            </div>
          );
        }
      }
      </Query>
    )
  }
};


// Redux connection.
const mapDispatchToProps = dispatch => ({
  saveNotifList: data => dispatch(saveNotifList(data)),
  saveUserInfo: data => dispatch(saveUserInfo(data)),
  saveInterest: data => dispatch(saveInterest(data))
});


// Export.
export default connect(null, mapDispatchToProps)(Notification);