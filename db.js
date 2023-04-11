const mysql = require('mysql');

const con = mysql.createConnection({
  host: 'localhost',
  user: 'sqluser',
  password: 'password',
  database: 'my_database',
});

module.exports = con;


