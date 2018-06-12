import React, { Component } from 'react';
import { connect } from 'react-redux';
import LoggedOut from '../LoggedOut';
import LoggedIn from '../LoggedIn';
import './index.scss';

class App extends Component {
  render() {
    return (
      <div>
        { this.props.isLoggedIn ? <LoggedIn /> : <LoggedOut />}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  isLoggedIn: state.isLoggedIn
});

export default connect(mapStateToProps)(App);