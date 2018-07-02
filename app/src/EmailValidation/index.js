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
    loading: 'loading'
  }

  render() {
    console.log('-- EMAIL COMPONENT --');
    console.log(this.props);

    const { token, username } = this.props.match.params;
    console.log('TOKEN = ');
    console.log(token);
    console.log('USERNAME = ');
    console.log(username);
    
    const { loading } = this.state;
    
    if (loading === 'loading') {      
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
      })
      .catch(err => {
        console.log('- CATCH -');
        console.log(err);
      });
    }

    if (loading === 'loading')
      return <div>Loading</div>;
    else if (loading === 'already')
      return <div>Already verified</div>;
    else if (loading === 'success')
      return <div>Successssss</div>;
    else if (loading === 'error')
      return <div>An Error Occurs</div>;
    else
      return <div>Error server</div>;
  }
}

export default withApollo(EmailValidation);