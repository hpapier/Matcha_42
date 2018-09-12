// Modules imports.
import React, { Component } from 'react';
import { Query } from 'react-apollo';
import { connect } from 'react-redux';


// Locals imports.
import './index.sass';
import { USER_LIKE_QUERY } from '../../../query';
import { saveUserLikeList } from '../../../store/action/synchronous';
import View from './View';


// UserLike Component.
class UserLike extends Component {
  onCompletedHandler = data => {
    this.props.saveUserLikeList(data.getUserLike);
  }

  render() {
    return (
      <Query query={USER_LIKE_QUERY} onCompleted={data => this.onCompletedHandler(data)} fetchPolicy='cache-and-network'>
      {
        ({ loading, error, refetch }) => {
          if (loading)
            return <div>Loading..</div>;

          if (error)
            return <div>Error</div>;

          return <View refetch={refetch} />
        }
      }
      </Query>
    );
  };
};


// Redux connection.
const mapDispatchToProps = dispatch => ({
  saveUserLikeList: data => dispatch(saveUserLikeList(data))
});


// Export.
export default connect(null, mapDispatchToProps)(UserLike);