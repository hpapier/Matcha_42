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
const fs = require('fs');
const path = require('path');
var NodeGeocoder = require('node-geocoder');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'hpapier.matcha@gmail.com',
    pass: 'papierhugo42'
  }
});

const pubSub = new PostgresPubSub({ client });

const getAge = date => {
  var today = new Date();
  var birthDate = new Date(date);
  var age = today.getFullYear() - birthDate.getFullYear();
  var m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
  }
  return age;
};

const getDistance = (lat1, lon1, lat2, lon2, unit) => {
  var radlat1 = Math.PI * lat1/180;
  var radlat2 = Math.PI * lat2/180;
  var radlon1 = Math.PI * lon1/180;
  var radlon2 = Math.PI * lon2/180;
  var theta = lon1-lon2;
  var radtheta = Math.PI * theta/180;
  var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
  dist = Math.acos(dist);
  dist = dist * 180/Math.PI;
  dist = dist * 60 * 1.1515;
  if (unit === "K") { dist = dist * 1.609344 };
  if (unit === "N") { dist = dist * 0.8684 };
  return dist;
};

const verifyUserToken = async token => {
  try {
    if (token.authorization === '')
      return false;
  
    const tokenJwt = token.authorization.split(' ')[1];
    if (token.authorization.split(' ')[0] !== 'Bearer')
      return false;

    const decoded = JWT.verify(tokenJwt, JWTSECRET);
    const res = await client.query('SELECT * FROM user_info WHERE id = $1', [decoded.id]);
    if (res.rowCount === 0)
      return false;

    return res.rows[0];
  } catch (e) {
    return false;
  }
};

const updateStatus = async (userId) => {
  try {
    const user = await client.query('SELECT * FROM user_info WHERE id = $1', [userId]);
    const img = await client.query('SELECT * FROM images WHERE user_id = $1', [userId]);
    const userInterest = await client.query('SELECT * FROM user_interests WHERE user_id = $1', [userId]);

    const { bio, profil_picture, location } = user.rows[0];
    if (img.rowCount === 0 || userInterest.rowCount === 0 || !bio || !location || !profil_picture)
      await client.query('UPDATE user_info SET iscomplete = $1 WHERE id = $2', [0, userId]);
    else
      await client.query('UPDATE user_info SET iscomplete = $1 WHERE id = $2', [1, userId]);
    
    return true;
  } catch (e) {
    return e;
  }
};

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
    interestId: Int
  }

  type Tags {
    userTags: [UserInterests],
    interests: [Interests]
  }

  type ProfilImg {
    path: String
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
    isComplete: Int
  }

  type UserPreferences {
    ageStart: Int
    ageEnd: Int
    scoreStart: Int
    scoreEnd: Int
    location: Int
    tags: String
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

  type UserSimpleList {
    id: Int
    location: String
    popularityScore: Int
    username: String
    age: Int
    tags: [UserInterests]
    profilPicture: String
    distance: Int
  }

  type UserActions {
    id: Int
    action: String
  }

  type UserProfilInfo {
    id: Int
    images: [UserImages]
    actions: [String]
    lastConnexion: String
    isConnected: Boolean
    username: String
    firstname: String
    lastname: String
    age: Int
    location: String
    popularityScore: Int
    bio: String
    genre: String
    sexualOrientation: String
    tags: [UserInterests]
    isMatched: Boolean
    isBlocked: Boolean
    isLiked: Boolean
  }

  type VisitorList {
    id: Int
    popularityScore: Int
    username: String
    age: Int
    distance: Int
    profilPicture: String
    isLiked: Boolean
  }

  type UserNotification {
    id: Int
    fromUserId: Int
    fromUserName: String
    fromUserProfilPicture: String
    fromUserGenre: String
    action: String
    date: String
  }

  type NotifCount {
    count: Int
  }

  type LikeType {
    isMatched: Boolean
  }

  type UserHistory {
    likeNumber: Int
    visiteNumber: Int
    matchNumber: Int
  }

  type UserLikeVisiteMatchInfo {
    id: Int
    popularityScore: Int
    username: String
    age: Int
    distance: Int
    profilPicture: String
    isLiked: Boolean,
    tags: [UserInterests]
  }

  type Query {
    userStatus: Status
    emailTokenVerification(username: String!, emailToken: String!): MessageStatus
    resetTokenVerification(username: String!, resetToken: String!): MessageStatus
    userInformations: UserInformations
    userInformationsBox: UserInformations
    getInterests: [Interests]
    userHistory: UserHistory
    getUserPreference: UserPreferences
    getListOfUser: [UserSimpleList]
    getUserProfilInformation(userId: Int!): UserProfilInfo
    getVisitorList: [VisitorList]
    getUserNotification: [UserNotification]
    getCountNotification: NotifCount
    getUserLike: [UserLikeVisiteMatchInfo]
    getUserVisite: [UserLikeVisiteMatchInfo]
    getUserMatch: [UserLikeVisiteMatchInfo]
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
    updateUserGenre(genre: String!): userData
    updateUserSO(sexualOrientation: String!): userData
    updateUserBio(bio: String!): userData
    addTagToUser(tag: String!): Tags
    removeTagToUser(tag: Int!): [UserInterests]
    addUserImage(img: String!, type: String!): [UserImages]
    removeUserImage(imgId: Int!, name: String!): [UserImages]
    updateProfilImg(imgId: Int!, name: String!, imgPath: String!): ProfilImg
    updateUserPreferences(ageStart: Int!, ageEnd: Int!, scoreStart: Int!, scoreEnd: Int!, location: Int!, tags: String!): UserPreferences
    likeUser(userId: Int!): LikeType
    unlikeUser(userId: Int!): LikeType
    blockUser(userId: Int!): Boolean
    unblockUser(userId: Int!): Boolean
    reportUser(userId: Int!): Boolean
  }

  type Subscription {
    notificationSub(token: String): NotifCount
  }
`;


// type Subscription {
//   postAdded: Post
    // notificationSub
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
        //  const lol = () => new Promise((r, f) => {
        //    setTimeout(() => r(), 5000);
        //  });

        //  const ll = await lol();
        const user = await verifyUserToken(ctx.headers);
        if (!user)
          return new Error('User not found');
  
        const userImages = await client.query('SELECT * FROM images WHERE user_id = $1', [user.id]);
        const userInterest = await client.query('SELECT * FROM user_interests WHERE user_id = $1', [user.id]);
        await client.query('UPDATE user_info SET last_connexion = $1 WHERE id = $2', [new Date(), user.id]);
        const convertedInterests = userInterest.rows.map(item => ({ id: item.id, interestId: item.interest_id }));
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
          interests: convertedInterests,
          images: userImages.rows,
          profilPicture: user.profil_picture,
          isComplete: user.iscomplete
        };
      } catch (e) {
        return new Error(e.message)
      }
    },

    userInformationsBox: async (parent, args, ctx) => {
      try {
        //  const lol = () => new Promise((r, f) => {
        //    setTimeout(() => r(), 5000);
        //  });

        //  const ll = await lol();
        const user = await verifyUserToken(ctx.headers);
        if (!user)
          return new Error('User not found');
  
        const userImages = await client.query('SELECT * FROM images WHERE user_id = $1', [user.id]);
        const userInterest = await client.query('SELECT * FROM user_interests WHERE user_id = $1', [user.id]);
        await client.query('UPDATE user_info SET last_connexion = $1 WHERE id = $2', [new Date(), user.id]);
        const convertedInterests = userInterest.rows.map(item => ({ id: item.id, interestId: item.interest_id }));
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
          interests: convertedInterests,
          images: userImages.rows,
          profilPicture: user.profil_picture,
          isComplete: user.iscomplete
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

    // userNotif: async (parent, args, ctx) => {
    //   try {
    //     const user = await verifyUserToken(ctx.headers);
    //     if (!user)
    //       return new Error('Not auth');

    //     const notif = await client.query('SELECT * FROM notification WHERE user_id = $1', [user.id]);
    //     if (notif.rowCount === 0)
    //       return [];
    //     else {
    //       const arrayOfNotif = notif.rows.map(item => ({ id: item.id, isViewed: item.is_viewed, action: item.action, userId: item.user_id, fromUserId: item.from }));
    //       return arrayOfNotif;
    //     }
    //   } catch (e) {
    //     return new Error(e.message);
    //   }
    // },

    getUserPreference: async (parent, args, ctx) => {
      try {
        const user = await verifyUserToken(ctx.headers);
        if (!user)
          return new Error('Not auth');
  
        const resPref = await client.query('SELECT * FROM user_pref WHERE user_id = $1', [user.id]);
        if (resPref.rowCount === 0)
          return { ageStart: 18, ageEnd: 100, scoreStart: 10, scoreEnd: 100, location: 10, tags: null };

        return {
          ageStart: resPref.rows[0].age_start,
          ageEnd: resPref.rows[0].age_end,
          scoreStart: resPref.rows[0].score_start,
          scoreEnd: resPref.rows[0].score_end,
          location: resPref.rows[0].location,
          tags: resPref.rows[0].tags
        };
      } catch (e) {
        return e;
      }
    },

    getListOfUser: async (parent, args, ctx) => {
      try {
        const user = await verifyUserToken(ctx.headers);
        if (!user)
          return new Error('Not auth');

        let res;
        if (user.sexual_orientation === 'bisexual')
          res = await client.query('SELECT * FROM user_info WHERE iscomplete = $1 AND id != $2', [1, user.id]);
        else
          res = await client.query('SELECT * FROM user_info WHERE iscomplete = $1 AND genre = $2 AND id != $3', [1, user.sexual_orientation, user.id]);

        const userLat = JSON.parse(user.location).lat;
        const userLng = JSON.parse(user.location).lng;
        
        let trimedByDistanceList = [];
        for (let item of res.rows) {
          if (getDistance(userLat, userLng, JSON.parse(item.location).lat, JSON.parse(item.location).lng, 'K') < 200)
            trimedByDistanceList.push(item);
        }

        let result = [];
        for (let item of trimedByDistanceList) {
          const checkIfBlocked = await client.query('SELECT * FROM account_blocked WHERE (from_user_id, to_user_id) = ($1, $2) OR (from_user_id, to_user_id) = ($2, $1)', [item.id, user.id]);
          if (checkIfBlocked.rowCount === 0) {
            const checkIfLiked = await client.query('SELECT * FROM user_like WHERE (from_user, to_user) = ($1, $2)', [user.id, item.id]);
            if (checkIfLiked.rowCount === 0) {
              const getUserTags = await client.query('SELECT * FROM user_interests WHERE user_id = $1', [item.id]);
              const formatedTagsList = getUserTags.rows.map(tag => ({ id: tag.id, interestId: tag.interest_id }));
              result.push({
                id: item.id,
                location: item.location,
                popularityScore: item.popularity_score,
                username: item.username,
                age: getAge(item.birth_date),
                tags: formatedTagsList,
                profilPicture: item.profil_picture,
                distance: parseInt(getDistance(userLat, userLng, JSON.parse(item.location).lat, JSON.parse(item.location).lng, 'K'))
              });
            }
          }
        };

        return result;
      } catch(e) {
        return e;
      }
    },

    getUserProfilInformation: async (parent, { userId }, ctx) => {
      try {
        const user = await verifyUserToken(ctx.headers);
        if (!user)
          return new Error('Not auth');

        const profil = await client.query('SELECT * FROM user_info WHERE id = $1', [userId]);
        if (profil.rowCount === 0)
          return new Error('Profil doesn\'t exist');

        const profilAge = getAge(profil.rows[0].birth_date);
        const profilImg = await client.query('SELECT id, path FROM images WHERE user_id = $1', [userId]);
        if (profilImg.rowCount === 0)
          return new Error('Profil doesn\'t have image');

        const profilBlock = await client.query('SELECT * FROM account_blocked WHERE from_user_id = $1 AND to_user_id = $2', [userId, user.id]);
        if (profilBlock.rowCount > 0)
          return new Error('Profil blocked');

        const visiteAlreadyExist = await client.query('SELECT * FROM user_visite WHERE (from_user, to_user) = ($1, $2)', [user.id, userId]);
        if (visiteAlreadyExist.rowCount === 0)
          await client.query('INSERT INTO user_visite (from_user, to_user, creation_date) VALUES ($1, $2, $3)', [user.id, userId, new Date()]);
        else
          await client.query('UPDATE user_visite SET creation_date = $1 WHERE from_user = $2 AND to_user = $3', [new Date(), user.id, userId]);
        
        if (profilBlock.rowCount === 0)
          await client.query('INSERT INTO notification (action, user_id, from_user, creation_date) VALUES ($1, $2, $3, $4)', ['visite', userId, user.id, new Date()]);
        
        pubSub.publish('notificationCount');
        
        let actionsArray = [];

        const getVisiteAction = await client.query('SELECT * FROM user_visite WHERE (from_user, to_user) = ($1, $2)', [userId, user.id]);
        const getLikeAction = await client.query('SELECT * FROM user_like WHERE (from_user, to_user) = ($1, $2)', [userId, user.id]);
        getVisiteAction.rowCount > 0 ? actionsArray.push('visite') : null
        getLikeAction.rowCount > 0 ? actionsArray.push('like') : null

        const profilTags = await client.query('SELECT * FROM user_interests WHERE user_id = $1', [userId]);
        if (profilTags.rowCount === 0)
          return new Error('Profil not complete');

        const profilMatch = await client.query('SELECT * FROM match WHERE (from_user, to_user) = ($1, $2) OR (from_user, to_user) = ($2, $1)', [user.id, userId]);
        const isBlocked = await client.query('SELECT * FROM account_blocked WHERE (from_user_id, to_user_id) = ($1, $2)', [user.id, userId]);
        const isLiked = await client.query('SELECT * FROM user_like WHERE (from_user, to_user) = ($1, $2)', [user.id, userId]);

        return {
          id: profil.rows[0].id,
          images: profilImg.rows,
          actions: actionsArray,
          lastConnexion: profil.rows[0].last_connexion,
          isConnected: profil.rows[0].isconnected,
          username: profil.rows[0].username,
          firstname: profil.rows[0].firstname,
          lastname: profil.rows[0].lastname,
          age: profilAge,
          location: profil.rows[0].location,
          popularityScore: profil.rows[0].popularity_score,
          bio: profil.rows[0].bio,
          genre: profil.rows[0].genre,
          sexualOrientation: profil.rows[0].sexual_orientation,
          tags: profilTags.rows.map(item => ({ id: item.id, interestId: item.interest_id })),
          isMatched: profilMatch.rowCount === 0 ? false : true,
          isBlocked: isBlocked.rowCount === 0 ? false : true,
          isLiked: isLiked.rowCount === 0 ? false : true
        };
        
      } catch(e) {
        console.log(e);
        return e;
      }
    },

    getVisitorList: async (_, args, ctx) => {
      try {
        const user = await verifyUserToken(ctx.headers);
        if (!user)
          return new Error('Not auth');

        const visiteList = await client.query('SELECT * FROM user_visite WHERE to_user = $1', [user.id]);
        if (visiteList.rowCount === 0)
          return [];

        let userList = null;
        if (user.sexual_orientation === 'man' || user.sexual_orientation === 'woman')
          userList = await client.query('SELECT * FROM user_info WHERE genre = $1 AND iscomplete = $2', [user.sexual_orientation, 1]);
        else if (user.sexual_orientation === 'bisexual')
          userList = await client.query('SELECT * FROM user_info WHERE iscomplete = $1', [1]);

        let trimedVisitor = [];
        for (let visitor of userList.rows) {
          let isVisitor = false;
          visiteList.rows.forEach(item => {
            if (parseInt(item.from_user) ===  visitor.id)
              isVisitor = true;
          });

          if (isVisitor) {
            const isBlocked = await client.query('SELECT * FROM account_blocked WHERE (from_user_id, to_user_id) = ($1, $2)', [visitor.id, user.id]);
            if (isBlocked.rowCount === 0) {
              const isLikedVisitor = await client.query('SELECT * FROM user_like WHERE from_user = $1 AND to_user = $2', [user.id, visitor.id]);
              const visitorLat = JSON.parse(visitor.location).lat;
              const visitorLng = JSON.parse(visitor.location).lng;
              const userLat = JSON.parse(user.location).lat;
              const userLng = JSON.parse(user.location).lng;
              const dist = getDistance(userLat, userLng, visitorLat, visitorLng, 'K');
              trimedVisitor.push({
                id: visitor.id,
                popularityScore: visitor.popularity_score,
                username: visitor.username,
                age: getAge(visitor.birth_date),
                distance: parseInt(dist),
                profilPicture: visitor.profil_picture,
                isLiked: isLikedVisitor.rowCount === 0 ? false : true
              });
            }
          }
        }

        return trimedVisitor;
      } catch (e) {
        return e;
      }
    },

    getUserNotification: async (_, args, ctx) => {
      try {
        const user = await verifyUserToken(ctx.headers);
        if (!user)
          return new Error('Not auth');

        const notif = await client.query('SELECT * FROM notification WHERE user_id = $1', [user.id]);
        let notifArray = [];

        for (let item of notif.rows) {
          const userInfo = await client.query('SELECT id, username, profil_picture, genre FROM user_info WHERE id = $1 AND iscomplete = $2', [item.from_user, 1]);
          if (userInfo.rowCount === 1) {
            if (item.is_viewed === 0)
              await client.query('UPDATE notification SET is_viewed = $1 WHERE id = $2', [1, item.id]);
            notifArray.push({
              id: item.id,
              fromUserId: userInfo.rows[0].id,
              fromUserName: userInfo.rows[0].username,
              fromUserProfilPicture: userInfo.rows[0].profil_picture,
              fromUserGenre: userInfo.rows[0].genre,
              action: item.action,
              date: item.creation_date
            });
          }
        }

        notifArray.sort((a, b) => b.date - a.date);
        pubSub.publish('notificationCount');

        return notifArray;
      } catch (e) {
        return e;
      }
    },

    getCountNotification: async (_, args, ctx) => {
      try {
        const user = await verifyUserToken(ctx.headers);
        if (!user)
          return new Error('Not auth');

        const notifs = await client.query('SELECT * FROM notification WHERE user_id = $1 AND is_viewed = $2', [user.id, 0]);
        return { count: notifs.rowCount };
      } catch (e) {
        return e;
      }
    },

    userHistory: async (_, args, ctx) => {
      try {
        const user = await verifyUserToken(ctx.headers);
        if (!user)
          return new Error('Not auth');

        const like = await client.query('SELECT COUNT(*) FROM user_like WHERE from_user = $1', [user.id]);
        const visite = await client.query('SELECT COUNT(*) FROM user_visite WHERE from_user = $1', [user.id]);
        const match = await client.query('SELECT COUNT(*) FROM match WHERE from_user = $1 OR to_user = $1', [user.id]);
        return { likeNumber: like.rows[0].count, visiteNumber: visite.rows[0].count, matchNumber: match.rows[0].count };
      } catch (e) {
        console.log(e);
        return e;
      }
    },

    getUserLike: async (_, args, ctx) => {
      try {
        const user = await verifyUserToken(ctx.headers);
        if (!user)
          return new Error('Not auth');

        const likeList = await client.query('SELECT * FROM user_like WHERE from_user = $1', [user.id]);
        if (likeList.rowCount === 0)
          return [];

        let result = [];
        for (let like of likeList.rows) {
          const isBlocked = await client.query('SELECT * FROM account_blocked WHERE to_user_id = $1 AND from_user_id = $2', [user.id, like.to_user]);
          if (isBlocked.rowCount === 0) {
            const userInfo = await client.query('SELECT * FROM user_info WHERE id = $1 AND iscomplete = $2', [like.to_user, 1]);
            const tags = await client.query('SELECT * FROM user_interests WHERE user_id = $1', [userInfo.rows[0].id]);
            if (userInfo.rowCount === 1) {
              result.push({
                id: userInfo.rows[0].id,
                popularityScore: userInfo.rows[0].popularity_score,
                username: userInfo.rows[0].username,
                age: getAge(userInfo.rows[0].birth_date),
                distance: parseInt(getDistance(JSON.parse(user.location).lat, JSON.parse(user.location).lng, JSON.parse(userInfo.rows[0].location).lat, JSON.parse(userInfo.rows[0].location).lng, 'K')),
                profilPicture: userInfo.rows[0].profil_picture,
                isLiked: true,
                tags: tags.rows.map(item => ({ id: item.id, interestId: item.interest_id }))
              });
            }
          }
        }
        
        return result;
      } catch (e) {
        console.log(e);
        return e;
      }
    },

    getUserVisite: async (_, args, ctx) => {
      try {
        const user = await verifyUserToken(ctx.headers);
        if (!user)
          return new Error('Not auth');

        const visiteList = await client.query('SELECT * FROM user_visite WHERE from_user = $1', [user.id]);
        if (visiteList.rowCount === 0)
          return [];

        let result = [];
        for (let like of visiteList.rows) {
          const isBlocked = await client.query('SELECT * FROM account_blocked WHERE to_user_id = $1 AND from_user_id = $2', [user.id, like.to_user]);
          if (isBlocked.rowCount === 0) {
            const userInfo = await client.query('SELECT * FROM user_info WHERE id = $1 AND iscomplete = $2', [like.to_user, 1]);
            if (userInfo.rowCount === 1) {
              const userIsLiked = await client.query('SELECT * FROM user_like WHERE from_user = $1 AND to_user = $2', [user.id, userInfo.rows[0].id]);
              const tags = await client.query('SELECT * FROM user_interests WHERE user_id = $1', [userInfo.rows[0].id]);
              result.push({
                id: userInfo.rows[0].id,
                popularityScore: userInfo.rows[0].popularity_score,
                username: userInfo.rows[0].username,
                age: getAge(userInfo.rows[0].birth_date),
                distance: parseInt(getDistance(JSON.parse(user.location).lat, JSON.parse(user.location).lng, JSON.parse(userInfo.rows[0].location).lat, JSON.parse(userInfo.rows[0].location).lng, 'K')),
                profilPicture: userInfo.rows[0].profil_picture,
                isLiked: userIsLiked.rowCount === 0 ? false : true,
                tags: tags.rows.map(item => ({ id: item.id, interestId: item.interest_id }))
              });
            }
          }
        }
        
        return result;
      } catch (e) {
        console.log(e);
        return e;
      }
    },

    getUserMatch: async (_, args, ctx) => {
      try {
        const user = await verifyUserToken(ctx.headers);
        if (!user)
          return new Error('Not auth');

        const matchList = await client.query('SELECT * FROM match WHERE from_user = $1 OR to_user = $1', [user.id]);
        if (matchList.rowCount === 0)
          return [];

        let result = [];
        for (let match of matchList.rows) {
          let matchId = match.from_user;
          if (parseInt(match.from_user) === parseInt(user.id))
            matchId = match.to_user;

          const isBlocked = await client.query('SELECT * FROM account_blocked WHERE to_user_id = $1 AND from_user_id = $2', [user.id, matchId]);
          if (isBlocked.rowCount === 0) {
            const userInfo = await client.query('SELECT * FROM user_info WHERE id = $1 AND iscomplete = $2', [matchId, 1]);
            if (userInfo.rowCount === 1) {
              const userIsLiked = await client.query('SELECT * FROM user_like WHERE from_user = $1 AND to_user = $2', [user.id, userInfo.rows[0].id]);
              const tags = await client.query('SELECT * FROM user_interests WHERE user_id = $1', [userInfo.rows[0].id]);
              result.push({
                id: userInfo.rows[0].id,
                popularityScore: userInfo.rows[0].popularity_score,
                username: userInfo.rows[0].username,
                age: getAge(userInfo.rows[0].birth_date),
                distance: parseInt(getDistance(JSON.parse(user.location).lat, JSON.parse(user.location).lng, JSON.parse(userInfo.rows[0].location).lat, JSON.parse(userInfo.rows[0].location).lng, 'K')),
                profilPicture: userInfo.rows[0].profil_picture,
                isLiked: userIsLiked.rowCount === 0 ? false : true,
                tags: tags.rows.map(item => ({ id: item.id, interestId: item.interest_id }))
              });
            }
          }
        }
        
        return result;
      } catch (e) {
        console.log(e);
        return e;
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
        await client.query('UPDATE user_info SET location = $1 WHERE id = $2', [locationJson, user.id]);
        return true;
      } catch (e) {
        console.log(e);
        return new Error(e.message);
      }
    },

    updateUserLastname: async (parent, { lastname }, ctx) => {
      try {
        // const lol = () => new Promise((r, f) => {
        //   setTimeout(() => r(), 5000);
        // });

        // const ll = await lol();
        // return new Error('Not auth');
        const user = await verifyUserToken(ctx.headers);
        if (!user)
          return new Error('Not auth');

        const regexp = /('|<|;|>|\/|\(|\)|\.|&|"|§|!|\$|\^|\+|\\|\-|,|\?|=|\*|£|%|°|¨|\`|:|#|\||›|\/|‚|™)/;
        if (lastname.match(regexp))
          return new Error('Contains invalid char');

        if (lastname.length > 255)
          return new Error('Character string too long');

        await client.query('UPDATE user_info SET lastname = $1 WHERE id = $2', [lastname, user.id]);
        const refetchUser = await client.query('SELECT lastname FROM user_info WHERE id = $1', [user.id]);
        return { data: refetchUser.rows[0].lastname };
      } catch(e) {
        return new Error(e.message);
      }
    },

    updateUserFirstname: async (parent, { firstname }, ctx) => {
      try {
        const user = await verifyUserToken(ctx.headers);
        if (!user)
          return new Error('Not auth');

        const regexp = /('|<|;|>|\/|\(|\)|\.|&|"|§|!|\$|\^|\+|\\|\-|,|\?|=|\*|£|%|°|¨|\`|:|#|\||›|\/|‚|™)/;
        if (firstname.match(regexp))
          return new Error('Contains invalid char');

        if (firstname.length > 255)
          return new Error('Character string too long');

        await client.query('UPDATE user_info SET firstname = $1 WHERE id = $2', [firstname, user.id]);
        const refetchUser = await client.query('SELECT firstname FROM user_info WHERE id = $1', [user.id]);
        return { data: refetchUser.rows[0].firstname };
      } catch(e) {
        return new Error(e.message);
      }
    },

    updateUsername: async (parent, { username }, ctx) => {
      try {
        // const lol = () => new Promise((r, f) => {
        //   setTimeout(() => r(), 5000);
        // });

        // const ll = await lol();
        // return new Error('Not auth');
        const user = await verifyUserToken(ctx.headers);
        if (!user)
          return new Error('Not auth');

        const regexp = /('|<|;|>|\/|\(|\)|\.|&|"|§|!|\$|\^|\+|\\|\-|,|\?|=|\*|£|%|°|¨|\`|:|#|\||›|\/|‚|™)/;
        if (username.match(regexp))
          return new Error('Contains invalid char');

        if (username.length > 255)
          return new Error('Character string too long');

        const search = await client.query('SELECT * FROM user_info WHERE username = $1', [username]);
        if (search.rowCount > 0)
          return new Error('Already exist');

        await client.query('UPDATE user_info SET username = $1 WHERE id = $2', [username, user.id]);
        const refetchUser = await client.query('SELECT username FROM user_info WHERE id = $1', [user.id]);
        return { data: refetchUser.rows[0].username };
      } catch(e) {
        return new Error(e.message);
      }
    },

    updateUserBirthDate: async (parent, { birthdate }, ctx) => {
      try {
        const user = await verifyUserToken(ctx.headers);
        if (!user)
          return new Error('Not auth');

        const verifyDate = new Date(birthdate);
        if (verifyDate === 'Invalid date')
          return new Error('Invalid date');

        await client.query('UPDATE user_info SET birth_date = $1 WHERE id = $2', [verifyDate, user.id]);
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
        await client.query('UPDATE user_info SET location = $1 WHERE id = $2', [newAdd, user.id]);
        await updateStatus(user.id);
        return { data: newAdd };
      } catch (e) {
        return e;
      }
    },

    updateUserEmail: async (parent, { email }, ctx) => {
      try {
        // const lol = () => new Promise((r, f) => {
        //   setTimeout(() => r(), 5000);
        // });

        // const ll = await lol();
        //  return new Error('Not auth');
        // // ///----
        const user = await verifyUserToken(ctx.headers);
        if (!user)
          return new Error('Not auth');
        
        const regexp = /^([a-zA-Z0-9._-]+)@([a-zA-Z]+)\.([a-zA-Z]+)$/;
        if (!email.match(regexp))
          return new Error('Invalid email');

        if (email.length > 255)
          return new Error('Character string too long');

        const search = await client.query('SELECT * FROM user_info WHERE email = $1', [email]);
        if (search.rowCount > 0)
          return new Error('Already exist');

        await client.query('UPDATE user_info SET email = $1 WHERE id = $2', [email, user.id]);
        const refetchUser = await client.query('SELECT email FROM user_info WHERE id = $1', [user.id]);
        return { data: refetchUser.rows[0].email };
      } catch(e) {
        return new Error(e.message);
      }
    },

    updateUserPassword: async (parent, { pPwd, nPwd }, ctx) => {
      try {
        // const lol = () => new Promise((r, f) => {
        //   setTimeout(() => r(), 5000);
        // });

        // const ll = await lol();
        // //  return new Error('Not auth');
        // // ///----
        const user = await verifyUserToken(ctx.headers);
        if (!user)
          return new Error('Not auth');

        const regexp = /('|<|;|>|\/|\(|\)|\.|&|"|§|!|\$|\^|\+|\\|\-|,|\?|=|\*|£|%|°|¨|\`|:|#|\||›|\/|‚|™)/;
        if (pPwd.match(regexp) || nPwd.match(regexp))
          return new Error('Contains invalid char');

        if (pPwd.length > 255 || nPwd.length > 255)
          return new Error('Character string too long');

        if (!bcrypt.compareSync(pPwd, user.password))
          return new Error('Invalid pwd');

        const salt = bcrypt.genSaltSync(10);
        const pwd = bcrypt.hashSync(nPwd, salt);
        await client.query('UPDATE user_info SET password = $1 WHERE id = $2', [pwd, user.id]);
        return { data: 'Success' };
      } catch (e) {
        return e;
      }
    },

    updateUserGenre: async (parent, { genre }, ctx) => {
      try {
        const user = await verifyUserToken(ctx.headers);
        if (!user)
          return new Error('Not auth');

        if (genre !== 'man' && genre !== 'woman')
          return new Error('Not a good choice');

        await client.query('UPDATE user_info SET genre = $1 WHERE id = $2', [genre, user.id]);
        const refetchUser = await client.query('SELECT genre FROM user_info WHERE id = $1', [user.id]);
        return { data: refetchUser.rows[0].genre };
      } catch(e) {
        return new Error(e.message);
      }
    },

    updateUserSO: async (parent, { sexualOrientation }, ctx) => {
      try {
        const user = await verifyUserToken(ctx.headers);
        if (!user)
          return new Error('Not auth');

        if (sexualOrientation !== 'man' && sexualOrientation !== 'woman' && sexualOrientation !== 'bisexual')
          return new Error('Not a good choice');

        await client.query('UPDATE user_info SET sexual_orientation = $1 WHERE id = $2', [sexualOrientation, user.id]);
        const refetchUser = await client.query('SELECT sexual_orientation FROM user_info WHERE id = $1', [user.id]);
        return { data: refetchUser.rows[0].sexual_orientation };
      } catch(e) {
        return new Error(e.message);
      }
    },

    updateUserBio: async (parent, { bio }, ctx) => {
      try {
        const user = await verifyUserToken(ctx.headers);
        if (!user)
          return new Error('Not auth');

        if (bio.length > 255)
          return new Error('Character string too long');

        await client.query('UPDATE user_info SET bio = $1 WHERE id = $2', [bio, user.id]);
        const refetchUser = await client.query('SELECT bio FROM user_info WHERE id = $1', [user.id]);
        await updateStatus(user.id);
        return { data: refetchUser.rows[0].bio };
      } catch(e) {
        return new Error(e.message);
      }
    },

    addTagToUser: async (parent, { tag }, ctx) => {
      try {
        const user = await verifyUserToken(ctx.headers);
        if (!user)
          return new Error('Not auth');
        
        const regexp = /('|<|;|>|\/|\(|\)|\.|&|"|§|!|\$|\^|\+|\\|\-|,|\?|=|\*|£|%|°|¨|\`|:|#|\||›|\/|‚|™)/;
        if (tag.match(regexp))
          return new Error('Contains invalid char');

        if (tag.length > 255)
          return new Error('Character string too long');

        const check = await client.query('SELECT * FROM interests WHERE name = $1', [tag]);
        if (check.rowCount === 0) {
          const insertion = await client.query('INSERT INTO interests (name) VALUES ($1) RETURNING *', [tag]);
          await client.query('INSERT INTO user_interests (user_id, interest_id) VALUES ($1, $2)', [user.id, insertion.rows[0].id]);
        }

        if (check.rowCount !== 0)
          await client.query('INSERT INTO user_interests (user_id, interest_id) VALUES ($1, $2)', [user.id, check.rows[0].id]);

        const tags = await client.query('SELECT * FROM interests');
        const userTags = await client.query('SELECT id, interest_id AS interestId FROM user_interests WHERE user_id = $1', [user.id]);
        const filteredUserTags = userTags.rows.map(item => ({ id: item.id, interestId: item.interestid }));
        await updateStatus(user.id);
        return { userTags: filteredUserTags, interests: tags.rows };
      } catch(e) {
        return new Error(e.message);
      }
    },

    removeTagToUser: async (parent, { tag }, ctx) => {
      try {
        const user = await verifyUserToken(ctx.headers);
        if (!user)
          return new Error('Not auth');
        
        await client.query('DELETE FROM user_interests WHERE user_id = $1 AND interest_id = $2', [user.id, tag]);

        const userTags = await client.query('SELECT id, interest_id AS interestId FROM user_interests WHERE user_id = $1', [user.id]);
        const filteredUserTags = userTags.rows.map(item => ({ id: item.id, interestId: item.interestid }));
        await updateStatus(user.id);
        return filteredUserTags;
      } catch(e) {
        return new Error(e.message);
      }
    },

    addUserImage: async (parent, { img, type }, ctx) => {
      try {
        const user = await verifyUserToken(ctx.headers);
        if (!user)
          return new Error('Not auth');

        const imgType = img.substring(img.indexOf('/') + 1, img.indexOf(';base64'));
        if (imgType !== 'jpeg' && imgType !== 'jpg' && imgType !== 'png')
          return new Error('Invalid type');

        const typeCheck = type.split('/')[1];
        if (typeCheck !== 'jpeg' && typeCheck !== 'jpg' && typeCheck !== 'png')
          return new Error('Invalid type');

        const checkDir = fs.existsSync(path.resolve(__dirname, `../public/ressources/${user.id}`));
        if (!checkDir)
          fs.mkdirSync(path.resolve(__dirname, `../public/ressources/${user.id}`));

        const data = img.replace(/^data:image\/\w+;base64,/, "");
        const buf = new Buffer(data, 'base64');
        const name = randtoken.generate(64);
        const splittype = type.split('/')[1];
        const pathName = `../public/ressources/${user.id}/${name}.${splittype}`;
        const res = fs.writeFileSync(path.resolve(__dirname, pathName), buf, { encoding: 'base64' });
        const frontPath = `/ressources/${user.id}/${name}.${splittype}`;
        const pushImg = await client.query('INSERT INTO images (user_id, path) VALUES ($1, $2)', [user.id, frontPath]);
        const getUserImg = await client.query('SELECT id, path FROM images WHERE user_id = $1', [user.id]);
        await updateStatus(user.id);
        return getUserImg.rows;
      } catch (e) {
        return e;
      }
    },

    removeUserImage: async (parent, { imgId, name }, ctx) => {
      try {
        const user = await verifyUserToken(ctx.headers);
        if (!user)
          return new Error('Not auth');

        const checkDir = fs.existsSync(path.resolve(__dirname, `../public/ressources/${user.id}`));
        if (!checkDir) {
          await client.query('DELETE FROM images WHERE user_id = $1', [user.id]);
          return [];
        }

        fs.unlinkSync(path.resolve(__dirname, `../public/ressources/${user.id}/${name}`));
        await client.query('DELETE FROM images WHERE id = $1 AND user_id = $2', [imgId, user.id]);

        if (user.profil_picture === `/ressources/${user.id}/${name}`)
          await client.query('UPDATE user_info SET profil_picture = $1 WHERE id = $2', [null, user.id]);

        const getUserImg = await client.query('SELECT id, path FROM images WHERE user_id = $1', [user.id]);
        await updateStatus(user.id);
        return getUserImg.rows;
      } catch (e) {
        return e;
      }
    },

    updateProfilImg: async (parent, { imgId, name, imgPath }, ctx) => {
      try {
        const user = await verifyUserToken(ctx.headers);
        if (!user)
          return new Error('Not auth');

        const checkDir = fs.existsSync(path.resolve(__dirname, `../public/ressources/${user.id}/${name}`));
        if (!checkDir) {
          await client.query('UPDATE user_info SET profil_picture = $1 WHERE id = $2', [null, user.id]);
          return new Error('Img not exist');
        }

        await client.query('UPDATE user_info SET profil_picture = $1 WHERE id = $2', [imgPath, user.id]);
        const getProfilImg = await client.query('SELECT profil_picture FROM user_info WHERE id = $1', [user.id]);
        await updateStatus(user.id);
        return { path: getProfilImg.rows[0].profil_picture };
      } catch (e) {
        return e;
      }
    },

    updateUserPreferences: async (parent, { ageStart, ageEnd, scoreStart, scoreEnd, location, tags}, ctx) => {
      try {
        // const lol = () => new Promise((r, f) => {
        //   setTimeout(() => r(), 5000);
        // });

        // const ll = await lol();
        // return new Error('Not auth');
        // ///----
        const user = await verifyUserToken(ctx.headers);
        if (!user)
          return new Error('Not auth');

        const checkPref = await client.query('SELECT * FROM user_pref WHERE user_id = $1', [user.id]);
        if (checkPref.rowCount === 0) {
          await client.query(
            'INSERT INTO user_pref (user_id, age_start, age_end, score_start, score_end, location, tags) VALUES ($1, $2, $3, $4, $5, $6, $7)',
            [user.id, ageStart, ageEnd, scoreStart, scoreEnd, location, tags]
          );
        } else {
          await client.query(
            'UPDATE user_pref SET (age_start, age_end, score_start, score_end, location, tags) = ($1, $2, $3, $4, $5, $6) WHERE user_id = $7',
            [ageStart, ageEnd, scoreStart, scoreEnd, location, tags, user.id]
          );
        }

        const resUserPref = await client.query('SELECT * FROM user_pref WHERE user_id = $1', [user.id]);
        return {
          ageStart: resUserPref.rows[0].age_start,
          ageEnd: resUserPref.rows[0].age_end,
          scoreStart: resUserPref.rows[0].score_start,
          scoreEnd: resUserPref.rows[0].score_end,
          location: resUserPref.rows[0].location,
          tags: resUserPref.rows[0].tags
        };
      } catch (e) {
        return e;
      }
    },

    likeUser: async (parent, { userId }, ctx) => {
      try {

        // Check header and get information about the user
        const user = await verifyUserToken(ctx.headers);
        if (!user)
          return new Error('Not auth');

        // Check if like exist
        const checkLikeExist = await client.query('SELECT * FROM user_like WHERE from_user = $1 AND to_user = $2', [user.id, userId]);
        if (checkLikeExist.rowCount > 0)
          return new Error('Already liked');

        // Create the like for the user
        await client.query('INSERT INTO user_like (from_user, to_user) VALUES ($1, $2)', [user.id, userId]);

        // Check if the user block this user account
        const isBlocked = await client.query('SELECT * FROM account_blocked WHERE (from_user_id, to_user_id) = ($1, $2)', [userId, user.id]);

        // Check if the user to like already like this user
        const checkIfLiked = await client.query('SELECT * FROM user_like WHERE (from_user, to_user) = ($1, $2)', [userId, user.id]);
        if (checkIfLiked.rowCount === 1) {

          // Check if a match exist, if it exist update it and if not exist create the match
          const checkMatch = await client.query('SELECT * FROM match WHERE (from_user, to_user) = ($1, $2) OR (from_user, to_user) = ($2, $1)', [user.id, userId]);
          if (checkMatch.rowCount > 0)
            await client.query('UPDATE match SET creation_date WHERE (from_user, to_user) = ($2, $3) OR (from_user, to_user) = ($3, $2)', [new Date(), user.id, userId]);
          else
            await client.query('INSERT INTO match (from_user, to_user, creation_date) VALUES ($1, $2, $3)', [user.id, userId, new Date()]);

          // Create the notification for like and match
          if (isBlocked.rowCount === 0) {
            await client.query('INSERT INTO notification (action, user_id, from_user, creation_date) VALUES ($1, $2, $3, $4)', ['like-back', userId, user.id, new Date()]);
            await client.query('INSERT INTO notification (action, user_id, from_user, creation_date) VALUES ($1, $2, $3, $4)', ['match', userId, user.id, new Date()]);
          }

          await client.query('INSERT INTO notification (action, user_id, from_user, creation_date) VALUES ($1, $2, $3, $4)', ['match', user.id, userId, new Date()]);
        } else {
          if (isBlocked.rowCount === 0)
            await client.query('INSERT INTO notification (action, user_id, from_user, creation_date) VALUES ($1, $2, $3, $4)', ['like', userId, user.id, new Date()]);
        }

        pubSub.publish('notificationCount');

        const recheckMatch = await client.query('SELECT * FROM match WHERE (from_user, to_user) = ($1, $2) OR (from_user, to_user) = ($2, $1)', [user.id, userId]);
        return { isMatched: recheckMatch.rowCount === 0 ? false : true };
      } catch (e) {
        return e;
      }
    },

    unlikeUser: async (parent, { userId }, ctx) => {
      try {
        const user = await verifyUserToken(ctx.headers);
        if (!user)
          return new Error('Not auth');

        const checkLikeExist = await client.query('SELECT * FROM user_like WHERE from_user = $1 AND to_user = $2', [user.id, userId]);
        if (checkLikeExist.rowCount === 0)
          return new Error('Like doesn\'t exist');

        await client.query('DELETE FROM user_like WHERE (from_user, to_user) = ($1, $2)', [user.id, userId]);

        const isBlocked = await client.query('SELECT * FROM account_blocked WHERE (from_user_id, to_user_id) = ($1, $2)', [userId, user.id]);

        const checkMatch = await client.query('SELECT * FROM match WHERE (from_user, to_user) = ($1, $2) OR (from_user, to_user) = ($2, $1)', [user.id, userId]);
        if (checkMatch.rowCount > 0)
          await client.query('DELETE FROM match WHERE (from_user, to_user) = ($1, $2) OR (from_user, to_user) = ($2, $1)', [user.id, userId]);

        if (isBlocked.rowCount === 0) {
          await client.query('INSERT INTO notification (action, user_id, from_user, creation_date) VALUES ($1, $2, $3, $4)', ['unlike', userId, user.id, new Date()]);

          if (checkMatch.rowCount > 0)
            await client.query('INSERT INTO notification (action, user_id, from_user, creation_date) VALUES ($1, $2, $3, $4)', ['unmatch', userId, user.id, new Date()]);   
        }

        if (checkMatch.rowCount > 0)
            await client.query('INSERT INTO notification (action, user_id, from_user, creation_date) VALUES ($1, $2, $3, $4)', ['unmatch', user.id, userId, new Date()]);
        
        pubSub.publish('notificationCount');


        const recheckMatch = await client.query('SELECT * FROM match WHERE (from_user, to_user) = ($1, $2) OR (from_user, to_user) = ($2, $1)', [user.id, userId]);
        return { isMatched: recheckMatch.rowCount === 0 ? false : true };
      } catch (e) {
        return e;
      }
    },

    blockUser: async (_, { userId }, ctx) => {
      try {
        // const lol = () => new Promise((r, f) => {
        //   setTimeout(() => r(), 5000);
        // });

        // const ll = await lol();
        // return new Error('Not auth');
        ///----
        const user = await verifyUserToken(ctx.headers);
        if (!user)
          return new Error('Not auth');

        const check = await client.query('SELECT * FROM account_blocked WHERE from_user_id = $1 AND to_user_id = $2', [user.id, userId]);
        if (check.rowCount > 0)
          return true;

        await client.query('INSERT INTO account_blocked (from_user_id, to_user_id) VALUES ($1, $2)', [user.id, userId]);
        return true;
      } catch (e) {
        return e;
      }
    },

    unblockUser: async (_, { userId }, ctx) => {
      try {
        const user = await verifyUserToken(ctx.headers);
        if (!user)
          return new Error('Not auth');

        const check = await client.query('SELECT * FROM account_blocked WHERE from_user_id = $1 AND to_user_id = $2', [user.id, userId]);
        if (check.rowCount === 0)
          return true;

        await client.query('DELETE FROM account_blocked WHERE from_user_id = $1 AND to_user_id = $2', [user.id, userId]);
        return true;
      } catch (e) {
        return e;
      }
    },

    reportUser: async (_, { userId }, ctx) => {
      try {
        const user = await verifyUserToken(ctx.headers);
        if (!user)
          return new Error('Not auth');

          const check = await client.query('SELECT * FROM account_reported WHERE from_user_id = $1 AND to_user_id = $2', [user.id, userId]);
          if (check.rowCount > 0)
            return true;

          await client.query('INSERT INTO account_reported (from_user_id, to_user_id) VALUES ($1, $2)', [user.id, userId]);
          return true;
      } catch (e) {
        return e;
      }
    }
  },

  Subscription: {
    notificationSub: {
      resolve: async (_, { token }, ctx) => {
        try {
          const user = await verifyUserToken({ authorization: `Bearer ${token}`});
          if (!user)
            return new Error('Not auth');
  
          const notifs = await client.query('SELECT * FROM notification WHERE user_id = $1 AND is_viewed = $2', [user.id, 0]);
          return { count: notifs.rowCount };
        } catch (e) {
          return e;
        }
      },
      subscribe: () => pubSub.asyncIterator('notificationCount')
    }
  }
};

const schema = makeExecutableSchema({
  typeDefs,
  resolvers
});

module.exports = { schema };