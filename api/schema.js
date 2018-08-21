const { makeExecutableSchema } = require('graphql-tools');
const { client } = require('./database.js');
const { PostgresPubSub } = require('graphql-postgres-subscriptions');
const randtoken = require('rand-token');
const JWT = require('jsonwebtoken');
const JWTSECRET = 'lkjkjoiuoidSFsdgkjDSFLDOR435Dfdg34554435DSFdGfdgdfkljgg45546ERGG650128923';
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'hpapier.matcha@gmail.com',
    pass: 'papierhugo42'
  }
});

const pubSub = new PostgresPubSub({ client });

const verifyUserToken = async token => {
  try {
    if (token.authorization === '')
      return false;
  
    const tokenJwt = token.authorization.split(' ')[1];
    const decoded = JWT.verify(tokenJwt, JWTSECRET);
    const res = await client.query('SELECT * FROM user_info WHERE id = $1 AND username = $2', [decoded.id, decoded.username]);
    if (res.rows[0])
      return true;
    return false;
  } catch (e) {
    return false;
  }
}

const typeDefs = `
  type Status {
    status: Boolean
  }

  type AuthStatus {
    message: String
    token: String
  }

  type MessageStatus {
    message: String
  }

  type Query {
    userStatus: Status
    emailTokenVerification(username: String!, emailToken: String!): MessageStatus
  }

  type Mutation {
    signUpMutation(username: String!, email: String!, lastname: String!, firstname: String!, birthDate: String!, genre: String!, interest: String!, password: String): MessageStatus
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
      if (token)
        return { status: true };

      return { status: false };
    },

    emailTokenVerification: async (parent, { username, emailToken }, ctx) => {
      try {
        const user = await client.query('SELECT * FROM user_info WHERE username = $1', [username]);
        if (user.rowCount === 0)
        return { message: 'User not exist' };
        
        if (user.rows[0].confirmation_token !== emailToken)
        return { message: 'Invalid token' };
        
        if (user.rows[0].isconfirmed)
        return { message: 'Already confirmed' };
        
        const res = await client.query('UPDATE user_info SET isconfirmed = 1 WHERE username = $1', [username]);
        return { message: 'Success' };
      } catch (e) {
        return { message: 'Error server' };
      }
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

        const emailConfirmationToken = randtoken.generate(64);
        const mailOptions = {
          from: '"Hugo de Matcha.com" <hpapier.matcha@gmail.com>',
          to: email,
          subject: `Bienvenu ${firstname}, veuillez confirmer votre email ! :)`,
          html: `<a href="http://localhost:8080/email/${username}/${emailConfirmationToken}">Confirmer votre email en cliquant sur ce lien</a>`
        }
          
        const mailSendingResult = await transporter.sendMail(mailOptions);
        const salt = bcrypt.genSaltSync(10);
        const hashedPwd = bcrypt.hashSync(password, salt);

        const insertion = 'INSERT INTO user_info (email, username, lastname, firstname, password, birth_date, genre, sexual_orientation, creation_date, confirmation_token) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *';
        const creationDate = new Date();
        const result = await client.query(insertion, [email, username, lastname, firstname, hashedPwd, birthDate, genre, interest, creationDate, emailConfirmationToken]);
        return { message: 'Success' };
      } catch (e) {
        const error = new Error(e);
        if (error.message === 'Error: No recipients defined')
          return { message: 'Email error' };
        return { message: 'Error server' };
      }
    },

    userAuth: async (parent, { username, password }, ctx)  => {
      try {
        const res = await client.query('SELECT * FROM user_info WHERE username = $1', [username]);
        if (res.rowCount === 0)
          return { message: 'User not exist', token: '' };

        const pwdComparison = await bcrypt.compare(password, res.rows[0].password);
        if (!pwdComparison)
          return { message: 'Wrong password', token: '' };

        if (!res.rows[0].isconfirmed)
          return { message: 'Account not confirmed', token: '' };

        const jwtToken = JWT.sign({ id: res.rows[0].id, username: res.rows[0].username }, JWTSECRET);
        return { message: 'Success', token: jwtToken };
      } catch (e) {
        console.log(e);
        return { message: 'Server Error', token: '' };
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