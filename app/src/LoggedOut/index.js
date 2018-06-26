import React from 'react';
import FormBtn from './Form/FormBtn';
import FormStep1 from './Form/FormStep1';
import FormStep2 from './Form/FormStep2';
import FormStep3 from './Form/FormStep3';
import SignIn from './SignIn';
import './index.scss';

class LoggedOut extends React.Component {  
  state = {
    action: 'logged-out'
  }

  UIaction = () => {
    const { action } = this.state;
    switch (action) {
      case 'logged-out':
        return <FormBtn changeState={{signin: () => this.setState({ action: 'logged-out-sign-in' }), signup: () => this.setState({ action: 'logged-out-step1' })}} />;
      case 'logged-out-step1':
        return <FormStep1 changeState={{ previous: () => this.setState({ action: 'logged-out' }), next: () => this.setState({ action: 'logged-out-step2' })}} />;
      case 'logged-out-step2':
        return <FormStep2 changeState={{ previous: () => this.setState({ action: 'logged-out-step1' }), next: () => this.setState({ action: 'logged-out-step3' })}}/>;
      case 'logged-out-step3':
        return <FormStep3 changeState={{ previous: () => this.setState({ action: 'logged-out-step2' }), next: () => this.setState({ action: 'logged-out' })}} />;
      case 'logged-out-sign-in':
        return <SignIn logUserIn={this.props.logUserIn} changeState={() => this.setState({ action: 'logged-out-step1' })}/>;
    }
  }

  render() {
    return(
      <div id="logged-out">
        <div id="logged-out-right-box">
          <p>Matcha</p>
          <p>blablabla</p>
        </div>
        <div id="logged-out-left-box">
          {this.UIaction()}
        </div>
      </div>
    );
  }
}

export default LoggedOut;