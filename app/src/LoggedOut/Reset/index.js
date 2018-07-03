import React from 'react';
import { withApollo } from 'react-apollo';
import './index.scss';

class Reset extends React.Component {
  state = {
    username: '',
    email: ''
  };

  sendResetToken = () => {
    console.log('lol');
  }

  handleSubmit = e => {
    e.preventDefault();
    console.log('submit');
  }

  render() {
    const { signup, signin } = this.props.changeState;
    return (
      <div id="reset-box">
        <form onSubmit={e => this.handleSubmit(e)} id="reset-box-form">
          <label id="reset-box-form-label-username" htmlFor="email">Username</label>
          <input id="reset-box-form-input-username" name="username" type="text" onChange={e => this.setState({ username: e.target.value })} value={this.state.username} />
          
          <label id="reset-box-form-label-email" htmlFor="email">Email</label>
          <input id="reset-box-form-input-email" name="email" type="text" onChange={e => this.setState({ email: e.target.value })} value={this.state.email} />

          <div id="reset-box-form-btn">
            <button id="reset-box-form-btn-reset" type="submit" onClick={this.sendResetToken}>Envoyer un email de réinitialisation</button>
            <div id="reset-box-form-btn-1">
              <button id="reset-box-form-btn-signup" type="button" onClick={signup}>S'inscrire</button>
              <button id="reset-box-form-btn-signin" type="button" onClick={signin}>Se connecter</button>
            </div>
          </div>
        </form>
      </div>
    );
  }
}

export default Reset;