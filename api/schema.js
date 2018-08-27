const { makeExecutableSchema } = require('graphql-tools');
const { client } = require('./database.js');
const { PostgresPubSub } = require('graphql-postgres-subscriptions');
const randtoken = require('rand-token');
const JWT = require('jsonwebtoken');
const JWTSECRET = 'lkjkjoiuoidSFsdgkjDSFLDOR435Dfdg34554435DSFdGfdgdfkljgg45546ERGG650128923';
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const publicIp = require('public-ip');
const fetch = require('node-fetch');
var NodeGeocoder = require('node-geocoder');

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
    const res = await client.query('SELECT * FROM user_info WHERE id = $1', [decoded.id]);
    if (res.rows[0])
      return res.rows[0];
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

  type UserImages {
    id: Int
    path: String
  }

  type Interests {
    id: Int
    name: String
  }

  type UserInterests {
    id: Int
    interestId: String
  }

  type UserInformations {
    username: String
    lastname: String
    firstname: String
    email: String
    birthDate: String
    genre: String
    sexualOrientation: String
    bio: String
    popularityScore: Int
    location: String
    creationDate: String
    lastConnexion: String
    interests: [UserInterests]
    images: [UserImages]
    profilPicture: String
  }

  type Notification {
    id: Int
    isViewed: Int
    action: String
    userId: Int
    fromUserId: Int
  }

  type userData {
    data: String
  }

  type Query {
    userStatus: Status
    emailTokenVerification(username: String!, emailToken: String!): MessageStatus
    resetTokenVerification(username: String!, resetToken: String!): MessageStatus
    userInformations: UserInformations
    getInterests: [Interests]
    userNotif: [Notification]
  }
  
  type Mutation {
    signUpMutation(username: String!, email: String!, lastname: String!, firstname: String!, birthDate: String!, genre: String!, interest: String!, password: String): MessageStatus
    userAuth(username: String!, password: String!): AuthStatus
    sendEmailReset(username: String!, email: String!): MessageStatus
    resetPassword(username: String!, resetToken: String!, password: String!): MessageStatus
    forceGeolocation: Boolean
    updateUserLastname(lastname: String!): userData
    updateUserFirstname(firstname: String!): userData
    updateUsername(username: String!): userData
    updateUserBirthDate(birthdate: String!): userData
    updateUserGeolocation(geolocation: String!): userData
    updateUserEmail(email: String!): userData
    updateUserPassword(pPwd: String!, nPwd: String!): userData
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
    },

    resetTokenVerification: async (parent, { username, resetToken }, ctx) => {
      try {
        const user = await client.query('SELECT * FROM user_info WHERE username = $1', [username]);
        if (user.rowCount === 0)
          return { message: 'User not exist' };
        
        if (user.rows[0].reset_token !== resetToken)
          return { message: 'Invalid token' };

        return { message: 'Success' };
      } catch (e) {
        return { message: 'Error server' };
      }
    },

    userInformations: async (parent, args, ctx) => {
      try {
        const user = await verifyUserToken(ctx.headers);
        if (!user)
          return new Error('User not found');
  
        const userImages = await client.query('SELECT * FROM images WHERE user_id = $1', [user.id]);
        const userInterest = await client.query('SELECT * FROM user_interests WHERE user_id = $1', [user.id]);
        const updateConnexion = await client.query('UPDATE user_info SET last_connexion = $1 WHERE id = $2', [new Date(), user.id]);
        return {
          username: user.username,
          lastname: user.lastname,
          firstname: user.firstname,
          email: user.email,
          birthDate: user.birth_date,
          genre: user.genre,
          sexualOrientation: user.sexual_orientation,
          bio: user.bio,
          popularityScore: user.popularity_score,
          location: user.location,
          creationDate: user.creation_date,
          lastConnexion: new Date(),
          interests: userInterest.rows,
          images: userImages.rows,
          profilPicture: user.profil_picture
        };
      } catch (e) {
        return new Error(e.message)
      }
    },
  
    getInterests: async (parent, args, ctx) => {
      try {
        const user = await verifyUserToken(ctx.headers);
        if (!user)
          return new Error('Not authorized');
  
        const interests = await client.query('SELECT * FROM interests');
        return interests.rows;
      } catch (e) {
        return new Error(e.message);
      }
    },

    userNotif: async (parent, args, ctx) => {
      try {
        const user = verifyUserToken(ctx.headers);
        if (!user)
          return new Error(e.message);

        const notif = await client.query('SELECT * FROM notification WHERE user_id = $1', [user.id]);
        if (notif.rowCount === 0)
          return [];
        else {
          const arrayOfNotif = notif.rows.map(item => ({ id: item.id, isViewed: item.is_viewed, action: item.action, userId: item.user_id, fromUserId: item.from }));
          return arrayOfNotif;
        }
      } catch (e) {
        return new Error(e.message);
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

        const jwtToken = JWT.sign({ id: res.rows[0].id }, JWTSECRET);
        return { message: 'Success', token: jwtToken };
      } catch (e) {
        console.log(e);
        return { message: 'Server Error', token: '' };
      }
    },

    sendEmailReset: async (parent, { username, email }, ctx) => {
      try {
        const res = await client.query('SELECT * FROM user_info WHERE username = $1 AND email = $2', [username, email]);
        if (res.rowCount === 0)
          return { message: 'User not exist' };

        if (!res.rows[0].isconfirmed)
          return { message: 'Account not confirmed' };
        
        const resetToken = randtoken.generate(64);
        const mailOptions = {
          from: '"Hugo de Matcha.com" <hpapier.matcha@gmail.com>',
          to: email,
          subject: `${res.rows[0].firstname}, voici votre lien de réinitialisation ! :)`,
          html: `<a href="http://localhost:8080/reset/${username}/${resetToken}">Réinitialiser votre mot de passe en cliquant sur ce lien</a>`
        };
        const mailResult = await transporter.sendMail(mailOptions);
        const user = await client.query('UPDATE user_info SET reset_token = $1 WHERE username = $2', [resetToken, username]);
        return { message: 'Success' };
      } catch (e) {
        console.log(e);
        return { message: 'Server Error' };
      }
    },
    
    resetPassword: async (parent, { username, resetToken, password }, ctx) => {
      try {
        // const lol = () => new Promise((r, f) => {
        //   setTimeout(() => r(), 5000);
        // })

        // const ll = await lol();
        console.log(password);
        const res = await client.query('SELECT * FROM user_info WHERE username = $1', [username]);
        if (res.rowCount === 0)
          return { message: 'User not exist' };

        if (res.rows[0].reset_token !== resetToken)
          return { message: 'Invalid token' };

        const salt = bcrypt.genSaltSync(10);
        const pwd = bcrypt.hashSync(password, salt);
        const user = await client.query('UPDATE user_info SET (reset_token, password) = ($1, $2) WHERE username = $3', [null, pwd, username]);
        console.log(user);
        return { message: 'Success' };
      } catch (e) {
        console.log(e);
        return { message: 'Server error' };
      }
    },

    forceGeolocation: async (parent, args, ctx) => {
      try {
        const user = await verifyUserToken(ctx.headers);
        if (!user)
          return new Error('User not found');

        const publicIpAdress = await publicIp.v4();
        const access_key = 'e0f43f3da5051d101a0ba8d112b9871c';
        const getLocation = await fetch('http://api.ipstack.com/' + publicIpAdress + '?access_key=' + access_key);

        const location = await getLocation.json();
        const locationJson = JSON.stringify({ lat: location.latitude, lng: location.longitude, formatedName: `${location.country_name}, ${location.city}, ${location.zip}` });
        const mutationClient = await client.query('UPDATE user_info SET location = $1 WHERE id = $2', [locationJson, user.id]);
        return true;
      } catch (e) {
        console.log(e);
        return new Error(e.message);
      }
    },

    updateUserLastname: async (parent, args, ctx) => {
      try {
        const user = await verifyUserToken(ctx.headers);
        if (!user)
          return new Error('Not auth');

        const response = await client.query('UPDATE user_info SET lastname = $1 WHERE id = $2', [args.lastname, user.id]);
        const refetchUser = await client.query('SELECT lastname FROM user_info WHERE id = $1', [user.id]);
        return { data: refetchUser.rows[0].lastname };
      } catch(e) {
        return new Error(e.message);
      }
    },

    updateUserFirstname: async (parent, args, ctx) => {
      try {
        const user = await verifyUserToken(ctx.headers);
        if (!user)
          return new Error('Not auth');

        const response = await client.query('UPDATE user_info SET firstname = $1 WHERE id = $2', [args.firstname, user.id]);
        const refetchUser = await client.query('SELECT firstname FROM user_info WHERE id = $1', [user.id]);
        return { data: refetchUser.rows[0].firstname };
      } catch(e) {
        return new Error(e.message);
      }
    },

    updateUsername: async (parent, args, ctx) => {
      try {
        const user = await verifyUserToken(ctx.headers);
        if (!user)
          return new Error('Not auth');

        const search = await client.query('SELECT * FROM user_info WHERE username = $1', [args.username]);
        if (search.rowCount > 0)
          return new Error('Already exist.');

        const response = await client.query('UPDATE user_info SET username = $1 WHERE id = $2', [args.username, user.id]);
        const refetchUser = await client.query('SELECT username FROM user_info WHERE id = $1', [user.id]);
        return { data: refetchUser.rows[0].username };
      } catch(e) {
        return new Error(e.message);
      }
    },

    updateUserBirthDate: async (parent, args, ctx) => {
      try {
        const user = await verifyUserToken(ctx.headers);
        if (!user)
          return new Error('Not auth');

        const response = await client.query('UPDATE user_info SET birth_date = $1 WHERE id = $2', [args.birthdate, user.id]);
        const refetchUser = await client.query('SELECT birth_date FROM user_info WHERE id = $1', [user.id]);
        return { data: refetchUser.rows[0].birth_date };
      } catch(e) {
        return new Error(e.message);
      }
    },

    updateUserGeolocation: async (parent, { geolocation }, ctx) => {
      try {
        const user = await verifyUserToken(ctx.headers);
        if (!user)
          return new Error('Not auth');

        const options = {
          provider: 'google',
          // Optional depending on the providers
          httpAdapter: 'https', // Default
          // apiKey: 'e0f43f3da5051d101a0ba8d112b9871c', // for Mapquest, OpenCage, Google Premier 'AIzaSyCr9V09uABdbvkvNhlynD-IY9KsnpkKir4'
          // apiKey: 'SnyCDRVbW_KCGkXb1vrQ'
          formatter: null,         // 'gpx', 'string', ...
        };
        const geocoder = NodeGeocoder(options);

        const coords = JSON.parse(geolocation);
        const res = await geocoder.reverse({ lat: coords.lat, lon: coords.lng });
        const address = res[0].formattedAddress;
        const newAdd = JSON.stringify({ lat: coords.lat, lng: coords.lng, formatedName: address });
        const result = await client.query('UPDATE user_info SET location = $1 WHERE id = $2', [newAdd, user.id]);
        return { data: newAdd };
      } catch (e) {
        return e;
      }
    },

    updateUserEmail: async (parent, { email }, ctx) => {
      try {
        const user = await verifyUserToken(ctx.headers);
        if (!user)
          return new Error('Not auth');

        const search = await client.query('SELECT * FROM user_info WHERE email = $1', [email]);
        if (search.rowCount > 0)
          return new Error('Already exist.');

        const response = await client.query('UPDATE user_info SET email = $1 WHERE id = $2', [email, user.id]);
        const refetchUser = await client.query('SELECT email FROM user_info WHERE id = $1', [user.id]);
        return { data: refetchUser.rows[0].email };
      } catch(e) {
        return new Error(e.message);
      }
    },

    updateUserPassword: async (parent, { pPwd, nPwd }, ctx) => {
      try {
        const user = await verifyUserToken(ctx.headers);
        if (!user)
          return new Error('Not auth');

        if (!bcrypt.compareSync(pPwd, user.password))
          return new Error('Invalid pwd');

        const salt = bcrypt.genSaltSync(10);
        const pwd = bcrypt.hashSync(nPwd, salt);
        const res = await client.query('UPDATE user_info SET password = $1 WHERE id = $2', [pwd, user.id]);
        return { data: 'Success' };
      } catch (e) {
        return e;
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