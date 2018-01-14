const express = require('express');
const app = express();
const router = express.Router();
const cors = require('cors');
const jwt = require('express-jwt');
const jwtAuthz = require('express-jwt-authz');
const jwksRsa = require('jwks-rsa');

app.use(cors());
/* GET home page. */
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

  router.get('/public', function(req, res) {
    res.json({ message: "Hello from a public endpoint! You don't need to be authenticated to see this." });
  });

  router.get('/private',checkJwt, checkScopes,  function(req, res) {
    res.json({ message: "Hello from a private endpoint! You need to be authenticated and have a scope of admin:admin to see this." });
  });

module.exports = router;