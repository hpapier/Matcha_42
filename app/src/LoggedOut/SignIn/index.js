import React, { Component } from 'react';
import { connect } from 'react-redux';
import { logUserIn } from '../../../store/reducer';

class SignIn extends Component {
  state = {
    email: '',
    pwd: ''
  }

  handleSubmit = e => {
    e.preventDefault();
    console.log('Hello signin');
    this.props.logUserIn();
  }

  render() {
    console.log(this.props);
    const { changeState } = this.props;
    return (
      <div>
        <p>Connexion {this.props.isLoggedIn ? `true` : `false`}</p>
        <form onSubmit={e => this.handleSubmit(e)}>
          <label htmlFor="email">Adresse email</label>
          <input type="text" name="email" onChange={e => this.setState({ email: e.target.value })} />
          <label htmlFor="pwd">Mot de passe</label>
          <input type="text" name="pwd" onChange={e => this.setState({ pwd: e.target.value })} />
          <div>
            <button type="button" onClick={changeState}>S'inscrire</button>
            <button type="submit">Connexion</button>
          </div>
        </form>
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  logUserIn: () => dispatch(logUserIn())
});

export default connect(null, mapDispatchToProps)(SignIn);