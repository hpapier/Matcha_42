import React from 'react';
import { Link } from 'react-router-dom';
import './index.scss';

class SettingsBtn extends React.Component {
  state = {
    dropdown: false
  };

  render() {
    return(
      <div id="settings-btn-box">
        <div id="settings-btn-box-title">Matcha</div>
        <div id="settings-btn-box-notification">Notif</div>
        <Link to="/msg" id="settings-btn-box-msg">Messages</Link>
        <div id="settings-btn-box-drop" onClick={() => this.setState({ dropdown: !this.state.dropdown })}>v</div>

        { this.state.dropdown ? 
          (
            <div id="settings-btn-box-drop-visible">
              <div id="settings-btn-box-drop-visible-params">Paramètres</div>
              <div id="settings-btn-box-drop-visible-logout">Déconnection</div>
            </div>
          ) : 
          null
        }
      </div>
    );
  }
}

export default SettingsBtn;