import React, { Component } from 'react';
import LoggedOut from '../LoggedOut';
import './index.scss';

class App extends Component {
  render() {
    console.log(this.props);
    return (
      <div>
        <LoggedOut />
      </div>
    );
  }
}

export default App;