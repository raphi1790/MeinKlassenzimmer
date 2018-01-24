var mysql      = require('mysql');
var CONFIG = require('./config.json');

var connection = mysql.createConnection({
  connectionLimit : 100,
  host     : CONFIG.host,
  user     : CONFIG.user,
  password : CONFIG.password,
  database : CONFIG.database,
  debug : false
});

module.exports = connection;