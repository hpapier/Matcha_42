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
// --> interests_id
// --> image_id
// --> popularity_score
// --> location
// --> notification_id
// --> is_complete

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