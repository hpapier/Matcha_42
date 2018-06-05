// Table `user`
// user:
// --> id
// --> adress_email
// --> username
// --> last_name
// --> first_name
// --> password
// --> is_confirmed
// --> genre
// --> sexual_orientation
// --> bio
// --> popularity_score
// --> location
// --> is_complete
// --> creation_date
// --> last_connexion
// --> is_connected

// Table `images`
// images:
// --> id
// --> user_id
// --> path

// Table `interests`
// interest:
// --> id
// --> name

// Table `user_interests`
// user_interests:
// --> id
// --> user_id
// --> interests_id

// Table `notification`
// notification:
// --> id
// --> is_viewed
// --> action
// --> user_id
// --> from

// Table `account_blocked`
// account_blocked:
// --> id
// --> from_user_id
// --> to_user_id

// Table `like`
// like:
// --> id
// --> from
// --> to

// Table `room`
// room:
// --> id
// --> user_id_one
// --> user_id_two

// Table `messages`
// messages:
// --> id
// --> from 
// --> to
// --> content
// --> room_id
// --> is_viewed
// --> date
