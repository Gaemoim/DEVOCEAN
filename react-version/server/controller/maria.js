const maria = require('mysql');

const conn = maria.createConnection({
    host:'localhost',
    user:'root',
    password:'kim15413',
    database:'devocean'
});

module.exports = conn;