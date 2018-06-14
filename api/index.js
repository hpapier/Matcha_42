// Module imports
const express = require('express');
const cors = require('cors');
const graphqlExpress = require('express-graphql');
const pg = require('pg');
const graphql = require('graphql');

// Constante
const app = express();
const PORT = 4000;
const { GraphQLObjectType, GraphQLSchema, GraphQLID, GraphQLString} = graphql;

// Database
// --> Constante
const host = 'postgres://postgres@127.0.0.1:5432/matcha';
const client = new pg.Client(host);

// --> Connection
client.connect(() => console.log('Connected to database'));

// GraphQL Schema
const user = new GraphQLObjectType({
  name: 'User',
  fields: {
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    email: { type: GraphQLString }
  }
});

const Query = new GraphQLObjectType({
  name: 'Query',
  fields: () => ({
    getUserInfo: {
      type: user,
      args: {
        token: { type: GraphQLString }
      },
      resolve: (parent, args, context) => {
        // throw new Error('LOOOOOL');
        if (args.token === 'null')
          throw new Error('Not connected');
        else {
          return {
            id: 'jkhjhjkhk',
            name: 'hugo',
            email: 'lolllll'
          };
        }
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