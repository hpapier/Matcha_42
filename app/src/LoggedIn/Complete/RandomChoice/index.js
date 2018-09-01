// Modules imports.
import React, { Component } from 'react';
import { Query } from 'react-apollo';
import { connect } from 'react-redux';


// Locals imports.
import './index.sass';
import { GET_LIST_OF_USER_QUERY } from '../../../../query';
import { saveListOfUser, changeStatusView } from '../../../../store/action/synchronous';


// RandomChoice Component.
class RandomChoice extends Component {
  onCompletedHandler = data => {
    console.log(data);
  }

  render() {
    return (
      <Query query={GET_LIST_OF_USER_QUERY} onCompleted={data => this.onCompletedHandler(data)} fetchPolicy='cache-and-network'>
      {
        ({ loading, error }) => {
          return (
            <div>
              RandomChoice
            </div>
          );
        }
      }
      </Query>
    );
  }
};


// Redux connexion.
const mapStateToProps = state => ({
  statusView: state.statusView
});

const mapDispatchToProps = dispatch => ({
  changeStatusView: data => dispatch(changeStatusView(data)),
  saveListOfUser: data => dispatch(saveListOfUser(data))
});


// Export.
export default connect(mapStateToProps, mapDispatchToProps)(RandomChoice);