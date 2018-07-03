import React from 'react';
import { withApollo } from 'react-apollo';
import { Link, Redirect } from 'react-router-dom';
import { gql } from 'apollo-boost';

const VALIDATION_ACCOUNT_MUTATION = gql`
  mutation validAccount($token: String!, $username: String!) {
    validAccount(token: $token, username: $username) {
      state
    }
  }
`;

class EmailValidation extends React.Component {
  state = {
    loading: true,
    error: ''
  }

  render() {
    console.log('-- EMAIL COMPONENT --');
    console.log(this.props);

    const { token, username } = this.props.match.params;
    
    const { loading } = this.state;
    
    if (loading) {      
      this.props.client.mutate({
        mutation: VALIDATION_ACCOUNT_MUTATION,
        variables: {
          token,
          username
        }
      })
      .then(res => {
        console.log('- THEN -');
        console.log(res);
        this.setState({ loading: false, error: 'Success' });
      })
      .catch(err => {
        let error = JSON.stringify(err);
        error = JSON.parse(error);

        console.log('- CATCH -');
        console.log(error);

        const errMsg = error.graphQLErrors[0].message
        this.setState({ loading: false, error: errMsg });
      });
    }

    if (loading)
      return <div>Loading</div>;
    else
      return <div>{this.state.error}</div>;
  }
}

export default withApollo(EmailValidation);