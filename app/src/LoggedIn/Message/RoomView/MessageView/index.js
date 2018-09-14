// Modules imports.
import React, { Component } from 'react';
import { Query } from 'react-apollo';
import { connect } from 'react-redux';


// Locals imports.
import './index.sass';
import { GET_ROOM_MESSAGE_QUERY } from '../../../../../query';
import { saveToCurrentMsgRom } from '../../../../../store/action/synchronous';
import View from './View';


// MessageView Component.
class MessageView extends Component {
  onCompletedHandler = data => {
    this.props.saveToCurrentMsgRom(data.getRoomMessage)
  };

  render() {
    const { roomId, partnerUsername } = this.props.roomInfo;
    return (
      <Query query={GET_ROOM_MESSAGE_QUERY} variables={{ roomId }} onCompleted={data => this.onCompletedHandler(data)} pollInterval={600}>
      {
        ({ loading, error }) => {
          if (loading)
            return <div>loading</div>;

          if (error)
            return <div>Error</div>;

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