import React from 'react';
import FormBtn from './Form/FormBtn';
import FormStep1 from './Form/FormStep1';
import FormStep2 from './Form/FormStep2';
import FormStep3 from './Form/FormStep3';
import './index.scss';

class LoggedOut extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      action: 'basic'
    };

    this.UIaction = this.UIaction.bind(this);
  }

  UIaction() {
    const { action } = this.state;
    switch (action) {
      case 'basic':
        return <FormBtn changeState={() => this.setState({ action: 'step1' })} />;
      case 'step1':
        return <FormStep1 changeState={{ previous: () => this.setState({ action: 'basic' }), next: () => this.setState({ action: 'step2' })}} />;
      case 'step2':
        return <FormStep2 changeState={{ previous: () => this.setState({ action: 'step1' }), next: () => this.setState({ action: 'step3' })}}/>;
      case 'step3':
        return <FormStep3 changeState={() => this.setState({ action: 'step2' })}/>;
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