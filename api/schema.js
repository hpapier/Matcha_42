const { makeExecutableSchema } = require('graphql-tools');
const { client } = require('./database.js');
const { PostgresPubSub } = require('graphql-postgres-subscriptions');

const pubSub = new PostgresPubSub({ client });

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

  type Query {
    getUser: [User]
    getPost: [Post]
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
    getUser: async () => {
      const res = await client.query('SELECT * FROM userInfo');

      // =========
      console.log('-> GetUser Query, response :');
      console.log(res);
      // =========

      return [];
    },

    getPost: async () => {
      const res = await client.query('SELECT * FROM post');

      // =========
      console.log('-> GetPost Query, response :');
      console.log(res);
      // =========
    
      if (res.rows[0])
        return res.rows;
      else
        return [];
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