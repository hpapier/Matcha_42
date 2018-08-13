const { Client } = require('pg');
const { DBHOST, DBUSER, DBPWD, DBNAME, DBPORT } = require('./config.js');

const client = new Client({
  user: DBUSER,
  host: DBHOST,
  database: DBNAME,
  password: DBPWD,
  port: DBPORT
});

client.connect()
  .then(() => console.log('Database connected'))
  .catch(e => console.error(e));

module.exports = { client };