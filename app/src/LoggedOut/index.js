import React from 'react';
import FormBtn from './Form/FormBtn';
import FormStep1 from './Form/FormStep1';
import FormStep2 from './Form/FormStep2';
import FormStep3 from './Form/FormStep3';
import SignIn from './SignIn';
import './index.scss';

class LoggedOut extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      action: 'logged-out'
    };

    this.UIaction = this.UIaction.bind(this);
  }

  UIaction() {
    const { action } = this.state;
    switch (action) {
      case 'logged-out':
        return <FormBtn changeState={{signin: () => this.setState({ action: 'logged-out-sign-in' }), signup: () => this.setState({ action: 'logged-out-step1' })}} />;
      case 'logged-out-step1':
        return <FormStep1 changeState={{ previous: () => this.setState({ action: 'logged-out' }), next: () => this.setState({ action: 'logged-out-step2' })}} />;
      case 'logged-out-step2':
        return <FormStep2 changeState={{ previous: () => this.setState({ action: 'logged-out-step1' }), next: () => this.setState({ action: 'logged-out-step3' })}}/>;
      case 'logged-out-step3':
        return <FormStep3 changeState={() => this.setState({ action: 'logged-out-step2' })}/>;
      case 'logged-out-sign-in':
        return <SignIn logUserIn={this.props.logUserIn} changeState={() => this.setState({ action: 'logged-out-step1' })}/>;
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