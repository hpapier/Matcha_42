import React, { Component } from 'react';

class SignIn extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      pwd: ''
    }

    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(e) {
    e.preventDefault();
    console.log('Hello signin');
  }

  render() {
    const { changeState } = this.props;
    return (
      <div>
        <p>Connexion</p>
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

export default SignIn;