import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import { setUserInfoAndStage } from '../../../store/reducer';
import { connect } from 'react-redux';
import './index.scss';

class LoggedInNavbar extends React.Component {
  state = {
    dropdown: false
  };

  logout = () => {
    localStorage.removeItem('auth_token');
    this.props.history.push('/');
    this.props.setUserInfoAndStage({stage: 'loggedOut', data: null});
  }

  render() {
    console.log(this.props.history);
    return(
      <div id="settings-btn-box">
        <div id="settings-btn-box-title">Matcha</div>
        <div id="settings-btn-box-notification">Notif</div>
        <Link to="/msg" id="settings-btn-box-msg">Messages</Link>
        <div id="settings-btn-box-drop" onClick={() => this.setState({ dropdown: !this.state.dropdown })}>v</div>

        { this.state.dropdown ? 
          (
            <div id="settings-btn-box-drop-visible">
              <Link id="settings-btn-box-drop-visible-params" to="/preferences">Préférences</Link>
              <button id="settings-btn-box-drop-visible-logout" onClick={this.logout}>Déconnection</button>
            </div>
          ) : 
          null
        }
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  setUserInfoAndStage: data => dispatch(setUserInfoAndStage(data))
});

export default connect(null, mapDispatchToProps)(withRouter(LoggedInNavbar));