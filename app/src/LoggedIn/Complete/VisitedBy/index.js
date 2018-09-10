// Modules imports.
import React, { Component } from 'react';
import { Query } from 'react-apollo';
import { connect } from 'react-redux';


// Locals imports.
import './index.sass';
import { GET_VISITOR_QUERY } from '../../../../query';
import View from './View';
import { saveVisitorList } from '../../../../store/action/synchronous';


// VisitedBy Component.
class VisitedBy extends Component {
  onCompletedHandler = data => {
    console.log('VISITOR LIST ->');
    console.log(data.getVisitorList);
    this.props.saveVisitorList(data.getVisitorList);
  }

  render() {
    return (
      <Query query={GET_VISITOR_QUERY} onCompleted={data => this.onCompletedHandler(data)} fetchPolicy='cache-and-network'>
      {
        ({ loading, error }) => {
          if (loading)
            return <div>loading..</div>;

          if (error) {
            if (error.graphQLErrors) {

            } else {
              return <div>Oups! Une erreur est survenu</div>
            }
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
  saveVisitorList: data => dispatch(saveVisitorList(data))
});


// Export.
export default connect(null, mapDispatchToProps)(VisitedBy);