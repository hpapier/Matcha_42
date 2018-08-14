import React, { Component } from 'react';
import SignIn from './SignIn';
import SignUp from './SignUp';
import './index.sass';

class AuthenticationBox extends Component {
  state = {
    status: 'sign-in'
  }

  getActiveClassName = el => {
    if (el === this.state.status)
      return 'lgo-authentication-button-active';
    else
      return '';
  }

  render() {
    return (
      <div id='lgo-authentication-box'>
        <div id='lgo-authentication-box-button'>
          <div
            onClick={() => (this.state.status !== 'sign-in') ? this.setState({ status: 'sign-in' }) : null}
            className={`lgo-authentication-box-button left ${this.getActiveClassName('sign-in')}`}
          >
            inscription
          </div>
          <div
            onClick={() => (this.state.status !== 'sign-up') ? this.setState({ status: 'sign-up' }) : null}
            className={`lgo-authentication-box-button right ${this.getActiveClassName('sign-up')}`}
          >
            connexion
          </div>
        </div>
        {
          this.state.status === 'sign-in' ?
          <SignIn /> :
          <SignUp />
        }
      </div>
    );
  }
};

export default AuthenticationBox;