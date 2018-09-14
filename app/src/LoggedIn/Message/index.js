// Modules imports.
import React, { Component } from 'react';
import { Query } from 'react-apollo';
import { connect } from 'react-redux';


// Locals imports.
import './index.sass';
import { MESSAGE_COMPONENT_QUERY } from '../../../query';
import RoomView from './RoomView';
import Logout from '../Utils/Logout';
import { saveRoomList, saveUserInfo, saveInterest } from '../../../store/action/synchronous';


// Notification Component.
class Notification extends Component {
  onCompleteHandler = data => {
    const { getUserRoom, userInformations, getInterests } = data;
    const { saveRoomList, saveUserInfo, saveInterest } = this.props;
    saveRoomList(getUserRoom);
    saveUserInfo(userInformations);
    saveInterest(getInterests);
  }

  _unmount = false;

  componentWillUnmount() {
    this._unmount = true;
  }


  render() {
    return (
      <Query query={MESSAGE_COMPONENT_QUERY} onCompleted={data => this.onCompleteHandler(data)} pollInterval={!this._unmount ? 500 : 0}>
      {
        ({ loading, error }) => {
          if (loading)
            return <div id='lgi-msg-loading'><div id='lgi-msg-loading-animation'></div></div>;

          if (error) {
            if (error.graphQLErrors && error.graphQLErrors[0].message) {
              if (error.graphQLErrors[0].message === 'Not auth')
                return <Logout />;
            }

            return <div id='lgi-msg-error'>Oups! Une erreur est survenu..</div>;
          }

          return (
            <div>
              <RoomView />
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
  saveRoomList: data => dispatch(saveRoomList(data)),
  saveUserInfo: data => dispatch(saveUserInfo(data)),
  saveInterest: data => dispatch(saveInterest(data))
});


// Export.
export default connect(null, mapDispatchToProps)(Notification);