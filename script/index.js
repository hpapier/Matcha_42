const faker = require('faker/locale/fr');
const { client } = require('../api/database.js');

const pdate = new Date('01-01-1950');
const ndate = new Date('01-01-2002');
// console.log(faker.name.firstName() + ' ' + faker.name.lastName());
// console.log(faker.image.people());
// console.log(faker.lorem.words(155).substring(0, 250));
// console.log(faker.date.between(pdate, ndate));

const BELGIUM_NORTH_LAT = 51.505145;
const BELGIUM_SOUTH_LAT = 49.497013;
const BELGIUM_EAST_LNG = 6.408124;
const BELGIUM_WEST_LNG = 2.524100;

let listFakeUser = [];
for(let i = 0; i < 600; i++) {
  const fakeLat = Math.random() * (BELGIUM_NORTH_LAT - BELGIUM_SOUTH_LAT) + BELGIUM_SOUTH_LAT;
  const fakeLng = Math.random() * (BELGIUM_EAST_LNG - BELGIUM_WEST_LNG) + BELGIUM_WEST_LNG;
  const score = faker.random.number(99);
  const user = {
    email: faker.internet.email(),
    username: faker.internet.userName(),
    lastname: faker.name.lastName(),
    firstname: faker.name.firstName(),
    password: faker.internet.password(),
    birth_date: faker.date.between(pdate, ndate),
    isconfirmed: 1,
    genre: (i % 2 === 0) ? 'man' : 'woman',
    sexual_orientation: (i % 2 === 0) ? 'woman' : (i % 5 === 0) ? 'bisexual' : 'man',
    bio: faker.lorem.words(155).substring(0, 250),
    popularity_score: (score < 10) ? 10 : score,
    location: JSON.stringify({ lat: fakeLat, lng: fakeLng, formatedName: `${faker.address.country()}, ${faker.address.city()}, ${faker.address.zipCode()}, ${faker.address.streetName()}`}),
    iscomplete: 1,
    creation_date: new Date(),
    profil_picture: faker.image.people()
  };

  listFakeUser.push(user);
}

listFakeUser.forEach(async user => {
  const INSERTION = `
    INSERT INTO user_info
    (email, username, lastname, firstname, password, birth_date, isconfirmed, genre, sexual_orientation, bio, popularity_score, location, iscomplete, creation_date, profil_picture)
    VALUES
    ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
  `;

  const TO_INSERT = [user.email, user.username, user.lastname, user.firstname, user.password, user.birth_date, user.isconfirmed, user.genre, user.sexual_orientation, user.bio, user.popularity_score, user.location, user.iscomplete, user.creation_date, user.profil_picture];
  await client.query(INSERTION, TO_INSERT);
});

const getUser = async () => {
  const allUser = await client.query('SELECT * FROM user_info WHERE id != 17');
  console.log(allUser.rowCount);
  allUser.rows.forEach(item => {
    const listImg = [faker.image.people(), faker.image.people(), faker.image.people(), faker.image.people()];
    listImg.forEach(async img => {
      await client.query('INSERT INTO images (user_id, path) VALUES ($1, $2)', [item.id, img])
    })
  });
}

const pushInterest = async () => {
  const allUser = await client.query('SELECT * FROM user_info WHERE id != 17');
  const interest = await client.query('SELECT * FROM interests');

  allUser.rows.forEach(async item => {
    const intNb = parseInt(Math.random() * 10);
    console.log(intNb);
    for (let i = 0; i <= (intNb === 0 ? 1 : intNb); i++) {
      await client.query('INSERT INTO user_interests (user_id, interest_id) VALUES ($1, $2)', [item.id, interest.rows[i].id]);
    }
  });
}

getUser();
pushInterest();