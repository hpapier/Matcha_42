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
client.connect(err => {
  if (err)
    console.log(err);
  else
    console.log('Connected to db');
});

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
        if (args.token === 'null') {
          console.log('--- ARGUMENT ---');
          console.log(args.token);
          throw new Error('Not connected');
        }
        else {
          console.log('START QUERY');
          const QUERY = `SELECT * FROM user_info WHERE id = ${args.token}`;
          return client.query(QUERY)
            .then(data => {
              console.log('-- THEN --');
              console.log(data);
              return data;
            })
            .catch(err => {
              console.log('-- CATCH --');
              console.log(err);
              return err;
            });
        }
      }
    }
  })
});

// const Mutation = new GraphQLObjectType({
//   name: 'Mutation'
// });

const Schema = new GraphQLSchema({
  query: Query
});

// Middleware
app.use('/graphql', cors(), graphqlExpress({
  schema: Schema,
  graphiql: true
}));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));