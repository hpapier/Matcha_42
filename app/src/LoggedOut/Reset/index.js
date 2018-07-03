import React from 'react';
import { gql } from 'apollo-boost';
import { withApollo } from 'react-apollo';
import './index.scss';

const QUERY_RESETING = gql`
  query sendResetEmail($email: String!){
    sendResetEmail(email: $email) {
      state
    }
  }
`;

class Reset extends React.Component {
  state = {
    email: '',
    error: null
  };

  handleSubmit = e => {
    e.preventDefault();

    const { username, email } = this.state;
    if (email) {
      this.props.client.query({
        query: QUERY_RESETING,
        variables: {
          email
        }
      })
      .then(res => {
        console.log('- THEN -');
        console.log(res);
        this.setState({ error: 'Email envoyé.' });
      })
      .catch(err => {
        console.log('- CATCH -');
        let e = JSON.stringify(err);
        e = JSON.parse(e);
        console.log(e);
        this.setState({ error: e.graphQLErrors[0].message });
      });
    } else {
      this.setState({ error: 'Veuillez remplir tout les champs' });
    }
  }

  render() {
    const { signup, signin } = this.props.changeState;
    return (
      <div id="reset-box">
        <form onSubmit={e => this.handleSubmit(e)} id="reset-box-form">
          <label id="reset-box-form-label-email" htmlFor="email">Email</label>
          <input id="reset-box-form-input-email" name="email" type="text" onChange={e => this.setState({ email: e.target.value })} value={this.state.email} />

          <div id="reset-box-form-btn">
            <button id="reset-box-form-btn-reset" type="submit">Envoyer un email de réinitialisation</button>
            <div id="reset-box-form-btn-1">
              <button id="reset-box-form-btn-signup" type="button" onClick={signup}>S'inscrire</button>
              <button id="reset-box-form-btn-signin" type="button" onClick={signin}>Se connecter</button>
            </div>
          </div>
          {this.state.error}
        </form>
      </div>
    );
  }
}

export default withApollo(Reset);