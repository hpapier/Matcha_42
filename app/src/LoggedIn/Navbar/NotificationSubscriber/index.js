// Modules imports.
import React from 'react';
import { Query } from 'react-apollo';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';


// Locals imports.
import './index.sass';
import { NOTIFICATION_SUBSCRIPTION, FETCH_NOTIF_COUNT_QUERY } from '../../../../query';
import NotificationSubscriberView from './View';
import Logout from '../../Utils/Logout';
import { clearStore } from '../../../../store/action/synchronous';


// NotificationSubscriber Component.
const NotificationSubscriber = props => {
  return (
    <Query query={FETCH_NOTIF_COUNT_QUERY} fetchPolicy='cache-and-network'>
    {
      ({ subscribeToMore, loading, error, data, client }) => {
        if (loading)
          return null;

        if (error) {
          if (error.graphQLErrors && error.graphQLErrors[0]) {
            if (error.graphQLErrors[0].message === 'Not auth') {
              return <Logout />
            }
          }

          return null;
        }

        const subscribeToMoreNotification = () => {
          subscribeToMore({
            document: NOTIFICATION_SUBSCRIPTION,
            variables: { token: localStorage.getItem('auth_token') || '' },
            updateQuery: (prev, { subscriptionData }) => {

              if (!subscriptionData.data || !subscriptionData.data.notificationSub)
                return prev;

              const notificationSub = subscriptionData.data.notificationSub;
              return Object.assign({}, prev, { getCountNotification: { ...notificationSub }});
            },
            onError: (e) => {
              if (e.graphQLErrors && e.graphQLErrors[0]) {
                if (e.graphQLErrors[0].message === 'Not auth') {
                  client.resetStore()
                    .then(r => { return; })
                    .catch(r => { return; });
                  localStorage.removeItem('auth_token');
                  props.clearStore();
                  props.history.push('/');
                }
              }
            }
          })
        }

        return <NotificationSubscriberView data={data.getCountNotification} subscribeToMoreNotification={subscribeToMoreNotification} />
      }
    }
    </Query>
  );
};


// Redux connection.
const mapDispatchToProps = dispatch => ({
  clearStore: () => dispatch(clearStore())
});


// Export.
export default connect(null, mapDispatchToProps)(withRouter(NotificationSubscriber));