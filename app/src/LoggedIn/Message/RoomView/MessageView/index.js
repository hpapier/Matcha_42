// Modules imports.
import React, { Component } from 'react';
import { Query } from 'react-apollo';
import { connect } from 'react-redux';


// Locals imports.
import './index.sass';
import { GET_ROOM_MESSAGE_QUERY } from '../../../../../query';
import { saveToCurrentMsgRom } from '../../../../../store/action/synchronous';
import View from './View';
import Logout from '../../../Utils/Logout';


// MessageView Component.
class MessageView extends Component {
  onCompletedHandler = data => {
    this.props.saveToCurrentMsgRom(data.getRoomMessage)
  };

  render() {
    const { roomId } = this.props.roomInfo;
    return (
      <Query query={GET_ROOM_MESSAGE_QUERY} variables={{ roomId }} onCompleted={data => this.onCompletedHandler(data)} pollInterval={600}>
      {
        ({ loading, error }) => {
          if (loading)
            return <div id='lgi-message-message-view-loading'><div id='lgi-message-message-view-loading-animation'></div></div>;

          if (error) {
            if (error.graphQLErrors && error.graphQLErrors[0]) {
              if (error.graphQLErrors[0].message === 'Not auth')
                return <Logout />;
              
              if (error.graphQLErrors[0].message === 'Room does\'nt exist')
                return <div className='gi-message-message-view-error'>Ce canal de discussion n'existe pas</div>;

              if (error.graphQLErrors[0].message === 'User blocked')
                return <div className='gi-message-message-view-error'>Cet utilisateur est bloqué, vous ne pouvez plus recevoir de messages de sa part et lui en envoyer.</div>;

              if (error.graphQLErrors[0].message === 'No match')
                return <div className='gi-message-message-view-error'>Vous ne matchez plus avec cet utilisateur.</div>;
            }

            
            return <div className='gi-message-message-view-error'>Oups! Une erreur est survenu...</div>;
          }

          return (
            <div className='lgi-message-message-view'>
              <View roomInfo={this.props.roomInfo} />
            </div>
          );
        }
      }
      </Query>
    );
  }
}


// Redux connection.
const mapDispatchToProps = dispatch => ({
  saveToCurrentMsgRom: data => dispatch(saveToCurrentMsgRom(data))
})


// Export.
export default connect(null, mapDispatchToProps)(MessageView);