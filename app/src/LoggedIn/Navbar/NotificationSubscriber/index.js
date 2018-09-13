// Modules imports.
import React from 'react';
import { Query } from 'react-apollo';


// Locals imports.
import './index.sass';
import { NOTIFICATION_SUBSCRIPTION, FETCH_NOTIF_COUNT_QUERY } from '../../../../query';
import NotificationSubscriberView from './View';


// NotificationSubscriber Component.
const NotificationSubscriber = props => {
  return (
    <Query query={FETCH_NOTIF_COUNT_QUERY} fetchPolicy='cache-and-network'>
    {
      ({ subscribeToMore, loading, error, data }) => {
        if (loading)
          return null;

        if (error)
          return null;

        const subscribeToMoreNotification = () => {
          subscribeToMore({
            document: NOTIFICATION_SUBSCRIPTION,
            variables: { token: localStorage.getItem('auth_token') || '' },
            updateQuery: (prev, { subscriptionData }) => {

              if (!subscriptionData.data || !subscriptionData.data.notificationSub)
                return prev;

              const notificationSub = subscriptionData.data.notificationSub;
              return Object.assign({}, prev, { getCountNotification: { ...notificationSub }});
            }
          })
        }

        return <NotificationSubscriberView data={data.getCountNotification} subscribeToMoreNotification={subscribeToMoreNotification} />
      }
    }
    </Query>
  );
};


// Export.
export default NotificationSubscriber;