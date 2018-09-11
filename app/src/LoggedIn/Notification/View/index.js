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
    } else if (action === 'like') {
      return (
        <div className='lgi-notification-view-box-item-content-text'>
          <div className='lgi-notification-view-box-item-content-text-username'>{username}</div> vous a liké
        </div>
      );
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
          <div className='lgi-notification-view-box-item-date'>{item.date}</div>
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