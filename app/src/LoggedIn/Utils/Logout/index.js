// Modules imports.
import React, { Component } from 'react';
import { ApolloConsumer } from 'react-apollo';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';


// Locals imports.
import { clearStore } from '../../../../store/action/synchronous';


// Logout Component.
class Logout extends Component {
  render() {
    return (
      <ApolloConsumer>
      {
        client => {
          client.resetStore()
            .then(r => { return; })
            .catch(e => { return; });
          this.props.clearStore();
          localStorage.removeItem('auth_token');
          return <Redirect to='/' />
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
export default connect(null, mapDispatchToProps)(Logout);