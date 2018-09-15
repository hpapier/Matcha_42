// Modules imports.
import React, { Component } from 'react';
import { ApolloConsumer } from 'react-apollo';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';


// Locals imports.
import { clearStore } from '../../../../store/action/synchronous';
import { DISCONNECT_USER_QUERY } from '../../../../query';


// Logout Component.
class Logout extends Component {
  async componentDidMount() {
    await this.client.query({
      query: DISCONNECT_USER_QUERY
    });

    this.client.resetStore()
      .then(r => { return; })
      .catch(e => { return; });

    localStorage.removeItem('auth_token');
    this.props.clearStore();
    this.props.history.push('/');
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
    );
  };
};


// Redux connection.
const mapDispatchToProps = dispatch => ({
  clearStore: () => dispatch(clearStore())
});


// Export.
export default connect(null, mapDispatchToProps)(withRouter(Logout));