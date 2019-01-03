const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');

require('dotenv').config();

/*
 |--------------------------------------
 | MySQLDB
 |--------------------------------------
 */

 var connection = require('./dbconnection');


/*
 |--------------------------------------
 | App
 |--------------------------------------
 */
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());



app.use(express.static(path.join(__dirname, '../public/dist/index.html')));


/*
 |--------------------------------------
 | Routes
 |--------------------------------------
 */




var routes = require('./server/routes/api');
app.use('/api', routes);

module.exports = app;

// app.get('*', function(req, res) {
//     res.sendFile(path.join(__dirname, '/dist/index.html'));
//   });


// /*
//  |--------------------------------------
//  | Server
//  |--------------------------------------
//  */

// app.listen(3000);
// console.log('Listening on http://localhost:3000');