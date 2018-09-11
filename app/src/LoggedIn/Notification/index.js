// Modules imports.
import React, { Component } from 'react';
import { Query } from 'react-apollo';
import { connect } from 'react-redux';


// Locals imports.
import './index.sass';
import { NOTIFICATION_COMPONENT_QUERY } from '../../../query';
import View from './View';
import { saveNotifList } from '../../../store/action/synchronous';


// Notification Component.
class Notification extends Component {
  onCompleteHandler = data => {
    const { getUserNotification } = data;
    const { saveNotifList } = this.props;
    saveNotifList(getUserNotification);
  }

  render() {
    return (
      <Query query={NOTIFICATION_COMPONENT_QUERY} onCompleted={data => this.onCompleteHandler(data)} fetchPolicy='cache-and-network'>
      {
        ({ loading, error }) => {
          if (loading)
            return <div><div></div></div>;

          if (error) {
            if (error.graphQlErrors && error.graphQlErrors[0]) {
              if (error.graphQlErrors[0].message === 'Not auth')
                return <Logout />;
            }

            return <div>Oups! Une erreur est survenu..</div>;
          }

          return (
            <div>
              <View />
            </div>
          );
        }
      }
      </Query>
    )
  }
};


// Redux connection.
const mapDispatchToProps = dispatch => ({
  saveNotifList: data => dispatch(saveNotifList(data))
});


// Export.
export default connect(null, mapDispatchToProps)(Notification);