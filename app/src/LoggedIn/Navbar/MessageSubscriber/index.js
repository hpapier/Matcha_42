// Modules imports.
import React from 'react';
import { Query } from 'react-apollo';


// Locals imports.
import './index.sass';
import { MESSAGE_SUBSCRIPTION, FETCH_MESSAGE_COUNT_QUERY } from '../../../../query';
import MessageSubscriberView from './View';


// MessageSubscriber Component.
const MessageSubscriber = props => {
  return (
    <Query query={FETCH_MESSAGE_COUNT_QUERY} fetchPolicy='cache-and-network'>
    {
      ({ subscribeToMore, loading, error, data }) => {
        if (loading)
          return null;

        if (error)
          return null;


        const subscribeToMoreNotification = () => {
          subscribeToMore({
            document: MESSAGE_SUBSCRIPTION,
            variables: { token: localStorage.getItem('auth_token') || '' },
            updateQuery: (prev, { subscriptionData }) => {

              if (!subscriptionData.data || !subscriptionData.data.messageSub)
                return prev;

              const messageSub = subscriptionData.data.messageSub;
              return Object.assign({}, prev, { getCountMessage: { ...messageSub }});
            }
          })
        }

        return <MessageSubscriberView data={data.getCountMessage} subscribeToMoreNotification={subscribeToMoreNotification} />
      }
    }
    </Query>
  );
};


// Export.
export default MessageSubscriber;