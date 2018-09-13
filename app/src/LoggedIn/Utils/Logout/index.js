import React, { Component } from 'react';
import { ApolloConsumer } from 'react-apollo';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';


import { clearStore } from '../../../../store/action/synchronous';

class Logout extends Component {
  componentDidMount() {
    localStorage.removeItem('auth_token');
    this.props.clearStore();
    this.props.history.push('/');
    this.client.resetStore();
  }

  render() {
    return (
      <ApolloConsumer>
      {
        client => {
          this.client = client;
          return null;
        }
      }
      </ApolloConsumer>
    )
  }
}

const mapDispatchToProps = dispatch => ({
  clearStore: () => dispatch(clearStore())
});

export default connect(null, mapDispatchToProps)(withRouter(Logout));