// Table `user`
// user:
// --> id
// --> email
// --> username
// --> firstname
// --> lastname
// --> password
// --> birth_date
// --> isconfirmed
// --> genre
// --> sexual_orientation
// --> bio
// --> popularity_score
// --> location
// --> iscomplete
// --> creation_date
// --> last_connexion
// --> is_connected

// CREATE TYPE enum_genre AS ENUM('man', 'woman');
// CREATE TYPE enum_orientation AS ENUM('bisexual', 'man', 'woman');

/*
  CREATE TABLE user_info (
    id                  UUID              NOT NULL PRIMARY KEY,
    email               VARCHAR(100)      NOT NULL,
    username            VARCHAR(25)       NOT NULL,
    lastname            VARCHAR(255)      NOT NULL,
    firstname           VARCHAR(255)      NOT NULL,
    password            VARCHAR(50)       NOT NULL,
    birth_date          DATE              NOT NULL,
    isconfirmed         SMALLINT          NOT NULL DEFAULT 0,
    genre               enum_genre        NOT NULL DEFAULT 'man',
    sexual_orientation  enum_orientation  NOT NULL DEFAULT 'bisexual',
    bio                 VARCHAR(255),
    popularity_score    INTEGER           NOT NULL DEFAULT 0,
    location            VARCHAR(255),
    iscomplete          SMALLINT          NOT NULL DEFAULT 0,
    creation_date       DATE              NOT NULL,
    last_connexion      TIMESTAMP,
    isconnected         SMALLINT          NOT NULL DEFAULT 0,
    confirmation_token  VARCHAR(255),
    reset_token         VARCHAR(255),
    profil_picture      TEXT
  );
*/

// Table `user_pref`
// user_pref
// --> id
// --> user_id
// --> age_start
// --> age_end
// --> score_start
// --> score_end
// --> location
// --> tags

/*
  CREATE TABLE user_pref (
    id          SERIAL    NOT NULL PRIMARY KEY,
    user_id     UUID      NOT NULL,
    age_start   SMALLINT  NOT NULL DEFAULT 18,
    age_end     SMALLINT  NOT NULL DEFAULT 100,
    score_start SMALLINT  NOT NULL DEFAULT 10,
    score_end   SMALLINT  NOT NULL DEFAULT 100,
    location    SMALLINT  NOT NULL DEFAULT 100,
    tags        TEXT
  );
*/

// Table `images`
// images:
// --> id
// --> user_id
// --> path

/*
  CREATE TABLE images (
    id      SERIAL PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    path    VARCHAR(255) NOT NULL
  );
*/

// Table `interests`
// interest:
// --> id
// --> name

/*
  CREATE TABLE interests (
    id    SERIAL PRIMARY KEY,
    name  VARCHAR(255)
  );
*/

// Table `user_interests`
// user_interests:
// --> id
// --> user_id
// --> interests_id

/*
  CREATE TABLE user_interests (
    id            SERIAL PRIMARY KEY,
    user_id       VARCHAR(255)  NOT NULL,
    interest_id   INTEGER      NOT NULL
  );
*/

// Table `notification`
// notification:
// --> id
// --> is_viewed
// --> action
// --> user_id
// --> from

/*
  CREATE TABLE notification (
    id          SERIAL        PRIMARY KEY,
    is_viewed   SMALLINT      NOT NULL DEFAULT 0,
    action      VARCHAR(255)  NOT NULL,
    user_id     VARCHAR(255)  NOT NULL,
    from_user   VARCHAR(255)  NOT NULL
  );
*/

// Table `account_blocked`
// account_blocked:
// --> id
// --> from_user_id
// --> to_user_id

/*
  CREATE TABLE account_blocked (
    id            SERIAL       PRIMARY KEY,
    from_user_id  VARCHAR(255) NOT NULL,
    to_user_id    VARCHAR(255) NOT NULL
  );
*/

// Table `match`
// like:
// --> id
// --> from
// --> to

/*
 CREATE TABLE match (
   id           SERIAL        PRIMARY KEY,
   from_user    VARCHAR(255)  NOT NULL,
   to_user      VARCHAR(255)  NOT NULL
 );
*/

// Table `room`
// room:
// --> id
// --> user_id_one
// --> user_id_two

/*
 CREATE TABLE room (
   id           SERIAL           PRIMARY KEY,
   user_id_one  VARCHAR(255) NOT NULL,
   user_id_two  VARCHAR(255) NOT NULL
 );
*/

// Table `messages`
// messages:
// --> id
// --> from 
// --> to
// --> content
// --> room_id
// --> is_viewed
// --> date

/*
 CREATE TABLE messages (
   id           SERIAL        PRIMARY KEY,
   from_user    VARCHAR(255)  NOT NULL,
   to_user      VARCHAR(255)  NOT NULL,
   content      TEXT          NOT NULL,
   room_id      INTEGER       NOT NULL,
   is_viewed    SMALLINT      NOT NULL DEFAULT 0,
   date         timestamp     NOT NULL
 );
*/



/*
    INSERT INTO images (user_id, path)
    VALUES ('00701b20-8a94-11e8-aaa7-3fa5cd884214', 'kljkl');
*/