import React from 'react';
import ReactDOM from 'react-dom';
import App from './src/App';
import store from './store';
import { Provider } from 'react-redux';
import { ApolloProvider } from 'react-apollo';
import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { HttpLink } from 'apollo-link-http';
import { onError } from "apollo-link-error";
import { ApolloLink, split } from "apollo-link";
import { WebSocketLink } from 'apollo-link-ws';
import { getMainDefinition } from 'apollo-utilities';
import { setContext } from 'apollo-link-context';
// import { applyMiddleware } from 'subscriptions-transport-ws';
import './index.scss';

const LinkHttp = new HttpLink({
  uri: 'http://localhost:4000/graphql'
});

const LinkWs = new WebSocketLink({
  uri: 'ws://localhost:4000/subscriptions',
  options: {
    reconnect: true,
    // connectionParams: () => ({
    //   authorization: token ? `Bearer ${token}` : ''
    // })
  }
});

// const subscriptionMiddleware = {
//   applyMiddleware (options, next) {
//     options.auth = { someKey: "lol" }
//     next()
//   }
// }

// LinkWs.subscriptionClient.use([subscriptionMiddleware])

const link = split(
  ({ query }) => {
    const { kind, operation } = getMainDefinition(query);
    return kind === 'OperationDefinition' && operation === 'subscription';
  },
  LinkWs,
  LinkHttp
);

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('auth_token');
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : ''
    }
  };
});

const client = new ApolloClient({
  link: ApolloLink.from([
    onError((lol) => {
      // if (lol.graphQLErrors)
      //   lol.graphQLErrors.map(({ message, locations, path }) => {
      //     console.log(`[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`);
      //   }
      // );
      // if (lol.networkError) console.log(`[Network error]: ${lol.networkError}`);
    }),
    authLink.concat(link)
  ]),
  cache: new InMemoryCache()
});


ReactDOM.render(
  <ApolloProvider client={client}>
    <Provider store={store}>
        <App />
    </Provider>
  </ApolloProvider>,
  document.getElementById('root')
);