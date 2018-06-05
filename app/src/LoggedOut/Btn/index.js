import React, { Component } from 'react';
import './index.scss';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      lol: ''
    }
  }
  render() {
    console.log(this.props);
    return (
      <div>
        <button>Se connecter</button>
        <button onClick={this.props.changeState}>S'inscrire</button>
      </div>
    );
  }
}

export default App;