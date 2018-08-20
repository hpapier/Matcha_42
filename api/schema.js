const { makeExecutableSchema } = require('graphql-tools');
const { client } = require('./database.js');
const { PostgresPubSub } = require('graphql-postgres-subscriptions');
const JWT = require('jsonwebtoken');
const JWTSECRET = 'lkjkjoiuoidSFsdgkjDSFLDOR435Dfdg34554435DSFdGfdgdfkljgg45546ERGG650128923';

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

  type Query {
    userStatus: Status
    userAuth(username: String!, password: String!): AuthStatus
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
  }

  // Mutation: {
  //   // addUser: async (parent, { name, password }, ctx) => {
  //   //   const res = await client.query('INSERT INTO userInfo (name, password) VALUES ($1, $2) RETURNING *', [name, password]);
  //   //   return { id: res.rows[0].id, name: res.rows[0].name, password: res.rows[0].password };
  //   // }

  //   // addPost: async (parent, { content, author }, ctx) => {
  //   //   const res = await client.query('INSERT INTO post (content, author) VALUES ($1, $2) RETURNING *', [content, author]);
  //   //   pubSub.publish('postAdded', { postAdded: { id: res.rows[0].id, content: res.rows[0].content, author: res.rows[0].author }});
  //   //   return { id: res.rows[0].id, content: res.rows[0].content, author: res.rows[0].author };
  //   // }
  // },

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