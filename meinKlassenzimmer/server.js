const express = require('express');
const app = express();
const jwt = require('express-jwt');
const jwtAuthz = require('express-jwt-authz');
const path = require('path');
const jwksRsa = require('jwks-rsa');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

var routes = require('./server/routes/api');
app.use('/api', routes);

app.use(cors());
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: false }));

// Point static path to dist
 app.use(express.static(path.join(__dirname, 'dist')));



app.listen(3000);
console.log('Listening on http://localhost:3000');