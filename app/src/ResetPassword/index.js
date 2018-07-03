import React from 'react';
import { withApollo } from 'react-apollo';
import { gql } from 'apollo-boost';
import UIReset from './UIReset/index.js';

const QUERY_RESET_PASSWORD = gql`
  query checkResetReq($token: String!, $username: String!) {
    checkResetReq(token: $token, username: $username) {
      state
    }
  }
`;

class ResetPassword extends React.Component {
  state = {
    loading: 'loading'
  };

  UI = () => {
    switch(this.state.loading) {
      case 'loading':
        return <div>LOADING</div>;
      case 'success':
        return <UIReset username={this.props.match.params.username} />;
      default:
        return <div>Error</div>;
    }
  }

  render() {
    console.log('- RESET PASSWORD COMPONENT -');
    console.log(this.props);

    if (this.state.loading === 'loading') {
      const { token, username } = this.props.match.params;

      this.props.client.query({
        query: QUERY_RESET_PASSWORD,
        variables: {
          token,
          username
        }
      })
      .then(res => {
        console.log('- THEN -');
        console.log(res);

        if (res.data.checkResetReq.state === 'success') {
          this.setState({ loading: 'success' });
        }
      })
      .catch(err => {
        console.log('- CATCH -');
        console.log(err);
      });
    }

    return this.UI();
  }
}

export default withApollo(ResetPassword);