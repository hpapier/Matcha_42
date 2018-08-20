const { makeExecutableSchema } = require('graphql-tools');
const { client } = require('./database.js');
const { PostgresPubSub } = require('graphql-postgres-subscriptions');
const randtoken = require('rand-token');
const JWT = require('jsonwebtoken');
const JWTSECRET = 'lkjkjoiuoidSFsdgkjDSFLDOR435Dfdg34554435DSFdGfdgdfkljgg45546ERGG650128923';
const bcrypt = require('bcrypt');

const pubSub = new PostgresPubSub({ client });

const verifyUserToken = async token => {
  if (token.authorization === '')
    return false;

  const decoded = JWT.verify(token, JWTSECRET);
  const res = await client.query('SELECT * FROM user_info WHERE id = $1', [decoded.id]);
  if (res.rows[0])
    return true;
  return false;
}

const typeDefs = `
  type Status {
    status: Boolean
  }

  type AuthStatus {
    status: Boolean
    message: String
    jwtToken: String
  }

  type SignUpStatus {
    message: String
  }




  type Query {
    userStatus: Status
    userAuth(username: String!, password: String!): AuthStatus
  }

  type Mutation {
    signUpMutation(username: String!, email: String!, lastname: String!, firstname: String!, birthDate: String!, genre: String!, interest: String!, password: String): SignUpStatus
  }

`;


// type Subscription {
//   postAdded: Post
// }
//     signUp(username: !String, email: !String, lastname: !String, firstname: !String, birthDate: !Date, genre: !String, interest: !String, password: !String): AuthStatus


const resolvers = {
  Query: {
    userStatus: async (parent, args, ctx) => {
      const token = await verifyUserToken(ctx.headers);
      return { status: token };
    },

    userAuth: async (parent, { username, password }, ctx)  => {
      const res = await client.query('SELECT * FROM user_info WHERE username = $1', [username]);
      if (!res)
        return { status: false, message: 'Server Error', jwtToken: '' };
      
      if (!res.rows[0])
        return { status: false, message: 'User not found', jwtToken: '' };
      
      if (password !== res.rows[0].password)
        return { status: false, message: 'Wrong password', jwtToken: '' };
      
      return { status: true, message: 'Success', jwtToken: 'lkdjfkdshjkfjghdfjfgudhgfuydfgvuygfyudrgyug' };
    }
  },

  Mutation: {
    signUpMutation: async (parent, { username, email, lastname, firstname, birthDate, genre, interest, password }, ctx) => {
      try {
        const usernameCheck = await client.query('SELECT * FROM user_info WHERE username = $1', [username]);
        if (usernameCheck.rows[0])
          return { message: 'Username exist' };
  
        const emailCheck = await client.query('SELECT * FROM user_info WHERE email = $1', [email]);
        if (emailCheck.rows[0])
          return { message: 'Email exist' };
  
        const salt = bcrypt.genSaltSync(10);
        const hashedPwd = bcrypt.hashSync(password, salt);

        const emailConfirmationToken = randtoken.generate(64);
        const insertion = 'INSERT INTO user_info (email, username, lastname, firstname, password, birth_date, genre, sexual_orientation, creation_date, confirmation_token) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *';
        const creationDate = new Date();
        const result = await client.query(insertion, [email, username, lastname, firstname, hashedPwd, birthDate, genre, interest, creationDate, emailConfirmationToken]);

        return { message: 'Success' };
      } catch (e) {
        console.log(e);
        return { message: 'Error server' };
      }
    }

    // addPost: async (parent, { content, author }, ctx) => {
    //   const res = await client.query('INSERT INTO post (content, author) VALUES ($1, $2) RETURNING *', [content, author]);
    //   pubSub.publish('postAdded', { postAdded: { id: res.rows[0].id, content: res.rows[0].content, author: res.rows[0].author }});
    //   return { id: res.rows[0].id, content: res.rows[0].content, author: res.rows[0].author };
    // }
  },

  // Subscription: {
  //   postAdded: {
  //     subscribe: () => pubSub.asyncIterator('postAdded')
  //   }
  // }
};

const schema = makeExecutableSchema({
  typeDefs,
  resolvers
});

module.exports = { schema };