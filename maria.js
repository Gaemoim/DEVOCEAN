const maria = require('mysql');

const conn = maria.createConnection({
    host:'localhost',
    user:'root',
    password:'154131',
    database:'devocean'
});

module.exports = conn;