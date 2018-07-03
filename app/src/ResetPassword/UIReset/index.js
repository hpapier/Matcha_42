import React from 'react';
import { withApollo } from 'react-apollo';
import { gql } from 'apollo-boost';

const RESET_PWD_MUTATION = gql`
  mutation resetPwd($username: String!, $password: String!){
    resetPwd(username: $username, password: $password) {
      state
    }
  }
`;

class UIReset extends React.Component {
  state = {
    pwd: '',
    verif: '',
    error: null
  };

  handleSubmit = e => {
    e.preventDefault();
    const { pwd, verif } = this.state;

    if (pwd === verif && pwd && verif) {
      this.props.client.mutate({
        mutation: RESET_PWD_MUTATION,
        variables: {
          username: this.props.username,
          password: pwd
        }
      })
        .then(res => {
          console.log('- THEN -');
          console.log(res);
          this.setState({ error: 'Mot de passe réinitialiser' });
        })
        .catch(err => {
          console.log('- CATCH -');

          let e = JSON.stringify(err);
          e = JSON.parse(e);
          console.log(e);
          this.setState({ error: e.graphQLErrors[0].message });
        });
    } else {
      this.setState({ error: 'Mot de passe incorrect' });
    }
  }

  render() {
    return(
      <div>
        <form onSubmit={e => this.handleSubmit(e)}>
          <p>Entrez votre nouveau mot de passe</p>
          <label>Mot de passe</label>
          <input type="password" autoComplete="off" onChange={e => this.setState({ pwd: e.target.value})} />
          <label>Vérification du mot de passe</label>
          <input type="password" autoComplete="off" onChange={e => this.setState({ verif: e.target.value})} />
          <button type="submit">Valider</button>
          {this.state.error}
        </form>
      </div>
    );
  }
}

export default withApollo(UIReset);