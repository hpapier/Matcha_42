// Modules imports.
import React from 'react';
import { Query } from 'react-apollo';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';


// Locals imports.
import './index.sass';
import { MESSAGE_SUBSCRIPTION, FETCH_MESSAGE_COUNT_QUERY } from '../../../../query';
import MessageSubscriberView from './View';
import Logout from '../../Utils/Logout';
import { clearStore } from '../../../../store/action/synchronous';


// MessageSubscriber Component.
const MessageSubscriber = props => {
  return (
    <Query query={FETCH_MESSAGE_COUNT_QUERY} fetchPolicy='cache-and-network'>
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
            document: MESSAGE_SUBSCRIPTION,
            variables: { token: localStorage.getItem('auth_token') || '' },
            updateQuery: (prev, { subscriptionData }) => {

              if (!subscriptionData.data || !subscriptionData.data.messageSub)
                return prev;

              const messageSub = subscriptionData.data.messageSub;
              return Object.assign({}, prev, { getCountMessage: { ...messageSub }});
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

        return <MessageSubscriberView data={data.getCountMessage} subscribeToMoreNotification={subscribeToMoreNotification} />
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
export default connect(null, mapDispatchToProps)(withRouter(MessageSubscriber));