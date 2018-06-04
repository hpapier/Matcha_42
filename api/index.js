// Module imports
const express = require('express');
const cors = require('cors');
const graphqlExpress = require('express-graphql');
const pg = require('pg');
const graphql = require('graphql');

// Constante
const app = express();
const PORT = 4000;
const { GraphQLObjectType, GraphQLSchema, GraphQLID, GraphQLString, GraphQLInt} = graphql;

// Database
// --> Constante
// const host = 'postgres://postgres@127.0.0.1:5432/postgres';
// const client = new pg.Client(host);

// --> Connection
// client.connect();

// GraphQL Schema
const user = new GraphQLObjectType({
  name: 'User',
  fields: {
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    age: { type: GraphQLInt }
  }
});

const Query = new GraphQLObjectType({
  name: 'Query',
  fields: () => ({
    user: {
      type: user,
      resolve: (parent, args, context) => {
        return {
          id: 'jkhjhjkhk',
          name: 'hugo',
          age: 55
        };
      }
    }
  })
});

const Schema = new GraphQLSchema({
  query: Query
});

// Middleware
app.use('/graphql', cors(), graphqlExpress({
  schema: Schema,
  graphiql: true
}));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));