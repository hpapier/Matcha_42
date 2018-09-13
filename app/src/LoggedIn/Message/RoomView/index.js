// Modules imports.
import React, { Component } from 'react';
import { connect } from 'react-redux';


// Locals imports.
import './index.sass';


// RoomView Component.
class RoomView extends Component {
  state = {
    msgView: false
  };

  getDate = date => {
    if (!date)
      return 'Unknow date..';

    const notifDate = new Date(date);
    const timestamp = Math.abs(new Date() - notifDate);

    if (timestamp < 86400000) {
      const h = notifDate.getHours() < 10 ? '0' + notifDate.getHours() : notifDate.getHours();
      const m = notifDate.getMinutes() === 0 ? '' : notifDate.getMinutes() < 10 ? '0' + notifDate.getMinutes() : notifDate.getMinutes();

      return `${h}h${m}`;
    } else {
      const day = (notifDate.getDate() < 10) ? '0' + notifDate.getDate() : notifDate.getDate();
      let month;
      const year = notifDate.getFullYear();
      const hours = (notifDate.getHours() < 10) ? '0' + notifDate.getHours() : notifDate.getHours();
      const minutes = (notifDate.getMinutes() < 10) ? '0' + notifDate.getMinutes() : notifDate.getMinutes();

      switch (notifDate.getMonth()) {
        case 1:
          month = 'février';
          break;
        case 2:
          month = 'mars';
          break;
        case 3:
          month = 'avril';
          break;
        case 4:
          month = 'mai';
          break;
        case 5:
          month = 'juin';
          break;
        case 6:
          month = 'juillet';
          break;
        case 7:
          month = 'août';
          break;
        case 8:
          month = 'septembre';
          break;
        case 9:
          month = 'octobre';
          break;
        case 10:
          month = 'novembre';
          break;
        case 11:
          month = 'décembre';
          break;

        default: 'Janvier'
      }

      return `${day} ${month} ${year}, ${hours}h${minutes}`;
    }
  };

  displayRoomList = () => {
    const { roomList } = this.props;

    if (roomList.length === 0)
      return <div className='lgi-message-view-box-item-empty'>Vous n'avez pas de messages</div>;

    return roomList.map(item => (
      <div className='lgi-message-view-box-item' key={item.id * Math.random()} onClick={() => this.setState({ msgView: true })}>
        <div className='lgi-message-view-box-item-img'>
          <img src={item.userProfilPicture} alt='profil-picture' className='lgi-message-view-box-item-img-picture' />
        </div>
        <div className='lgi-message-view-box-item-content'>
          <div className='lgi-message-view-box-item-username'>{item.userProfilUsername}</div>
          <div className='lgi-message-view-box-item-msg'>{item.lastMessage.length > 60 ? item.lastMessage.substring(0, 60) + '...' : item.lastMessage}</div>
        </div>
        <div className='lgi-message-view-box-item-date'>{this.getDate(item.lastMessageDate)}</div>
      </div>
    ));
  };

  render() {
    return (
      <div id='lgi-message-view'>
        <div id='lgi-message-view-title'>Tous vos messages</div>
        <div id='lgi-message-view-box'>
        { this.props.user.isComplete ?
            !this.state.msgView ?
            this.displayRoomList() :
            <div>message view</div> :
          <div className='lgi-message-view-box-item-empty'>Vous n'avez pas de messages</div>
        }
        </div>
      </div>
    )
  }
};


// Redux connection.
const mapStateToProps = state => ({
  roomList: state.roomList,
  user: state.user
});


// Export.
export default connect(mapStateToProps, null)(RoomView);