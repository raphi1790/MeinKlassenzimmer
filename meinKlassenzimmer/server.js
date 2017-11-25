const express = require('express');
const app = express();
const jwt = require('express-jwt');
const jwtAuthz = require('express-jwt-authz');
const path = require('path');
const jwksRsa = require('jwks-rsa');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const api = require('./server/routes/api');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Point static path to dist
app.use(express.static(path.join(__dirname, 'dist')));

// Set our api routes
app.use('/api', api);

// Catch all other routes and return the index file
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/index.html'));
});

const checkJwt = jwt({
  // Dynamically provide a signing key based on the kid in the header and the singing keys provided by the JWKS endpoint.
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://meinklassenzimmer.auth0.com/.well-known/jwks.json`
  }),

  // Validate the audience and the issuer.
  audience: 'https://api.meinKlassenzimmer.ch',
  issuer: `https://meinklassenzimmer.auth0.com/`,
  algorithms: ['RS256']
});

const checkScopes = jwtAuthz(['admin:admin']);

app.get('/api/public', function(req, res) {
  res.json({
    message: "Hello from a public endpoint! You don't need to be authenticated to see this."
  });
});

app.get('/api/private', checkJwt, checkScopes, function(req, res) {
  res.json({
    message: 'Hello from a private endpoint! You need to be authenticated and have a scope of read:messages to see this.'
  });
});

app.listen(3000);
console.log('Listening on http://localhost:3000');