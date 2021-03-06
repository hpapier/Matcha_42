// Modules imports.
import React, { Component } from 'react';
import { Query } from 'react-apollo';
import { connect } from 'react-redux';


// Locals imports.
import './index.sass';
import SearchLoading from './SearchLoading';
import SearchMutation from './SearchMutation';
import SearchError from './SearchError';
import Logout from '../../Utils/Logout';
import { saveUserPref } from '../../../../store/action/synchronous';
import { GET_USER_PREFERENCE_QUERY } from '../../../../query';


// Search Component.
class Search extends Component {
  onCompletedHandler = data => {
    this.props.saveUserPref(data.getUserPreference);
  }

  render() {
    return (
      <Query query={GET_USER_PREFERENCE_QUERY} onCompleted={data => this.onCompletedHandler(data)} fetchPolicy='cache-and-network'>
      {
        ({ loading, error }) => {
          if (loading)
            return <SearchLoading />;

          if (error) {
            if (error.graphQLErrors && error.graphQLErrors[0]) {
              if (error.graphQLErrors[0].message === 'Not auth')
                return <Logout />;
            }
            return <SearchError />;
          }

          return <SearchMutation />;
        }
      }
      </Query>
    );
  }
}


// Redux connection.
const mapDispatchToProps = dispatch => ({
  saveUserPref: data => dispatch(saveUserPref(data))
});


// Export.
export default connect(null, mapDispatchToProps)(Search);