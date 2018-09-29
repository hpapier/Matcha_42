const faker = require('faker/locale/fr');
const fakerator = require('fakerator')('fr-FR');
const { client } = require('../api/database.js');

const FakerManFirstname = ["Thomas", "Nicolas", "Julien", "Quentin", "Maxime", "Alexandre", "Antoine", "Kévin", "Clément", "Romain", "Pierre", "Lucas", "Florian", "Guillaume", "Valentin", "Jérémy", "Hugo", "Alexis", "Anthony", "Théo", "Paul", "Mathieu", "Benjamin", "Adrien", "Vincent", "Alex", "Arthur", "Louis", "Baptiste", "Dylan", "Corentin", "Thibault", "Jordan", "Nathan", "Simon"];
const FakerWomanFirstname = ["Marie", "Camille", "Léa", "Manon", "Chloé", "Laura", "Julie", "Sarah", "Pauline", "Mathilde", "Marine", "Emma", "Marion", "Lucie", "Anais", "Océane", "Justine", "Morgane", "Clara", "Charlotte", "Juliette", "Emilie", "Lisa", "Mélanie", "Élodie", "Claire", "Ines", "Margaux", "Alice", "Amandine", "Audrey", "Louise", "Noémie", "Clémence", "Amélie"];


const getFirstname = gender => {
  if (gender === 'male')
    return FakerManFirstname[faker.random.number(34)];
  else
    return FakerWomanFirstname[faker.random.number(34)];
}

const pdate = new Date('01-01-1950');
const ndate = new Date('01-01-2002');
// console.log(faker.name.firstName() + ' ' + faker.name.lastName());
// console.log(faker.image.people());
// console.log(faker.lorem.words(155).substring(0, 250));
// console.log(faker.date.between(pdate, ndate));

const FRANCE_NORTH_LAT = 51.124200;
const FRANCE_SOUTH_LAT = 41.314330;
const FRANCE_EAST_LNG = 9.662500;
const FRANCE_WEST_LNG = -5.559100;

let listFakeUser = [];

const fetch = require('node-fetch');

const fetchGender = gender => new Promise((resolve, reject) => {
  fetch(`https://randomuser.me/api/?gender=${gender}`)
  .then(r => r.json())
  .then(r => {
    console.log('-- THEN --');
    resolve(r.results[0].picture.large);
  })
  .catch(e => {
    console.log('__ CATCH __');
    console.log(e)
    reject(e);
  })
});

const generator = async () => {
  for(let i = 0; i < 600; i++) {
    const fakeLat = Math.random() * (FRANCE_NORTH_LAT - FRANCE_SOUTH_LAT) + FRANCE_SOUTH_LAT;
    const fakeLng = Math.random() * (FRANCE_EAST_LNG - -(FRANCE_WEST_LNG)) + FRANCE_WEST_LNG;
    const score = faker.random.number(99);
    const gender = (i % 2 === 0) ? 'male' : 'female';
    const pp = await fetchGender(gender);
    const fn = getFirstname(gender);
    const ln = faker.name.lastName();
    const user = {
      lastname: ln,
      firstname: fn,
      username: faker.internet.userName(fn, ln),
      email: faker.internet.email(this.firstname, this.lastname),
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
      profil_picture: pp,
      pictures: [pp, await fetchGender(gender), await fetchGender(gender), await fetchGender(gender), await fetchGender(gender)]
    };
  
    listFakeUser.push(user);
  }
  
  listFakeUser.forEach(async user => {
    // Profil query
    const INSERTION = `
      INSERT INTO user_info
      (email, username, lastname, firstname, password, birth_date, isconfirmed, genre, sexual_orientation, bio, popularity_score, location, iscomplete, creation_date, profil_picture, last_connexion)
      VALUES
      ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
      RETURNING *;
    `;
  
    const TO_INSERT = [user.email, user.username, user.lastname, user.firstname, user.password, user.birth_date, user.isconfirmed, user.genre, user.sexual_orientation, user.bio, user.popularity_score, user.location, user.iscomplete, user.creation_date, user.profil_picture, new Date()];
    const userInfo = await client.query(INSERTION, TO_INSERT);

    // Picture query
    user.pictures.forEach(async img => {
      await client.query('INSERT INTO images (user_id, path) VALUES ($1, $2)', [userInfo.rows[0].id, img])
    });
  });
  
  // const getUser = async () => {
  //   const allUser = await client.query('SELECT * FROM user_info WHERE id != 17');
  //   console.log(allUser.rowCount);
  //   allUser.rows.forEach(item => {
  //     const listImg = [faker.internet.avatar(), faker.internet.avatar(), faker.internet.avatar(), faker.internet.avatar()];
  //     listImg.forEach(async img => {
  //       await client.query('INSERT INTO images (user_id, path) VALUES ($1, $2)', [item.id, img])
  //     })
  //   });
  // }
  
  const pushInterest = async () => {
    const allUser = await client.query('SELECT * FROM user_info WHERE id != 17');
    const interest = await client.query('SELECT * FROM interests');
  
    allUser.rows.forEach(async item => {
      const intNb = Math.floor(parseInt(Math.random() * 5));
      // console.log(intNb);
      for (let i = 0; i <= (intNb === 0 ? 1 : intNb); i++) {
        await client.query('INSERT INTO user_interests (user_id, interest_id) VALUES ($1, $2)', [item.id, interest.rows[i].id]);
      }

      console.log('INTEREST DONE');
    });
  }

  await pushInterest();
}


generator();