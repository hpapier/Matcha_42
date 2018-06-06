import React, { Component } from 'react';
import './index.scss';

class App extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    console.log(this.props);
    return (
      <div id="form-btn">
        <button id="form-btn-signin">Se connecter</button>
        <button id="form-btn-signup" onClick={this.props.changeState}>S'inscrire</button>
      </div>
    );
  }
}

export default App;