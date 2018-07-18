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
const { GraphQLObjectType, GraphQLSchema, GraphQLString, GraphQLInt, GraphQLNonNull, GraphQLList } = graphql;
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
    userLocation: { type: GraphQLString },
    isComplete: { type: GraphQLInt },
    creationDate: { type: GraphQLString },
    lastConnexion: { type: GraphQLInt },
    isConnected: { type: GraphQLInt },
    token: { type: GraphQLString },
    confirmationToken: { type: GraphQLString },
    ageStart: { type: GraphQLInt },
    ageEnd: { type: GraphQLInt },
    scoreStart: { type: GraphQLInt },
    scoreEnd: { type: GraphQLInt },
    location: { type: GraphQLInt },
    tags: { type: GraphQLString },
    pictureNb: { type: GraphQLInt }
  }
});

const userInfo = new GraphQLObjectType({
  name: 'userInfo',
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
    userLocation: { type: GraphQLString },
    isComplete: { type: GraphQLInt },
    creationDate: { type: GraphQLString },
    lastConnexion: { type: GraphQLInt },
    isConnected: { type: GraphQLInt },
    token: { type: GraphQLString },
    confirmationToken: { type: GraphQLString },
    ageStart: { type: GraphQLInt },
    ageEnd: { type: GraphQLInt },
    scoreStart: { type: GraphQLInt },
    scoreEnd: { type: GraphQLInt },
    location: { type: GraphQLInt },
    tags: { type: GraphQLString },
    pictureNb: { type: GraphQLInt },
    picturesPath: { type: new GraphQLList(GraphQLString)},
    profilPicture: { type: GraphQLString }
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
      type: userInfo,
      args: {
        token: { type: GraphQLString }
      },
      resolve: (parent, { token }, context) => {
        console.log('----------------- GET USER INFO -----------------');
        if (token === 'null') {
          return new Error('Not connected');
        } else {
          const decoded = JWT.verify(token, JWTSecret);

          const QUERY = `SELECT * FROM user_info WHERE id = $1`;
          return client.query({
            name: 'fetch-user-info',
            text: QUERY,
            values: [decoded.uid]
          })
            .then(res => {
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
                userLocation,
                iscomplete,
                creation_date,
                last_connexion,
                isconnected,
                confirmation_token,
                profil_picture
              } = res.rows[0];

              console.log(id);
              if (password !== decoded.password)
                return new Error('Bad user');

              return client.query("SELECT * FROM user_pref WHERE user_id = $1", [id])
              .then(res => {
                const { age_start, age_end, score_start, score_end, location, tags } = res.rows[0];
                
                return client.query('SELECT * FROM images WHERE user_id = $1', [id])
                .then(res => {
                  console.log(res.rows);
                  let pictureNb = 0;
                  let picturesPath = [];

                  if (res.rows.length > 0) {
                    pictureNb = res.rows.length;
                    picturesPath = res.rows.map(item => item.path);
                  }

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
                    userLocation,
                    isComplete: iscomplete,
                    creationDate: creation_date,
                    lastConnexion: last_connexion,
                    isConnected: isconnected,
                    confirmationToken: confirmation_token,
                    ageStart: age_start,
                    ageEnd: age_end,
                    scoreStart: score_start,
                    scoreEnd: score_end,
                    location,
                    tags,
                    pictureNb,
                    picturesPath,
                    profilPicture: profil_picture
                  };
                })
                .catch(err => new Error(err));
              })
              .catch(err => new Error(err));
            })
            .catch(err => new Error('User not found'));
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
              userLocation,
              iscomplete,
              creation_date,
              last_connexion,
              isconnected,
              confirmation_token
            } = res.rows[0];
            
            return client.query('SELECT * FROM user_pref WHERE user_id = $1', [id])
            .then(res => {
              const { age_start, age_end, score_start, score_end, location, tags } = res.rows[0];

              return client.query('SELECT * FROM images WHERE user_id = $1', [id])
              .then(res => {
                let pictureNb;

                if (res.rows[0])
                  pictureNb = res.rows.length;
                else
                  pictureNb = 0;
 
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
                  userLocation,
                  isComplete: iscomplete,
                  creationDate: creation_date,
                  lastConnexion: last_connexion,
                  isConnected: isconnected,
                  token,
                  confirmationToken: confirmation_token,
                  ageStart: age_start,
                  ageEnd: age_end,
                  scoreStart: score_start,
                  scoreEnd: score_end,
                  location,
                  tags,
                  pictureNb
                };
              })
              .catch(err => new Error(err));
            })
            .catch(err => new Error(err));
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
    },

    checkResetReq: {
      type: state,
      args: {
        token: { type: GraphQLString },
        username: { type: GraphQLString }
      },
      resolve: (parent, { token, username }, ctx) => {
        const Q = 'SELECT reset_token as token FROM user_info WHERE username = $1';
        const V = [username];
        
        return client.query(Q, V)
          .then(res => {
            if (res.rows[0]) {
              if (token === res.rows[0].token)
                return { state: 'success' };
              else
                return new Error('Invalid token');
            } else {
              return new Error('Not found');
            }
          })
          .catch(err => {
            return new Error(err);
          });
      }
    },

    sendResetEmail: {
      type: state,
      args: {
        email: { type: GraphQLString }
      },
      resolve: (parent, { username, email }, ctx) => {
        const Q = 'SELECT * FROM user_info WHERE email = $1';
        const V = [email];

        return client.query(Q, V)
          .then(res => {
            const data = res.rows[0];
            if (data) {
              const resetTkn = randToken.generate(128);
              const Q1 = 'UPDATE user_info SET reset_token = $1 WHERE email = $2';
              const V1 = [resetTkn, email];
              return client.query(Q1, V1)
                .then(res => {
                  const options = {
                    from: 'hpapier.matcha@gmail.com',
                    to: email,
                    subject: 'Matcha - Réinitialisation de votre mot de passe.',
                    html: `<a href="http://localhost:8080/reset/${resetTkn}/${data.username}">Lien pour réinitialiser votre mot de passe</a>`
                  };
                  return transporter.sendMail(options)
                    .then(res => {
                      return { state: 'success' };
                    })
                    .catch(err => {
                      return new Error('Error server');
                    });
                })
                .catch(err => {
                  return new Error(err);
                });
            } else {
              return new Error('Not found');
            }
          })
          .catch(err => {
            return new Error(err);
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

            const Q_Pref = "INSERT INTO user_pref (user_id) VALUES ($1) RETURNING *;";
            const V_pref = [id];

            return client.query(Q_Pref, V_pref)
            .then(res => {
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
            .catch(err => new Error(err));
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
    },
    resetPwd: {
      type: state,
      args: {
        username: { type: GraphQLString },
        password: { type: GraphQLString }
      },
      resolve: (parent, { username, password }, ctx) => {
        const Q = 'UPDATE user_info SET password = $1 WHERE username = $2';
        const V = [password, username];
        return client.query(Q, V)
          .then(res => {
            return { state: 'success' };
          })
          .catch(err => {
            console.log(err);
            return new Error(err);
          });
      }
    },
    updatePreferences: {
      type: state,
      args: {
        id: { type: GraphQLString },
        ageStart: { type: GraphQLInt },
        ageEnd: { type: GraphQLInt },
        scoreStart: { type: GraphQLInt },
        scoreEnd: { type: GraphQLInt },
        location: { type: GraphQLInt },
        tags: { type: GraphQLString }
      },
      resolve: (parent, { id, ageStart, ageEnd, scoreStart, scoreEnd, location, tags }, ctx) => {
        const Q = 'UPDATE user_pref SET age_start = $1, age_end = $2, score_start = $3, score_end = $4, location = $5, tags = $6 WHERE user_id = $7';
        const V = [ageStart, ageEnd, scoreStart, scoreEnd, location, tags, id];

        return client.query(Q, V)
        .then(res => ({ state: 'success' }))
        .catch(err => new Error(err));
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