import React, { Component } from 'react';
import LoggedOut from '../LoggedOut';
import LoggedIn from '../LoggedIn';
import './index.scss';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoggedIn: false
    };
  }
  
  render() {
    return (
      <div>
        { this.state.isLoggedIn ? <LoggedIn /> : <LoggedOut />}
      </div>
    );
  }
}

export default App;