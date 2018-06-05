import React from 'react';
import Btn from './Btn'
import './index.scss';

class LoggedOut extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      action: 'basic'
    };

    this.UIaction = () => {
      const { action } = this.state;
      if (action === 'basic')
        return <Btn changeState={() => this.setState({ action: 'step1' }) }/>;
      if (action === 'step1')
        return 'lol';
    }
  }

  render() {
    return(
      <div id="logged-out">
        <div id="box-1">
          <p>Matcha</p>
          <p>blablabla</p>
        </div>
        <div id="box-2">
          {this.UIaction()}
        </div>
      </div>
    );
  }
}

export default LoggedOut;