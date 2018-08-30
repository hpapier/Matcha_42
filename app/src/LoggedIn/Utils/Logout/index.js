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
  }

  render() {
    return null;
  }
}

const mapDispatchToProps = dispatch => ({
  clearStore: () => dispatch(clearStore())
});

export default connect(null, mapDispatchToProps)(withRouter(Logout));