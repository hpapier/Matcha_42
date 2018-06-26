// Module imports
const express = require('express');
const cors = require('cors');
const graphqlExpress = require('express-graphql');
const pg = require('pg');
const graphql = require('graphql');
const uuidv1 = require('uuid/v1');
const JWT = require('jsonwebtoken');

// Constante
const app = express();
const PORT = 4000;
const { GraphQLObjectType, GraphQLSchema, GraphQLString, GraphQLInt, GraphQLNonNull } = graphql;
const JWTSecret = 'kjhjhhyuhf45456lkjkzFdjkbssDjkdbefsS';
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
    id: { type: GraphQLString },
    email: { type: GraphQLString },
    username: { type: GraphQLString },
    lastname: { type: GraphQLString },
    firstname: { type: GraphQLString },
    password: { type: GraphQLString },
    birthDate: { type: GraphQLString },
    isConfirmed: { type: GraphQLInt },
    genre: { type: GraphQLString },
    sexualOrientation: { type: GraphQLString },
    bio: { type: GraphQLString },
    popularityScore: { type: GraphQLInt },
    location: { type: GraphQLString },
    isComplete: { type: GraphQLInt },
    creationDate: { type: GraphQLString },
    lastConnexion: { type: GraphQLInt },
    isConnected: { type: GraphQLInt }
  }
});

const usertkn = new GraphQLObjectType({
  name: 'UserToken',
  fields: {
    id: { type: GraphQLString },
    email: { type: GraphQLString },
    username: { type: GraphQLString },
    lastname: { type: GraphQLString },
    firstname: { type: GraphQLString },
    password: { type: GraphQLString },
    birthDate: { type: GraphQLString },
    isConfirmed: { type: GraphQLInt },
    genre: { type: GraphQLString },
    sexualOrientation: { type: GraphQLString },
    bio: { type: GraphQLString },
    popularityScore: { type: GraphQLInt },
    location: { type: GraphQLString },
    isComplete: { type: GraphQLInt },
    creationDate: { type: GraphQLString },
    lastConnexion: { type: GraphQLInt },
    isConnected: { type: GraphQLInt },
    token: { type: GraphQLString }
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
      resolve: (parent, { token }, context) => {
        console.log('----------------- GET USER INFO -----------------');
        if (token === 'null') {
          console.log(token);
          return new Error('Not connected');
        } else {
          const decoded = JWT.verify(token, JWTSecret);
          console.log(decoded);

          const QUERY = `SELECT * FROM user_info WHERE id = $1`;
          return client.query({
            name: 'fetch-user-info',
            text: QUERY,
            values: [decoded.uid]
          })
            .then(res => {
              console.log('-- THEN (USER INFO) --');
              console.log(res.rows[0]);
              const {
                id,
                email,
                username,
                lastname,
                firstname,
                password,
                birth_date,
                isconfirmed,
                genre,
                sexual_orientation,
                bio,
                popularity_score,
                location,
                iscomplete,
                creation_date,
                last_connexion,
                isconnected
              } = res.rows[0];

              if (password !== decoded.password)
                return new Error('Bad user');

              return {
                id,
                email,
                username,
                lastname,
                firstname,
                password,
                birthDate: birth_date,
                icConfirmed: isconfirmed,
                genre,
                sexualOrientation: sexual_orientation,
                bio,
                popularityScore: popularity_score,
                location,
                isComplete: iscomplete,
                creationDate: creation_date,
                lastConnexion: last_connexion,
                isConnected: isconnected
              };
            })
            .catch(err => {
              console.log(err);
              return new Error('User not found');
            });
        }
      }
    },
    checkUserInfo: {
      type: usertkn,
      args: {
        email: { type: GraphQLString },
        password: { type: GraphQLString }
      },
      resolve: (parent, { email, password }, context) => {
        console.log(email, password);
        const QUERY = 'SELECT * FROM user_info WHERE email = $1';
        return client.query({
          name: 'fetch-user',
          text: QUERY,
          values: [email]
        })
        .then(res => {
          if (res.rows[0].password === password) {
            const token = JWT.sign(
              {
                uid: res.rows[0].id,
                password: res.rows[0].password
              },
              JWTSecret,
              { expiresIn: 60 * 60 * 24 * 7 }
            );
            
            const {
              id,
              email,
              username,
              lastname,
              firstname,
              password,
              birth_date,
              isconfirmed,
              genre,
              sexual_orientation,
              bio,
              popularity_score,
              location,
              iscomplete,
              creation_date,
              last_connexion,
              isconnected
            } = res.rows[0];
            
            return {
              id,
              email,
              username,
              lastname,
              firstname,
              password,
              birthDate: birth_date,
              isConfirmed: isconfirmed,
              genre,
              sexualOrientation: sexual_orientation,
              bio,
              popularityScore: popularity_score,
              location,
              isComplete: iscomplete,
              creationDate: creation_date,
              lastConnexion: last_connexion,
              isConnected: isconnected,
              token
            };
          } else {
            return new Error('Wrong password');
          }
        })
        .catch(err => {
          console.log(err);
          if (err)
            return new Error('User not found');
        });
      }
    }
  })
});

const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    addUser: {
      type: user,
      args: {
        email: { type: new GraphQLNonNull(GraphQLString) },
        username: { type: new GraphQLNonNull(GraphQLString) },
        firstname: { type: new GraphQLNonNull(GraphQLString) },
        lastname: { type: new GraphQLNonNull(GraphQLString) },
        birthDate: { type: new GraphQLNonNull(GraphQLString) },
        genre: { type: new GraphQLNonNull(GraphQLString) },
        sexualOrientation: { type: new GraphQLNonNull(GraphQLString) },
        password: { type: new GraphQLNonNull(GraphQLString) }
      },
      resolve: (parent, args, context) => {
        console.log('----------------- ADD USER FUNCTION -----------------');
        console.log(args);
        const { email, username, firstname, lastname, birthDate, genre, sexualOrientation, password } = args;
        const date = new Date(birthDate);
        const genreTrad = (genre === 'Homme') ? 'man' : 'woman';
        
        let sexualOrientationTrad = 'bisexual';
        if (sexualOrientation === 'Homme')
          sexualOrientationTrad = 'man';
        else if (sexualOrientation === 'Femme')
          sexualOrientationTrad = 'woman';
        else
          sexualOrientationTrad = 'bisexual';

        const QUERY = 'INSERT INTO user_info (id, email, username, firstname, lastname, birth_date, genre, sexual_orientation, password, creation_date) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *;';
        const id = uuidv1();
        const VALUES = [id, email, username, firstname, lastname, date, genreTrad, sexualOrientationTrad, password, new Date()];
        return client.query(QUERY, VALUES)
          .then(res => {
            console.log('-- THEN --');
            console.log(res.rows[0]);
            const { 
              id,
              email,
              username,
              lastname,
              firstname,
              password,
              birth_date,
              isconfirmed,
              genre,
              sexual_orientation,
              bio,
              popularity_score,
              location,
              iscomplete,
              creation_date,
              last_connexion,
              isconnected
            } = res.rows[0];


            return {
              id,
              email,
              username,
              lastname,
              firstname,
              password,
              birthDate: birth_date,
              isconfirmed,
              genre,
              sexualOrientation: sexual_orientation,
              bio,
              popularityScore: popularity_score,
              location,
              iscomplete,
              creationDate: creation_date,
              lastConnexion: last_connexion,
              isconnected
            };
          })
          .catch(err => {
            console.log('-- CATCH --');
            console.log(err);
          });
      }
    }
  }
});

const Schema = new GraphQLSchema({
  query: Query,
  mutation: Mutation
});

// Middleware
app.use('/graphql', cors(), graphqlExpress({
  schema: Schema,
  graphiql: true
}));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));