import React, { Component } from 'react';
import { gql } from 'apollo-boost';
import {graphql} from 'react-apollo';

import './index.scss';

const UserQuery = gql`
  {
    user {
      name
      id
      age
    }
  }
`;

class App extends Component {
  render() {
    console.log(this.props);
    return (
      <div>
        Hello world
        { (this.props.data.user) ? 'YEAH USER IS THERE' : null }
      </div>
    );
  }
}

export default graphql(UserQuery)(App);