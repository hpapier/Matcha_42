// Modules imports.
import React, { Component } from 'react';
import { connect } from 'react-redux';


// Locals imports.
import './index.sass';


// Notification Component.
class View extends Component {
  getText = (username, action, genre) => {
    if (action === 'visite') {
      return (
        <div className='lgi-notification-view-box-item-content-text'>
          <div className='lgi-notification-view-box-item-content-text-username'>{username}</div> a visité votre profil
        </div>
      );
    }
    
    if (action === 'like') {
      return (
        <div className='lgi-notification-view-box-item-content-text'>
          <div className='lgi-notification-view-box-item-content-text-username'>{username}</div> vous a liké
        </div>
      );
    }
    
    if (action === 'unlike') {
      return (
        <div className='lgi-notification-view-box-item-content-text'>
          <div className='lgi-notification-view-box-item-content-text-username'>{username}</div> ne vous like plus
        </div>
      );
    }
    
    if (action === 'like-back') {
      return (
        <div className='lgi-notification-view-box-item-content-text'>
          <div className='lgi-notification-view-box-item-content-text-username'>{username}</div> vous a également liké
        </div>
      );
    }
    
    if (action === 'match') {
      return (
        <div className='lgi-notification-view-box-item-content-text'>
          Nouveau match avec <div className='lgi-notification-view-box-item-content-text-username-match'>{username}</div>
        </div>
      );
    }

    if (action === 'unmatch') {
      return (
        <div className='lgi-notification-view-box-item-content-text'>
          <div className='lgi-notification-view-box-item-content-text-username'>{username}</div> et vous ne matchez plus
        </div>
      );
    }
  }

  getDate = date => {
    if (!date)
      return 'Unknow date..';

    const notifDate = new Date(date);
    const timestamp = Math.abs(new Date() - notifDate);

    if (timestamp < 86400000) {
      const h = ((new Date(timestamp).getHours() - 1) === 0) ? '' : new Date(timestamp).getHours() - 1;
      const m = new Date(timestamp).getMinutes();

      if (!h) {
        if (m === 0)
          return 'Il y a quelques secondes';
        else
          return `Il y a ${m} minutes`;
      } else {
        if (m > 45)
          return `Il y a ${h + 1}h`;
        else
          return `Il y a ${h}h`;
      }


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
  }

  displayNotifList = () => {
    const { notificationList } = this.props;

    if (notificationList.length === 0)
      return <div className='lgi-notification-view-box-item-empty'>Vous n'avez pas de notifications</div>;

    return notificationList.map(item => (
      <div className='lgi-notification-view-box-item' key={item.id * Math.random()}>
        <div className='lgi-notification-view-box-item-img'>
          <img src={item.fromUserProfilPicture} alt='profil-picture' className='lgi-notification-view-box-item-img-picture' />
        </div>
        <div className='lgi-notification-view-box-item-content'>
          {this.getText(item.fromUserName, item.action, item.fromUserGenre)}
          <div className='lgi-notification-view-box-item-date'>{this.getDate(item.date)}</div>
        </div>
      </div>
    ));
  };

  render() {
    return (
      <div id='lgi-notification-view'>
        <div id='lgi-notification-view-title'>Toutes vos notifications</div>
        <div id='lgi-notification-view-box'>
          { this.displayNotifList() }
        </div>
      </div>
    )
  }
};


// Redux connection.
const mapStateToProps = state => ({
  notificationList: state.notificationList
});


// Export.
export default connect(mapStateToProps, null)(View);