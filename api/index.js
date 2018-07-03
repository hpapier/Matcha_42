// Module imports
const express = require('express');
const cors = require('cors');
const graphqlExpress = require('express-graphql');
const pg = require('pg');
const graphql = require('graphql');
const uuidv1 = require('uuid/v1');
const JWT = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const randToken = require('rand-token');

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

// Email configuration
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'hpapier.matcha@gmail.com',
    pass: 'matcha123456789'
  }
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
    isConnected: { type: GraphQLInt },
    confirmationToken: { type: GraphQLString }

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
    token: { type: GraphQLString },
    confirmationToken: { type: GraphQLString }
  }
});

const state = new GraphQLObjectType({
  name: 'State',
  fields: {
    state: { type: GraphQLString }
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
                isconnected,
                confirmation_token
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
                isConnected: isconnected,
                confirmationToken: confirmation_token
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
              isconnected,
              confirmation_token
            } = res.rows[0];

            console.log(`IS CONFIRMED ${isconfirmed}`);
            
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
              token,
              confirmationToken: confirmation_token
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

        const QUERY = 'INSERT INTO user_info (id, email, username, firstname, lastname, birth_date, genre, sexual_orientation, password, creation_date, confirmation_token) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *;';
        const id = uuidv1();
        const confirmToken = randToken.generate(128);
        console.log(`RAND TOKEN = ${confirmToken}`);
        const VALUES = [id, email, username, firstname, lastname, date, genreTrad, sexualOrientationTrad, password, new Date(), confirmToken];
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
              isconnected,
              confirmation_token
            } = res.rows[0];

            const options = {
              from: 'hpapier.matcha@gmail.com',
              to: email,
              subject: 'TEST',
              html: `<a href="http://localhost:8080/email/${confirmation_token}/${username}">CLIQUE BITCH</a>`
            };
            return transporter.sendMail(options)
              .then(res => {
                console.log(res);
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
                  isconnected,
                  confirmationToken: confirmation_token
                };
              })
              .catch(err => {
                console.log(err);
                return new Error('MAIL CRASH');
              });
          })
          .catch(err => {
            console.log('-- CATCH --');
            console.log(err);
          });
      }
    },
    validAccount: {
      type: state,
      args: {
        token: { type: GraphQLString },
        username: { type: GraphQLString }
      },
      resolve: (parent, { token, username }, ctx) => {
        console.log('--- VALID ACCOUNT MUTATION ---');
        const QUERY = 'SELECT confirmation_token as token, isconfirmed FROM user_info WHERE username = $1';
        return client.query(QUERY, [username])
        .then(res => {
          if (res.rows[0]) {
            if (res.rows[0].isconfirmed === 1)
              return new Error('Already confirmed');
            
            if (res.rows[0].token !== token)
              return new Error('Invalid token');

            const Q = 'UPDATE user_info SET isconfirmed = 1 WHERE username = $1';
            return client.query(Q, [username])
            .then(res => {
              return { state: 'confirmed' };
            })
            .catch(err => {
              return new Error('Error server');
            });
          }
          else
            return new Error('NOT FOUND');
        })
        .catch(err => {
          return new Error(err);
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