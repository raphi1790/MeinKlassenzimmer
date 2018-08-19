var mysql      = require('mysql');


const connectionName = '';
const dbUser = '';
const dbPass = '';
const dbName = '';

const pool = mysql.createPool({
  connectionLimit : 1,
  socketPath: '/cloudsql/' + connectionName,
  user: dbUser,
  password: dbPass,
  database: dbName
});


module.exports = pool;