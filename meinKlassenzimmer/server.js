// Get dependencies
const express = require('express');
const mysql = require("mysql");
const path = require('path');
const http = require('http');
const bodyParser = require('body-parser');
const app = express();
const md5 = require('MD5');
const rest = require("./server/routes/api.js");
var CONFIG = require('./config.json');

function REST(){
    var self = this;
    self.connectMysql();
};

//DB connection
REST.prototype.connectMysql = function() {
    var self = this;
    var pool      =    mysql.createPool({
        connectionLimit : 100,
        host     : CONFIG.host,
        user     : CONFIG.user,
        password : CONFIG.password,
        database : CONFIG.database,
        debug    :  false
    });
    pool.getConnection(function(err,connection){
        if(err) {
          self.stop(err);
        } else {
          self.configureExpress(connection);
        }
    });
}
console.log("DB connection estabhlished");
REST.prototype.configureExpress = function (connection) {
    var self = this;
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());
    var router = express.Router();
    app.use('/api', router);
    app.use(express.static(path.join(__dirname, 'dist')));

    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, 'dist/index.html'));
    });
    var rest_router = new rest(router, connection, md5);
    self.startServer();
}

REST.prototype.startServer = function () {
  
  app.listen(3000, function () {
    console.log("All right ! I am alive at Port 3000.");
  });
 

}

REST.prototype.stop = function (err) {
    console.log("ISSUE WITH MYSQL n" + err);
    process.exit(1);
}

new REST();

