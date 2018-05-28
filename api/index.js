const http = require('http');
const pg = require('pg');
const host = 'postgres://postgres@127.0.0.1:5432/postgres';

const client = new pg.Client(host);
client.connect();

http.createServer((req, res) => {
    res.write('Hello');
    res.end();
}).listen(8080);