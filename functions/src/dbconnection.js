var mysql      = require('mysql');


const connectionName = 'meinklassenzimmer-184820:us-central1:meinklassenzimmer-database';
const dbUser = '';
const dbPass = '';
const dbName = 'meinklassenzimmerdb';

const pool = mysql.createPool({
  connectionLimit : 1,
  socketPath: '/cloudsql/' + connectionName,
  user: dbUser,
  password: dbPass,
  database: dbName
});


module.exports = pool;