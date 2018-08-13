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
  type User {
    id: Int
    name: String
    password: String
  }

  type Post {
    id: Int
    content: String
    author: String
  }

  type Status {
    status: Boolean
  }

  type Query {
    userStatus: Status
  }

  type Mutation {
    addUser(name: String, password: String): User
    addPost(content: String, author: String): Post
  }

  type Subscription {
    postAdded: Post
  }
`;

const resolvers = {
  Query: {
    userStatus: async (parent, args, ctx) => {
      const token = await verifyUserToken(ctx.headers);
      return { status: token };
    }
  },

  Mutation: {
    addUser: async (parent, { name, password }, ctx) => {
      const res = await client.query('INSERT INTO userInfo (name, password) VALUES ($1, $2) RETURNING *', [name, password]);

      // =========
      console.log('-> AddPost Mutation, response :');
      console.log(res.rows[0]);
      // =========

      return { id: res.rows[0].id, name: res.rows[0].name, password: res.rows[0].password };
    },

    addPost: async (parent, { content, author }, ctx) => {
      const res = await client.query('INSERT INTO post (content, author) VALUES ($1, $2) RETURNING *', [content, author]);

      // =========
      console.log('-> AddPost Mutation, response :');
      console.log(res);
      // =========

      pubSub.publish('postAdded', { postAdded: { id: res.rows[0].id, content: res.rows[0].content, author: res.rows[0].author }});
      return { id: res.rows[0].id, content: res.rows[0].content, author: res.rows[0].author };
    }
  },

  Subscription: {
    postAdded: {
      subscribe: () => pubSub.asyncIterator('postAdded')
    }
  }
};

const schema = makeExecutableSchema({
  typeDefs,
  resolvers
});

module.exports = { schema };