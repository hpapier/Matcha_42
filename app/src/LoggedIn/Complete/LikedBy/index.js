// Modules imports.
import React, { Component } from 'react';
import { Query } from 'react-apollo';
import { connect } from 'react-redux';


// Locals imports.
import './index.sass';
import { GET_LIKER_QUERY } from '../../../../query';
import View from './View';
import { saveLikerList } from '../../../../store/action/synchronous';
import Logout from '../../Utils/Logout';


// LikedBy Component.
class LikedBy extends Component {
  onCompletedHandler = data => {
    this.props.saveLikerList(data.getLikerList);
  }

  render() {
    return (
      <Query query={GET_LIKER_QUERY} onCompleted={data => this.onCompletedHandler(data)} pollInterval={300}>
      {
        ({ loading, error }) => {
          if (loading)
            return <div id='lgi-complete-visitedby-loading'><div id='lgi-complete-visitedby-loading-animation'></div></div>;

          if (error) {
            if (error.graphQLErrors && error.graphQLErrors[0]) {
              if (error.graphQLErrors[0].message === 'Not auth')
              return <Logout />;
            }
            return <div className='lgi-list-error'>Oups! Une erreur est survenu, veuillez réessayer plus tard..</div>;
          }

          return (
            <div>
              <View />
            </div>
          );
        }
      }
      </Query>
    );
  };
};


// Redux connection.
const mapDispatchToProps = dispatch => ({
  saveLikerList: data => dispatch(saveLikerList(data))
});


// Export.
export default connect(null, mapDispatchToProps)(LikedBy);