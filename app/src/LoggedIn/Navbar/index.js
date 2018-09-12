// Module imports
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';


// Local import.
import './index.sass';
import homeLineIcon from '../../../assets/home-line.svg';
import homeSolidIcon from '../../../assets/home-solid.svg';
import notifLineIcon from '../../../assets/notif-line.svg';
import notifSolidIcon from '../../../assets/notif-solid.svg';
import msgLineIcon from '../../../assets/msg-line.svg';
import msgSolidIcon from '../../../assets/msg-solid.svg';
import { statusBarMechanism, clearStore } from '../../../store/action/synchronous';
import NotificationSubscriber from './NotificationSubscriber';


// Navbar component
class Navbar extends Component {
  state = {
    up: false
  }

  componentWillMount() {
    this.props.statusBarMechanism((this.props.location.pathname.split('/')[1] !== '') ? this.props.location.pathname.split('/')[1] : 'home');
  }

  logOutUser = () => {
    localStorage.removeItem('auth_token');
    this.props.clearStore();
    this.props.history.push('/');
  }

  navigationView = status => {
    const { statusBarMechanism, history } = this.props;
    
    if (status === 'home')
      history.push('/');
    else if (status === 'notification')
      history.push('/notification');
    else if (status === 'message')
      history.push('/message');
    else if (status === 'profil')
      history.push('/profil');

    statusBarMechanism(status);
  }

  render() {
    const { statusBar } = this.props;
    return (
      <div id='lgi-navbar'>

        <div id='lgi-navbar-left'>
          <div className={statusBar === 'home' ? 'lgi-navbar-left-box-active' : 'lgi-navbar-left-box-inactive'} onClick={() => this.navigationView('home')}>
            <img src={statusBar === 'home' ? homeSolidIcon : homeLineIcon} className='lgi-navbar-left-box-icon' />
            <div className={statusBar === 'home' ? 'lgi-navbar-left-box-text-active' : 'lgi-navbar-left-box-text-inactive first'}>Acceuil</div>
          </div>
  
          <div className={statusBar === 'notification' ? 'lgi-navbar-left-box-active' : 'lgi-navbar-left-box-inactive'} onClick={() => this.navigationView('notification')}>
            <img src={statusBar === 'notification' ? notifSolidIcon : notifLineIcon} className='lgi-navbar-left-box-icon' />
            <div className={statusBar === 'notification' ? 'lgi-navbar-left-box-text-active' : 'lgi-navbar-left-box-text-inactive'}>Notifications</div>
            <NotificationSubscriber />
          </div>
  
          <div className={statusBar === 'message' ? 'lgi-navbar-left-box-active' : 'lgi-navbar-left-box-inactive'} onClick={() => this.navigationView('message')}>
            <img src={statusBar === 'message' ? msgSolidIcon : msgLineIcon} className='lgi-navbar-left-box-icon' />
            <div className={statusBar === 'message' ? 'lgi-navbar-left-box-text-active' : 'lgi-navbar-left-box-text-inactive'}>Messages</div>
          </div>
        </div>
  
        <div id='lgi-navbar-right'>
          <div id='lgi-navbar-right-img' className={(statusBar === 'profil') ? 'lgi-navbar-right-img-active' : ''} onClick={() => this.navigationView('profil')}>
          {this.props.user.profilPicture ? <img className='lgi-navbar-right-img-content' src={this.props.user.profilPicture} alt='user-profil-img' /> : null}
          </div>
          <button id='lgi-navbar-right-logout' onClick={this.logOutUser}>déconnexion</button>
        </div>
      </div>
    );
  }
};


const mapStateToProps = state => ({
  statusBar: state.statusBar,
  user: state.user
});

const mapDispatchToProps = dispatch => ({
  statusBarMechanism: status => dispatch(statusBarMechanism(status)),
  clearStore: () => dispatch(clearStore())
});


// Export.
export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Navbar));