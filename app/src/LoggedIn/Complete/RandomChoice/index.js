// Modules imports.
import React, { Component } from 'react';
import { Query } from 'react-apollo';
import { connect } from 'react-redux';


// Locals imports.
import './index.sass';
import { GET_LIST_OF_USER_QUERY } from '../../../../query';
import { saveListOfUser } from '../../../../store/action/synchronous';
import Logout from '../../Utils/Logout';
import Main from './Main';


// RandomChoice Component.
class RandomChoice extends Component {
  onCompletedHandler = data => {
    this.props.saveListOfUser(data.getListOfUser);
  }

  render() {
    return (
      <Query query={GET_LIST_OF_USER_QUERY} onCompleted={data => this.onCompletedHandler(data)} fetchPolicy='cache-and-network'>
      {
        ({ loading, error }) => {
          if (loading)
          return <div id='lgi-random-choice-loading'><div id='lgi-random-choice-loading-animation'></div></div>;
          
          if (error) {
            if (error.graphQLErrors && error.graphQLErrors[0]) {
              if (error.graphQLErrors[0].message === 'Not auth')
              return <Logout />;
            }
            return <div className='lgi-list-error'>Oups! Une erreur est survenu, veuillez réessayer plus tard..</div>;
          }

          return <Main />;
        }
      }
      </Query>
    );
  }
};


// Redux connection.
const mapDispatchToProps = dispatch => ({
  saveListOfUser: data => dispatch(saveListOfUser(data))
});


// Export.
export default connect(null, mapDispatchToProps)(RandomChoice);